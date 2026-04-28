/* =====================================================================
 * Pfister Filter — Excel/CSV-Upload + dynamische Produktfilter
 * ---------------------------------------------------------------------
 * Nutzt SheetJS (xlsx.full.min.js, via CDN im <head> geladen) fuer .xlsx.
 * CSV wird manuell geparst (kein Drittanbieter-Code).
 * Daten werden in localStorage gespeichert, bleiben ueber Reload hinweg.
 *
 * Erwartetes Spalten-Schema (Header-Zeile):
 *   Name    — Pflicht
 *   Preis   — Pflicht (Zahl, z.B. 1290)
 *   AltPreis— optional (durchgestrichener Preis fuer Sale)
 *   Bild    — optional (URL oder Dateiname, JS faellt auf Platzhalter zurueck)
 *   Badge   — optional (Neu / Sale)
 *   Alle weiteren Spalten (Typ, Groesse, Haertegrad, Material, Farbe,
 *   Marke, ...) werden automatisch als Filter angeboten.
 * ===================================================================== */

(function () {
  const STORAGE_KEY = 'pfister-data-betten';
  const SKIP_FILTER_COLS = new Set(['name', 'preis', 'altpreis', 'bild', 'beschreibung', 'slug']);

  let DATA = [];
  let FILTERS = {};   // { spaltenname: Set([wert1, wert2]) }
  let COLUMNS = [];   // alle Spalten aus den Daten

  /* -------------------- Init -------------------- */

  document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('filter-app');
    if (!container) return;
    renderShell(container);
    bindUI();
    const restored = loadFromStorage();
    if (restored) {
      setData(restored);
      return;
    }
    /* Kein lokaler Upload: versuche die Repo-committed data/produkte.json
       zu laden. Wenn leer / nicht vorhanden: Empty-State. */
    const auto = await loadAutoData();
    if (auto && auto.length) {
      setData(auto, /* silent */ true);
    } else {
      renderEmpty();
    }
  });

  async function loadAutoData() {
    try {
      const res = await fetch('../../../data/produkte.json', { cache: 'no-store' });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) { return null; }
  }

  /* -------------------- UI-Gerüst -------------------- */

  function renderShell(host) {
    host.innerHTML = `
      <div class="filter-toolbar">
        <button class="upload-btn" id="upload-trigger" type="button">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 4v12m-5-5l5-5 5 5M5 20h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>Excel / CSV hochladen</span>
        </button>
        <input type="file" id="file-input" class="visually-hidden" accept=".xlsx,.xls,.csv">
        <button class="demo-btn" id="demo-btn" type="button">Demo-Daten laden</button>
        <button class="reset-btn" id="reset-btn" type="button" hidden>Zurücksetzen</button>
      </div>
      <div class="upload-hint" id="upload-hint">
        Laden Sie eine Excel- oder CSV-Datei mit Ihren Produkten hoch –
        aus den Spalten werden automatisch Filter gebaut.
        <a href="../../../sample-daten-betten.csv" download>Beispieldatei herunterladen</a>
      </div>
      <div class="upload-error" id="upload-error" hidden></div>
      <div class="result-count" id="result-count" hidden></div>
      <div class="filter-panel" id="filter-panel" hidden></div>
      <div class="product-grid" id="dynamic-grid"></div>
    `;
  }

  function bindUI() {
    const input = document.getElementById('file-input');
    document.getElementById('upload-trigger').addEventListener('click', () => input.click());
    input.addEventListener('change', onFileSelected);
    document.getElementById('demo-btn').addEventListener('click', loadDemoData);
    document.getElementById('reset-btn').addEventListener('click', resetAll);

    /* Warnen, wenn SheetJS nach Seitenladen nicht verfuegbar ist. */
    window.addEventListener('load', () => {
      if (typeof XLSX === 'undefined') {
        showError('SheetJS konnte nicht geladen werden (Internet pruefen). CSV funktioniert trotzdem.');
      }
    });
  }

  function showError(msg) {
    const el = document.getElementById('upload-error');
    if (!el) { alert(msg); return; }
    el.textContent = msg;
    el.hidden = false;
  }

  /* -------------------- Datei-Upload -------------------- */

  function onFileSelected(e) {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'csv') {
      parseCSV(file);
    } else if (ext === 'xlsx' || ext === 'xls') {
      parseXLSX(file);
    } else {
      alert('Bitte eine .xlsx-, .xls- oder .csv-Datei waehlen.');
    }
    e.target.value = '';
  }

  function parseCSV(file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const rows = csvToRows(text);
      if (!rows.length) { alert('Datei enthaelt keine Daten.'); return; }
      const [header, ...body] = rows;
      const data = body
        .filter(r => r.some(c => c !== ''))
        .map(r => {
          const obj = {};
          header.forEach((h, i) => { obj[h.trim()] = (r[i] || '').trim(); });
          return obj;
        });
      setData(data);
    };
    reader.readAsText(file, 'UTF-8');
  }

  function parseXLSX(file) {
    if (typeof XLSX === 'undefined') {
      showError('SheetJS konnte nicht geladen werden. Bitte Internet-Verbindung pruefen oder CSV nutzen.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const wb = XLSX.read(new Uint8Array(ev.target.result), { type: 'array' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });
      if (!data.length) { alert('Die Datei enthaelt keine Daten.'); return; }
      /* Werte zu Strings normalisieren, Keys getrimmt. */
      const norm = data.map(row => {
        const out = {};
        Object.keys(row).forEach(k => { out[String(k).trim()] = String(row[k]).trim(); });
        return out;
      });
      setData(norm);
    };
    reader.readAsArrayBuffer(file);
  }

  function csvToRows(text) {
    /* Einfacher CSV-Parser mit Unterstuetzung fuer Anfuehrungszeichen
       und Zeilenumbruechen innerhalb von Zellen. Trenner: Komma oder Semikolon. */
    const rows = [];
    let cur = '', row = [], inQuote = false;
    const sep = detectSeparator(text);
    for (let i = 0; i < text.length; i++) {
      const c = text[i], n = text[i + 1];
      if (inQuote) {
        if (c === '"' && n === '"') { cur += '"'; i++; }
        else if (c === '"') { inQuote = false; }
        else { cur += c; }
      } else {
        if (c === '"') { inQuote = true; }
        else if (c === sep) { row.push(cur); cur = ''; }
        else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
        else if (c === '\r') { /* skip */ }
        else { cur += c; }
      }
    }
    if (cur !== '' || row.length) { row.push(cur); rows.push(row); }
    return rows;
  }
  function detectSeparator(text) {
    const firstLine = text.split(/\r?\n/)[0] || '';
    return (firstLine.split(';').length > firstLine.split(',').length) ? ';' : ',';
  }

  /* -------------------- State + Persistenz -------------------- */

  function setData(data, silent) {
    DATA = data;
    COLUMNS = collectColumns(DATA);
    FILTERS = {};
    if (!silent) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
    }
    renderFilters();
    applyFilters();
    document.getElementById('reset-btn').hidden = silent ? true : false;
    document.getElementById('upload-hint').hidden = true;
    document.getElementById('filter-panel').hidden = false;
    document.getElementById('result-count').hidden = false;
  }

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }

  function resetAll() {
    localStorage.removeItem(STORAGE_KEY);
    DATA = []; FILTERS = {}; COLUMNS = [];
    document.getElementById('reset-btn').hidden = true;
    document.getElementById('upload-hint').hidden = false;
    document.getElementById('filter-panel').hidden = true;
    document.getElementById('result-count').hidden = true;
    renderEmpty();
  }

  function collectColumns(data) {
    const seen = new Set();
    const cols = [];
    data.forEach(row => Object.keys(row).forEach(k => {
      if (!seen.has(k)) { seen.add(k); cols.push(k); }
    }));
    return cols;
  }

  /* -------------------- Filter-Panel rendern -------------------- */

  function renderFilters() {
    const panel = document.getElementById('filter-panel');
    const filterCols = COLUMNS.filter(c => !SKIP_FILTER_COLS.has(c.toLowerCase()) && c.toLowerCase() !== 'badge');

    const priceRanges = buildPriceRanges();

    let html = '<div class="filter-head"><h2>Filter</h2><span class="filter-clear" id="filter-clear">alle löschen</span></div>';

    /* Preis-Range */
    if (hasColumn('Preis') && priceRanges.length) {
      html += `<div class="filter-group"><div class="filter-label">Preis (CHF)</div><div class="filter-pills">`;
      priceRanges.forEach(r => {
        html += `<button class="pill" data-filter-price="${r.min}-${r.max}">${r.label}</button>`;
      });
      html += `</div></div>`;
    }

    filterCols.forEach(col => {
      const values = uniqueValues(col);
      if (!values.length || values.length > 40) return;
      html += `<div class="filter-group"><div class="filter-label">${escapeHtml(col)}</div><div class="filter-pills">`;
      values.forEach(v => {
        html += `<button class="pill" data-filter-col="${escapeAttr(col)}" data-filter-val="${escapeAttr(v)}">${escapeHtml(v)}</button>`;
      });
      html += `</div></div>`;
    });

    panel.innerHTML = html;

    panel.querySelectorAll('[data-filter-col]').forEach(btn => {
      btn.addEventListener('click', () => {
        toggleFilter(btn.dataset.filterCol, btn.dataset.filterVal);
        btn.classList.toggle('active');
        applyFilters();
      });
    });
    panel.querySelectorAll('[data-filter-price]').forEach(btn => {
      btn.addEventListener('click', () => {
        const range = btn.dataset.filterPrice;
        FILTERS['__price'] = FILTERS['__price'] === range ? null : range;
        panel.querySelectorAll('[data-filter-price]').forEach(b => b.classList.remove('active'));
        if (FILTERS['__price']) btn.classList.add('active');
        applyFilters();
      });
    });
    document.getElementById('filter-clear').addEventListener('click', () => {
      FILTERS = {};
      panel.querySelectorAll('.pill.active').forEach(p => p.classList.remove('active'));
      applyFilters();
    });
  }

  function toggleFilter(col, val) {
    if (!FILTERS[col]) FILTERS[col] = new Set();
    if (FILTERS[col].has(val)) FILTERS[col].delete(val);
    else FILTERS[col].add(val);
    if (!FILTERS[col].size) delete FILTERS[col];
  }

  function uniqueValues(col) {
    const s = new Set();
    DATA.forEach(r => {
      const v = (r[col] || '').toString().trim();
      if (v) s.add(v);
    });
    return [...s].sort((a, b) => a.localeCompare(b, 'de', { numeric: true }));
  }

  function hasColumn(name) {
    return COLUMNS.some(c => c.toLowerCase() === name.toLowerCase());
  }

  function buildPriceRanges() {
    const prices = DATA.map(r => parseFloat(String(r['Preis']).replace(/[^0-9.]/g, ''))).filter(n => !isNaN(n));
    if (!prices.length) return [];
    const max = Math.max(...prices);
    if (max < 500) return [{ min: 0, max: max, label: `bis CHF ${max}` }];
    const ranges = [
      { min: 0, max: 500, label: 'bis CHF 500' },
      { min: 500, max: 1000, label: 'CHF 500 – 1\'000' },
      { min: 1000, max: 2000, label: 'CHF 1\'000 – 2\'000' },
      { min: 2000, max: 3000, label: 'CHF 2\'000 – 3\'000' },
      { min: 3000, max: 1e9, label: 'ab CHF 3\'000' },
    ];
    return ranges.filter(r => prices.some(p => p >= r.min && p <= r.max));
  }

  /* -------------------- Filter anwenden + Produkte rendern -------------------- */

  function applyFilters() {
    const filtered = DATA.filter(row => {
      for (const col of Object.keys(FILTERS)) {
        if (col === '__price') {
          const [min, max] = FILTERS[col].split('-').map(Number);
          const p = parseFloat(String(row['Preis']).replace(/[^0-9.]/g, ''));
          if (isNaN(p) || p < min || p > max) return false;
        } else {
          const allowed = FILTERS[col];
          if (!allowed.has((row[col] || '').toString().trim())) return false;
        }
      }
      return true;
    });
    renderProducts(filtered);
    renderCount(filtered.length, DATA.length);
  }

  function renderCount(shown, total) {
    const host = document.getElementById('result-count');
    host.textContent = shown === total
      ? `${total} Produkte`
      : `${shown} von ${total} Produkten`;
  }

  function renderProducts(rows) {
    const host = document.getElementById('dynamic-grid');
    if (!host) return;
    if (window.PfisterCard) {
      window.PfisterCard.renderInto(host, rows);
      return;
    }
    host.innerHTML = rows.map(r => `<a class="product-card" href="#"><div class="product-name">${escapeHtml(r['Name'] || 'Produkt')}</div></a>`).join('');
  }

  function renderEmpty() {
    document.getElementById('dynamic-grid').innerHTML =
      '<p class="muted" style="grid-column:1/-1;padding:24px 0;">Noch keine Daten geladen. Laden Sie oben eine Datei hoch oder klicken Sie auf „Demo-Daten laden".</p>';
  }

  function formatPrice(val) {
    const n = parseFloat(String(val).replace(/[^0-9.]/g, ''));
    if (isNaN(n)) return val;
    return n.toLocaleString('de-CH').replace(/,/g, "'") + '.–';
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function escapeAttr(s) { return escapeHtml(s); }

  /* -------------------- Demo-Daten (50 Betten) -------------------- */

  function loadDemoData() {
    const data = buildDemoData();
    setData(data);
  }

  function buildDemoData() {
    const betten_typen = [
      'Boxspringbett', 'Polsterbett', 'Massivholzbett', 'Metallbett',
      'Futonbett', 'Himmelbett', 'Klappbett', 'Ausziehbett', 'Holzbett'
    ];
    const groessen = ['90x200', '120x200', '140x200', '160x200', '180x200', '200x200'];
    const haerten = ['weich', 'mittel', 'fest'];
    const materialien = ['Stoff', 'Leder', 'Kunstleder', 'Eiche massiv', 'Buche', 'Metall', 'Rattan'];
    const farben = ['grau', 'anthrazit', 'beige', 'weiss', 'schwarz', 'blau', 'braun', 'grün', 'rosa', 'rot', 'gelb'];
    const marken_betten = ['Pfister Collection', 'Swissflex', 'Hülsta', 'Nolte', 'Roviva', 'Schramm', 'Hasena', 'Jensen', 'Riposa', 'Esposa'];
    const staedte = ['Basel', 'Zürich', 'Genève', 'Bern', 'Luzern', 'Davos', 'Sion', 'Lugano', 'Chur', 'Aarau', 'Winterthur', 'Thun', 'St. Gallen', 'Biel', 'Zermatt'];
    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    const out = [];

    /* 60 Betten — mindestens 1 pro Typ garantiert. */
    betten_typen.forEach(typ => {
      groessen.forEach(groesse => { pushBett(typ, groesse); });
    });
    while (out.filter(r => r.Kategorie === 'Bett').length < 60) {
      pushBett(pick(betten_typen), pick(groessen));
    }
    function pushBett(typ, groesse) {
      const base = typ === 'Boxspringbett' ? 2200 : typ === 'Polsterbett' ? 1400
        : typ === 'Massivholzbett' || typ === 'Holzbett' ? 1800
        : typ === 'Metallbett' ? 800 : typ === 'Himmelbett' ? 1600
        : typ === 'Klappbett' ? 700 : typ === 'Ausziehbett' ? 900 : 900;
      const preis = Math.round((base + Math.random() * 1200) / 10) * 10;
      const sale = Math.random() < 0.2;
      const neu = !sale && Math.random() < 0.25;
      out.push({
        Name: `${typ.replace('bett', '')} ${pick(staedte)} ${groesse}`,
        Preis: preis,
        AltPreis: sale ? preis + Math.round(preis * 0.25 / 10) * 10 : '',
        Bild: '',
        Badge: sale ? 'Sale' : neu ? 'Neu' : '',
        Kategorie: 'Bett',
        Typ: typ,
        'Grösse': groesse,
        'Härtegrad': pick(haerten),
        Material: pick(materialien),
        Farbe: pick(farben),
        Marke: pick(marken_betten)
      });
    }

    /* 15 Matratzen */
    for (let i = 0; i < 15; i++) {
      const g = pick(groessen);
      const preis = 390 + Math.round(Math.random() * 1100 / 10) * 10;
      out.push({
        Name: `Matratze ${pick(staedte)} ${g}`,
        Preis: preis, AltPreis: '', Bild: '',
        Badge: Math.random() < 0.2 ? 'Neu' : '',
        Kategorie: 'Matratze',
        Typ: pick(['Federkern', 'Kaltschaum', 'Visco', 'Latex']),
        'Grösse': g,
        'Härtegrad': pick(haerten),
        Material: pick(['Baumwoll-Bezug', 'Polyester-Bezug', 'Merino']),
        Farbe: 'weiss',
        Marke: pick(['Swissflex', 'Roviva', 'Hüsler', 'Schramm'])
      });
    }

    /* 10 Lattenroste */
    for (let i = 0; i < 10; i++) {
      const g = pick(groessen);
      out.push({
        Name: `Lattenrost ${pick(['Komfort', 'Premium', 'Standard', 'Elektrisch'])} ${g}`,
        Preis: 190 + Math.round(Math.random() * 800 / 10) * 10,
        AltPreis: '', Bild: '', Badge: '',
        Kategorie: 'Lattenrost',
        Typ: pick(['manuell', 'elektrisch', 'motorisch']),
        'Grösse': g,
        'Härtegrad': '', Material: 'Buche', Farbe: '', Marke: pick(['Pfister Collection', 'Roviva'])
      });
    }

    /* 8 Nachttische */
    for (let i = 0; i < 8; i++) {
      out.push({
        Name: `Nachttisch ${pick(staedte)}`,
        Preis: 190 + Math.round(Math.random() * 500 / 10) * 10,
        AltPreis: '', Bild: '', Badge: '',
        Kategorie: 'Nachttisch',
        Typ: pick(['stehend', 'hängend']),
        'Grösse': '', 'Härtegrad': '',
        Material: pick(['Eiche massiv', 'Buche', 'MDF']),
        Farbe: pick(farben), Marke: pick(['Pfister Collection', 'Hülsta'])
      });
    }

    /* 6 Bettkästen + 10 Textilien */
    for (let i = 0; i < 6; i++) {
      out.push({
        Name: `Bettkasten ${pick(['Rollo', 'Standard', 'Premium'])}`,
        Preis: 290 + Math.round(Math.random() * 300 / 10) * 10,
        AltPreis: '', Bild: '', Badge: '',
        Kategorie: 'Bettkasten', Typ: '',
        'Grösse': pick(['140x200', '160x200', '180x200']), 'Härtegrad': '',
        Material: pick(['Stoff', 'Leder']),
        Farbe: pick(farben), Marke: 'Pfister Collection'
      });
    }
    for (let i = 0; i < 10; i++) {
      out.push({
        Name: `Bettwäsche Set ${pick(['Linea', 'Blanca', 'Nero', 'Ticino'])}`,
        Preis: 59 + Math.round(Math.random() * 150 / 10) * 10,
        AltPreis: '', Bild: '', Badge: '',
        Kategorie: 'Textil', Typ: 'Bettwäsche',
        'Grösse': pick(['160x210', '200x210', '240x240']), 'Härtegrad': '',
        Material: pick(['Baumwolle', 'Leinen', 'Satin', 'Jersey']),
        Farbe: pick(farben), Marke: 'Pfister Collection'
      });
    }

    return out;
  }
})();
