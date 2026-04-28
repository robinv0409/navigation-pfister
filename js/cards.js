/* =====================================================================
 * Pfister Product Card — geteilte Render-Logik für filter.js + subcategory.js
 * ---------------------------------------------------------------------
 * Pfister-Style Kachel: Bild/Platzhalter, Discount-Kreis, Online-Only-Pill,
 * Marke (UPPERCASE), Name, Preis (rot mit Cent-Hochstellung), Alt-Preis
 * durchgestrichen, Sterne-Rating mit Wert + Reviews, Farb-Punkt unten.
 *
 * Nutzung:
 *   PfisterCard.render(record) → HTML-String
 *   PfisterCard.renderInto(host, rows) → ersetzt Inhalt von host
 * ===================================================================== */

(function () {
  /* Farbname → CSS-Wert für den Color-Dot. */
  const COLOR_MAP = {
    anthrazit: '#3a3a3a',
    schwarz:   '#1a1a1a',
    weiss:     '#f5f5f5',
    'weiß':    '#f5f5f5',
    grau:      '#888',
    silber:    '#bdbdbd',
    beige:     '#d8c5a0',
    'crème':   '#f0e8d0',
    creme:     '#f0e8d0',
    braun:     '#6b4a2b',
    taupe:     '#b8a99a',
    rot:       '#c8102e',
    blau:      '#4a6fa5',
    'grün':    '#5e7a4f',
    gruen:     '#5e7a4f',
    gelb:      '#e6c84a',
    rosa:      '#e7b8c2',
    pink:      '#e7b8c2',
    natur:     '#cdb89b',
    eiche:     '#a87a4f',
    nuss:      '#5d3f25',
  };

  function colorToCss(name) {
    if (!name) return null;
    const k = String(name).toLowerCase().trim().split(/[ ,/]/)[0];
    return COLOR_MAP[k] || '#888';
  }

  function formatPriceParts(val) {
    const n = parseFloat(String(val).replace(',', '.').replace(/[^0-9.]/g, ''));
    if (isNaN(n)) return null;
    const whole = Math.floor(n).toLocaleString('de-CH').replace(/,/g, "'");
    const cents = String(Math.round((n - Math.floor(n)) * 100)).padStart(2, '0');
    return { whole, cents };
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );
  }

  function render(r) {
    const onlineOnly = String(r['OnlineOnly'] || '').toLowerCase() === 'true';
    const brand     = (r['Marke'] || '').toString().trim();
    const name      = (r['Name'] || 'Produkt').toString().trim();
    const farbe     = (r['Farbe'] || '').toString().trim();
    const discount  = (r['Discount'] || '').toString().trim();
    const altPreis  = (r['AltPreis'] || '').toString().trim();
    const isSale    = !!altPreis;
    const productUrl = (r['ProduktURL'] || '').toString().trim();
    const img       = (r['Bild'] || '').toString().trim();
    const ratingNum = parseFloat(r['Rating']) || 0;
    const reviewCnt = (r['ReviewCount'] || '').toString().trim();

    const preisParts = formatPriceParts(r['Preis']);
    const altParts   = altPreis ? formatPriceParts(altPreis) : null;

    const dotCss = colorToCss(farbe);

    const linkAttrs = productUrl
      ? `href="${esc(productUrl)}" target="_blank" rel="noopener"`
      : 'href="#"';

    const imgHtml = img
      ? `<img src="${esc(img)}" alt="${esc(name)}" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'img-placeholder',textContent:''}))"/>`
      : '<div class="img-placeholder"></div>';

    const priceHtml = preisParts
      ? `<span class="product-price-new">CHF ${preisParts.whole}.<sup>${preisParts.cents}</sup></span>`
      : '';
    const oldHtml = altParts
      ? `<span class="product-price-old">CHF ${altParts.whole}.${altParts.cents}</span>`
      : '';

    const ratingPct = Math.max(0, Math.min(100, (ratingNum / 5) * 100)).toFixed(1);
    const ratingHtml = ratingNum > 0
      ? `<div class="product-rating">
          <span class="stars" style="--rating:${ratingPct}%"></span>
          <span class="rating-value">${ratingNum.toFixed(1)}</span>
          ${reviewCnt ? `<span class="review-count">(${esc(reviewCnt)})</span>` : ''}
         </div>`
      : '';

    return `
      <a class="product-card${isSale ? '' : ' no-sale'}" ${linkAttrs}>
        <div class="product-card-img">
          ${imgHtml}
          ${discount ? `<div class="product-discount">-${esc(discount)}%</div>` : ''}
        </div>
        <div class="product-card-body">
          ${onlineOnly ? '<div class="product-pill">Online Only</div>' : ''}
          ${brand ? `<div class="product-brand">${esc(brand)}</div>` : ''}
          <div class="product-name">${esc(name)}</div>
          <div class="product-price">${priceHtml}${oldHtml}</div>
          ${ratingHtml}
          ${dotCss ? `<div class="product-color-dot" style="background:${dotCss};${dotCss === '#f5f5f5' ? 'box-shadow:0 0 0 1px #ccc;' : ''}"></div>` : ''}
        </div>
      </a>
    `;
  }

  function renderInto(host, rows) {
    if (!host) return;
    if (!rows || !rows.length) {
      host.innerHTML = '<p class="muted" style="grid-column:1/-1;padding:24px 0;">Keine Produkte in dieser Auswahl.</p>';
      return;
    }
    host.innerHTML = rows.map(render).join('');
  }

  window.PfisterCard = { render, renderInto };
})();
