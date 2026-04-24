/* =====================================================================
 * Pfister Subcategory — Pre-gefilterte Produkt-Grids auf Level-4/5/6
 * ---------------------------------------------------------------------
 * Liest den zentral (auf Betten & Matratzen) gespeicherten Datensatz
 * aus localStorage und zeigt die Produkte, die dem filterSpec der
 * aktuellen Seite entsprechen. Kein Drittanbieter-Code.
 *
 * Nutzung im HTML:
 *   <body data-filter-spec='{"Typ":"Boxspringbett","Grösse":"180x200"}' ...>
 *   <div id="subcat-app" data-upload-path="../../../../../de/produkte/betten-matratzen/"></div>
 * ===================================================================== */

(function () {
  const STORAGE_KEY = 'pfister-data-betten';

  document.addEventListener('DOMContentLoaded', () => {
    const host = document.getElementById('subcat-app');
    if (!host) return;
    const uploadPath = host.dataset.uploadPath || '../../../de/produkte/betten-matratzen/';
    let spec = {};
    try { spec = JSON.parse(document.body.dataset.filterSpec || '{}'); } catch (e) {}

    const data = loadData();
    if (!data.length) {
      host.innerHTML = `
        <div class="upload-hint" style="border-top:1px solid var(--grey-mid);">
          Noch keine Produkt-Daten geladen.
          <a href="${uploadPath}">Auf der Hauptseite hochladen</a> oder
          dort auf „Demo-Daten laden" klicken – die Produkte erscheinen
          danach automatisch auch in dieser Unterkategorie.
        </div>
      `;
      return;
    }

    const matched = data.filter(row => matchesSpec(row, spec));
    host.innerHTML = `
      <div class="result-count">${matched.length} von ${data.length} Produkten</div>
      <div class="product-grid" id="subcat-grid"></div>
    `;
    renderProducts(matched, document.getElementById('subcat-grid'));
  });

  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function matchesSpec(row, spec) {
    for (const key of Object.keys(spec)) {
      const want = spec[key];
      const have = (row[key] == null ? '' : String(row[key])).trim();
      if (Array.isArray(want)) {
        if (!want.map(String).includes(have)) return false;
      } else {
        if (have !== String(want)) return false;
      }
    }
    return true;
  }

  function renderProducts(rows, host) {
    if (!rows.length) {
      host.innerHTML = '<p class="muted" style="grid-column:1/-1;padding:24px 0;">Keine Produkte in dieser Auswahl. Laden Sie weitere Daten hoch, um Treffer zu sehen.</p>';
      return;
    }
    host.innerHTML = rows.map(r => {
      const name = esc(r['Name'] || 'Produkt');
      const price = r['Preis'] ? `CHF ${formatPrice(r['Preis'])}` : '';
      const old = r['AltPreis'] ? `<span class="old">CHF ${formatPrice(r['AltPreis'])}</span>` : '';
      const priceHtml = r['AltPreis'] ? `${old}<span class="new">${price}</span>` : price;
      const badge = r['Badge'] && r['Badge'].toLowerCase() === 'sale' ? '<span class="badge badge-sale">Sale</span>'
                  : r['Badge'] && r['Badge'].toLowerCase() === 'neu' ? '<span class="badge">Neu</span>' : '';
      const img = r['Bild'] ? esc(r['Bild']) : '';
      return `
        <a class="product-card" href="#">
          <div class="card-img">${badge}<img src="${img}" alt="${name}" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'img-placeholder',textContent:this.alt}))"/></div>
          <div class="product-name">${name}</div>
          <div class="product-price">${priceHtml}</div>
        </a>
      `;
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
