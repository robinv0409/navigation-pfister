/* =====================================================================
 * Pfister Subcategory — Pre-gefilterte Produkt-Grids + Filter-Pills
 * ---------------------------------------------------------------------
 * Liest Produkt-Daten aus einer dieser Quellen (in Priorität):
 *   1. localStorage (wenn User per Browser-Upload gesetzt hat)
 *   2. data/produkte.json (beim Repo committed via tools/import_excel.py)
 * Filtert mit einem Seiten-spezifischen filterSpec und bietet zusätzlich
 * eine Live-Filter-UI in fester Reihenfolge:
 *   Matratzenmass · Farbe · Material · Produktart
 *
 * Nutzung im HTML:
 *   <body data-filter-spec='{"Typ":"Boxspringbett","Grösse":"180x200"}' ...>
 *   <div id="subcat-app" data-upload-path="..."></div>
 * ===================================================================== */

(function () {
  const STORAGE_KEY = 'pfister-data-betten';

  /* Anzeigename → mögliche Excel-Spalten (erste Treffer-Spalte gewinnt). */
  const FILTER_ORDER = [
    { label: 'Matratzenmass', cols: ['Matratzenmass', 'Grösse', 'Groesse', 'Mass'] },
    { label: 'Farbe',         cols: ['Farbe'] },
    { label: 'Material',      cols: ['Material'] },
    { label: 'Produktart',    cols: ['Produktart', 'Typ'] },
  ];

  /* Leaf-Seiten (z.B. Boxspringbett 180x200) haben den Filter schon
     vollständig angewendet — keine zusätzliche Filter-UI zeigen. */
  const SUPPRESS_FILTER_UI = () =>
    document.body.classList.contains('is-indexed-filter');

  let DATA = [];
  let SPEC = {};
  let UI_FILTERS = {};   // { label: Set(values) }
  let UPLOAD_PATH = '';

  document.addEventListener('DOMContentLoaded', async () => {
    const host = document.getElementById('subcat-app');
    if (!host) return;
    UPLOAD_PATH = host.dataset.uploadPath || '../../../de/produkte/betten-matratzen/';
    try { SPEC = JSON.parse(document.body.dataset.filterSpec || '{}'); } catch (e) {}

    DATA = await loadData();
    if (!DATA.length) {
      host.innerHTML = `
        <div class="upload-hint" style="border-top:1px solid var(--grey-mid);">
          Noch keine Produkt-Daten vorhanden.
          <a href="${UPLOAD_PATH}">Auf der Hauptseite hochladen</a> oder
          dort auf „Demo-Daten laden" klicken – die Produkte erscheinen
          danach automatisch auch hier.
        </div>
      `;
      return;
    }

    /* Seitengrund-gefiltert (gem. filterSpec). */
    const baseFiltered = DATA.filter(r => matchesSpec(r, SPEC));

    host.innerHTML = `
      ${SUPPRESS_FILTER_UI() ? '' : '<div class="subcat-filter-panel" id="subcat-filters"></div>'}
      <div class="result-count" id="subcat-count"></div>
      <div class="product-grid" id="subcat-grid"></div>
    `;

    if (!SUPPRESS_FILTER_UI()) renderFilters(baseFiltered);
    applyAndRender();
  });

  async function loadData() {
    /* 1. localStorage hat Vorrang (User-Upload lebt lokal). */
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.length) return parsed;
      }
    } catch (e) {}
    /* 2. Repo-committed JSON via script-relative URL (immer korrekt,
          unabhängig von der Verzeichnistiefe der aktuellen Seite). */
    try {
      const url = resolveFromScript('data/produkte.json');
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) {
        console.warn('[pfister] data/produkte.json nicht erreichbar:', res.status, url);
        return [];
      }
      return await res.json();
    } catch (e) {
      console.warn('[pfister] Fetch fehlgeschlagen:', e);
      return [];
    }
  }

  function resolveFromScript(rel) {
    /* Findet die absolute URL zu /<repo-root>/<rel> ausgehend von
       js/subcategory.js — robust für jede Verzeichnistiefe. */
    const s = document.querySelector('script[src*="subcategory.js"]');
    if (!s) return rel;
    return new URL('../' + rel, s.src).href;
  }

  function matchesSpec(row, spec) {
    for (const key of Object.keys(spec)) {
      const want = spec[key];
      const have = (row[key] == null ? '' : String(row[key])).trim();
      if (Array.isArray(want)) {
        if (!want.map(String).includes(have)) return false;
      } else if (String(want) !== have) {
        return false;
      }
    }
    return true;
  }

  /* --------- Filter-UI --------- */

  function resolveColumn(cols) {
    /* Erste Spalte, die in den Daten existiert und mind. einen Wert hat. */
    for (const c of cols) {
      if (DATA.some(r => (r[c] || '').toString().trim() !== '')) return c;
    }
    return null;
  }

  function uniqueValues(col, rows) {
    const s = new Set();
    rows.forEach(r => {
      const v = (r[col] == null ? '' : String(r[col])).trim();
      if (v) s.add(v);
    });
    return [...s].sort((a, b) => a.localeCompare(b, 'de', { numeric: true }));
  }

  function renderFilters(baseRows) {
    const host = document.getElementById('subcat-filters');
    if (!host) return;
    const groups = [];
    FILTER_ORDER.forEach(f => {
      const col = resolveColumn(f.cols);
      if (!col) return;
      const values = uniqueValues(col, baseRows);
      if (values.length < 2) return; /* Nur ein Wert → Filter bringt nichts. */
      groups.push({ label: f.label, col, values });
    });
    if (!groups.length) { host.hidden = true; return; }

    let html = '<div class="filter-head"><h2>Filter</h2><button class="filter-clear" id="subcat-filter-clear" type="button">alle löschen</button></div>';
    groups.forEach(g => {
      html += `<div class="filter-group"><div class="filter-label">${esc(g.label)}</div><div class="filter-pills">`;
      g.values.forEach(v => {
        html += `<button class="pill" type="button" data-col="${esc(g.col)}" data-val="${esc(v)}">${esc(v)}</button>`;
      });
      html += `</div></div>`;
    });
    host.innerHTML = html;

    host.querySelectorAll('[data-col]').forEach(btn => {
      btn.addEventListener('click', () => {
        const col = btn.dataset.col, val = btn.dataset.val;
        if (!UI_FILTERS[col]) UI_FILTERS[col] = new Set();
        if (UI_FILTERS[col].has(val)) {
          UI_FILTERS[col].delete(val);
          btn.classList.remove('active');
        } else {
          UI_FILTERS[col].add(val);
          btn.classList.add('active');
        }
        if (!UI_FILTERS[col].size) delete UI_FILTERS[col];
        applyAndRender();
      });
    });
    document.getElementById('subcat-filter-clear').addEventListener('click', () => {
      UI_FILTERS = {};
      host.querySelectorAll('.pill.active').forEach(p => p.classList.remove('active'));
      applyAndRender();
    });
  }

  function applyAndRender() {
    const filtered = DATA.filter(r => {
      if (!matchesSpec(r, SPEC)) return false;
      for (const col of Object.keys(UI_FILTERS)) {
        const allowed = UI_FILTERS[col];
        if (!allowed.has((r[col] == null ? '' : String(r[col])).trim())) return false;
      }
      return true;
    });
    renderProducts(filtered, document.getElementById('subcat-grid'));
    const total = DATA.filter(r => matchesSpec(r, SPEC)).length;
    const countHost = document.getElementById('subcat-count');
    if (countHost) {
      countHost.textContent = filtered.length === total
        ? `${total} Produkte`
        : `${filtered.length} von ${total} Produkten`;
    }
  }

  function renderProducts(rows, host) {
    if (!host) return;
    /* Pfister-Card-Renderer (window.PfisterCard, geladen via js/cards.js). */
    if (window.PfisterCard) {
      window.PfisterCard.renderInto(host, rows);
      return;
    }
    /* Defensive Fallback, falls cards.js nicht geladen ist. */
    host.innerHTML = rows.map(r => {
      const name = esc(r['Name'] || 'Produkt');
      const price = r['Preis'] ? `CHF ${formatPrice(r['Preis'])}` : '';
      return `<a class="product-card" href="#"><div class="product-name">${name}</div><div class="product-price">${price}</div></a>`;
    }).join('');
  }

  function formatPrice(val) {
    const n = parseFloat(String(val).replace(/[^0-9.]/g, ''));
    if (isNaN(n)) return val;
    return n.toLocaleString('de-CH').replace(/,/g, "'") + '.–';
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
})();
