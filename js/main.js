/* =====================================================================
 * Pfister Mobile Prototype — zentrale Navigation & Interaktion
 * ---------------------------------------------------------------------
 * NAV_DATA ist die SINGLE SOURCE OF TRUTH für Struktur, Navigation,
 * Breadcrumbs und Cross-Links. Um neue Einträge / eine 3. Ebene /
 * Cross-Links zu ergänzen, nur dieses Objekt editieren.
 * ===================================================================== */

const SITE_BASE = 'https://robinv0409.github.io/navigation-pfister/';

/* Knoten-Schema (rekursiv identisch):
 *   label    — Anzeigename
 *   url      — Pfad ab Repo-Root (z.B. "de/produkte/sofas-sessel/")
 *   slug     — Kurzkey (eindeutig); Breadcrumb + related lösen darüber auf
 *   image    — optionaler Pfad ab Repo-Root (Fallback: grauer Platzhalter)
 *   highlight— optional: rot im Menü (Angebote)
 *   children — Array weiterer Knoten (leer wenn noch keine 3. Ebene)
 *   related  — Array von Slugs für Cross-Links ("interessiert Sie auch")
 */
const NAV_DATA = {
  produkte: {
    label: 'Produkte', url: 'de/produkte/', slug: 'produkte',
    image: 'images/cat-produkte.jpg',
    children: [
      { label: 'Betten & Matratzen', url: 'de/produkte/betten-matratzen/', slug: 'betten-matratzen',
        image: 'images/cat-betten-matratzen.jpg',
        related: ['schlafzimmer', 'textilien'],
        children: [] /* Platzhalter: z.B. Gästebetten, Boxspringbetten — erweitern hier */ },
      { label: 'Sofas & Sessel', url: 'de/produkte/sofas-sessel/', slug: 'sofas-sessel',
        image: 'images/cat-sofas-sessel.jpg',
        related: ['wohnzimmer', 'dekoration'],
        children: [] /* Platzhalter: z.B. Schlafsofas, Ecksofas */ },
      { label: 'Tische & Stühle', url: 'de/produkte/tische-stuehle/', slug: 'tische-stuehle',
        image: 'images/cat-tische-stuehle.jpg',
        related: ['esszimmer', 'buero'],
        children: [] },
      { label: 'Garten & Balkon', url: 'de/produkte/garten-balkon/', slug: 'garten-balkon',
        image: 'images/cat-garten-balkon.jpg',
        related: ['garten'],
        children: [] },
      { label: 'Vorhänge', url: 'de/produkte/vorhaenge/', slug: 'vorhaenge',
        image: 'images/cat-vorhaenge.jpg',
        related: ['wohnzimmer', 'schlafzimmer'],
        children: [] },
      { label: 'Beleuchtung', url: 'de/produkte/beleuchtung/', slug: 'beleuchtung',
        image: 'images/cat-beleuchtung.jpg',
        related: ['wohnzimmer', 'esszimmer'],
        children: [] },
      { label: 'Dekoration', url: 'de/produkte/dekoration/', slug: 'dekoration',
        image: 'images/cat-dekoration.jpg',
        related: ['wohnzimmer', 'textilien'],
        children: [] },
      { label: 'Baby & Kinder', url: 'de/produkte/baby-kinder/', slug: 'baby-kinder',
        image: 'images/cat-baby-kinder.jpg',
        related: ['kinderzimmer', 'babyzimmer'],
        children: [] },
      { label: 'Textilien', url: 'de/produkte/textilien/', slug: 'textilien',
        image: 'images/cat-textilien.jpg',
        related: ['schlafzimmer', 'dekoration'],
        children: [] }
    ]
  },
  raeume: {
    label: 'Räume', url: 'de/raeume/', slug: 'raeume',
    image: 'images/cat-raeume.jpg',
    children: [
      { label: 'Schlafzimmer', url: 'de/raeume/schlafzimmer/', slug: 'schlafzimmer',
        image: 'images/cat-schlafzimmer.jpg', related: ['betten-matratzen', 'textilien'], children: [] },
      { label: 'Wohnzimmer', url: 'de/raeume/wohnzimmer/', slug: 'wohnzimmer',
        image: 'images/cat-wohnzimmer.jpg', related: ['sofas-sessel', 'beleuchtung', 'dekoration'], children: [] },
      { label: 'Esszimmer', url: 'de/raeume/esszimmer/', slug: 'esszimmer',
        image: 'images/cat-esszimmer.jpg', related: ['tische-stuehle', 'beleuchtung'], children: [] },
      { label: 'Garten', url: 'de/raeume/garten/', slug: 'garten',
        image: 'images/cat-garten.jpg', related: ['garten-balkon'], children: [] },
      { label: 'Küche', url: 'de/raeume/kueche/', slug: 'kueche',
        image: 'images/cat-kueche.jpg', related: ['tische-stuehle'], children: [] },
      { label: 'Büro', url: 'de/raeume/buero/', slug: 'buero',
        image: 'images/cat-buero.jpg', related: ['tische-stuehle', 'beleuchtung'], children: [] },
      { label: 'Kinderzimmer', url: 'de/raeume/kinderzimmer/', slug: 'kinderzimmer',
        image: 'images/cat-kinderzimmer.jpg', related: ['baby-kinder'], children: [] },
      { label: 'Babyzimmer', url: 'de/raeume/babyzimmer/', slug: 'babyzimmer',
        image: 'images/cat-babyzimmer.jpg', related: ['baby-kinder'], children: [] },
      { label: 'Jugendzimmer', url: 'de/raeume/jugendzimmer/', slug: 'jugendzimmer',
        image: 'images/cat-jugendzimmer.jpg', related: ['baby-kinder', 'textilien'], children: [] },
      { label: 'Badezimmer', url: 'de/raeume/badezimmer/', slug: 'badezimmer',
        image: 'images/cat-badezimmer.jpg', related: ['textilien'], children: [] },
      { label: 'Entrée & Diele', url: 'de/raeume/entree-diele/', slug: 'entree-diele',
        image: 'images/cat-entree-diele.jpg', related: ['beleuchtung', 'dekoration'], children: [] }
    ]
  },
  marken: {
    label: 'Marken', url: 'de/marken/', slug: 'marken',
    image: 'images/cat-marken.jpg',
    children: [] /* Platzhalter — wird später befüllt */
  },
  angebote: {
    label: 'Angebote', url: 'de/angebote/', slug: 'angebote',
    image: 'images/cat-angebote.jpg', highlight: true,
    children: []
  }
};

/* --------- Auflösung & Pfad-Hilfen --------- */

/* Absolute URL zur Repo-Root im aktuellen Hosting (Local oder GH Pages).
   Abgeleitet aus dem <script>-src — immer relativ zum Dokument korrekt. */
function siteRootUrl() {
  const s = document.currentScript || document.querySelector('script[src*="main.js"]');
  return new URL('../', s.src).href;
}
const SITE_ROOT = siteRootUrl();

/* Gibt eine absolute URL für einen relativen Repo-Pfad (z.B. "de/produkte/"). */
function resolveUrl(relPath) {
  if (!relPath) return '#';
  return new URL(relPath, SITE_ROOT).href;
}

/* Rekursiver Lookup über NAV_DATA nach slug (top-level + alle Kinder). */
function findNodeBySlug(slug) {
  return findInChildren(slug, Object.values(NAV_DATA));
}
function findInChildren(slug, arr) {
  for (const c of arr) {
    if (c.slug === slug) return c;
    if (c.children && c.children.length) {
      const hit = findInChildren(slug, c.children);
      if (hit) return hit;
    }
  }
  return null;
}

/* --------- Header + Burger-Overlay --------- */

function initHeader() {
  const slot = document.getElementById('site-header');
  if (!slot) return;
  slot.innerHTML = `
    <header class="header">
      <a href="${resolveUrl('index.html')}" class="logo" aria-label="Pfister Startseite">
        <img src="${resolveUrl('images/pfister-logo.png')}" alt="Pfister" class="logo-img" />
        <span class="logo-text">pfister</span>
      </a>
      <div class="header-actions">
        <button class="icon-btn" aria-label="Suche">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
        <button class="icon-btn" aria-label="Warenkorb">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 5h3l2.5 11h9L21 8H8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="20" r="1.5" fill="currentColor"/><circle cx="18" cy="20" r="1.5" fill="currentColor"/></svg>
        </button>
        <button class="icon-btn burger" id="burger-btn" aria-label="Menü öffnen" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
    <div class="backdrop" id="nav-backdrop" hidden></div>
    <aside class="overlay" id="nav-overlay" aria-hidden="true">
      <div class="overlay-panels" id="overlay-panels"></div>
      <nav class="overlay-footer">
        <a href="#">Filialen</a>
        <a href="#">Service</a>
        <a href="#">Inspiration</a>
        <div class="lang">
          <span class="active">DE</span>
          <a href="#">FR</a>
          <a href="#">IT</a>
        </div>
      </nav>
    </aside>
  `;

  document.getElementById('burger-btn').addEventListener('click', toggleNav);
  document.getElementById('nav-backdrop').addEventListener('click', closeNav);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

  renderOverlayRoot();
}

function renderOverlayRoot() {
  const wrap = document.getElementById('overlay-panels');
  wrap.innerHTML = '';
  const rootItems = Object.values(NAV_DATA);
  wrap.appendChild(buildPanel(
    { label: 'Menü', children: rootItems, url: null, slug: '__root__' },
    0, null
  ));
  activatePanel(0);
}

function buildPanel(node, depth, parentNode) {
  const panel = document.createElement('div');
  panel.className = 'overlay-panel';
  panel.dataset.depth = String(depth);

  const header = document.createElement('div');
  header.className = 'panel-header';
  if (parentNode) {
    const back = document.createElement('button');
    back.className = 'panel-back';
    back.innerHTML = '<span aria-hidden="true">‹</span> Zurück';
    back.addEventListener('click', () => closeToDepth(depth - 1));
    header.appendChild(back);
  }
  const title = document.createElement('h2');
  title.textContent = node.label;
  header.appendChild(title);
  panel.appendChild(header);

  /* Bei vorhandener URL des Parents: Direktlink zur Übersichtsseite. */
  if (parentNode && parentNode.url) {
    const overviewLink = document.createElement('a');
    overviewLink.className = 'panel-overview';
    overviewLink.href = resolveUrl(parentNode.url);
    overviewLink.textContent = 'Alle ' + parentNode.label + ' ansehen';
    panel.appendChild(overviewLink);
  }

  const list = document.createElement('ul');
  list.className = 'panel-list';
  (node.children || []).forEach(child => {
    const li = document.createElement('li');
    const hasChildren = child.children && child.children.length > 0;
    if (hasChildren) {
      const btn = document.createElement('button');
      btn.className = 'panel-item' + (child.highlight ? ' highlight' : '');
      btn.innerHTML = `<span>${child.label}</span><span class="chev" aria-hidden="true">›</span>`;
      btn.addEventListener('click', () => openChild(child, depth + 1));
      li.appendChild(btn);
    } else {
      const a = document.createElement('a');
      a.className = 'panel-item' + (child.highlight ? ' highlight' : '');
      a.href = resolveUrl(child.url);
      a.innerHTML = `<span>${child.label}</span><span class="chev" aria-hidden="true">›</span>`;
      li.appendChild(a);
    }
    list.appendChild(li);
  });
  panel.appendChild(list);

  return panel;
}

function openChild(node, depth) {
  const wrap = document.getElementById('overlay-panels');
  /* Entferne eventuell bereits geöffnete tiefere Panels. */
  [...wrap.children].forEach(p => {
    if (Number(p.dataset.depth) >= depth) p.remove();
  });
  /* Finde Parent-Node zum Anzeigen des "Alle ansehen"-Links. */
  wrap.appendChild(buildPanel(node, depth, node));
  requestAnimationFrame(() => activatePanel(depth));
}

function closeToDepth(depth) {
  activatePanel(depth);
  /* Nach Transition entfernen wir die tieferen Panels. */
  setTimeout(() => {
    const wrap = document.getElementById('overlay-panels');
    [...wrap.children].forEach(p => {
      if (Number(p.dataset.depth) > depth) p.remove();
    });
  }, 320);
}

function activatePanel(depth) {
  const wrap = document.getElementById('overlay-panels');
  [...wrap.children].forEach(p => {
    p.classList.toggle('active', Number(p.dataset.depth) === depth);
    p.classList.toggle('behind', Number(p.dataset.depth) < depth);
  });
}

function toggleNav() {
  const open = document.body.classList.toggle('nav-open');
  document.body.classList.toggle('no-scroll', open);
  document.getElementById('nav-backdrop').hidden = !open;
  document.getElementById('nav-overlay').setAttribute('aria-hidden', String(!open));
  document.getElementById('burger-btn').setAttribute('aria-expanded', String(open));
  if (!open) renderOverlayRoot();
}

function closeNav() {
  if (!document.body.classList.contains('nav-open')) return;
  toggleNav();
}

/* --------- Breadcrumbs (sichtbar + JSON-LD wird statisch in HTML gesetzt) --------- */

function renderBreadcrumbs() {
  const host = document.getElementById('breadcrumbs');
  if (!host) return;
  const raw = document.body.dataset.breadcrumb || '';
  const crumbs = [{ label: 'pfister.ch', url: 'index.html' }];

  if (raw) {
    const parts = raw.split('/').filter(Boolean);
    /* Erstes Segment ist top-level NAV_DATA-Key. */
    let currentNode = NAV_DATA[parts[0]];
    if (currentNode) {
      crumbs.push({ label: currentNode.label, url: currentNode.url });
      for (let i = 1; i < parts.length; i++) {
        const slug = parts[i];
        const hit = findInChildren(slug, currentNode.children || []);
        if (hit) {
          crumbs.push({ label: hit.label, url: hit.url });
          currentNode = hit;
        }
      }
    }
  }

  host.innerHTML = crumbs.map((c, i) => {
    const isLast = i === crumbs.length - 1;
    const sep = i > 0 ? '<span class="crumb-sep" aria-hidden="true">›</span>' : '';
    if (isLast) {
      return `${sep}<span class="crumb current">${c.label}</span>`;
    }
    return `${sep}<a class="crumb" href="${resolveUrl(c.url)}">${c.label}</a>`;
  }).join('');
}

/* --------- Kachel-Grid (Kategorie-Übersicht) --------- */

function renderCategoryGrid(containerId, parentSlug) {
  const host = document.getElementById(containerId);
  if (!host) return;
  const parent = parentSlug ? (NAV_DATA[parentSlug] || findNodeBySlug(parentSlug)) : null;
  const items = parent ? (parent.children || []) : Object.values(NAV_DATA);
  if (!items.length) {
    host.innerHTML = '<p class="muted">Inhalte folgen in Kürze.</p>';
    return;
  }
  host.innerHTML = items.map(n => `
    <a class="tile ${n.highlight ? 'tile-highlight' : ''}" href="${resolveUrl(n.url)}">
      <div class="tile-img">
        <img src="${resolveUrl(n.image || '')}" alt="${n.label}" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'img-placeholder',textContent:this.alt}))"/>
      </div>
      <div class="tile-label">
        <span>${n.label}</span>
        ${n.highlight ? '<span class="tile-badge">Sale</span>' : ''}
      </div>
    </a>
  `).join('');
}

/* --------- Cross-Links ("Das könnte Sie auch interessieren") --------- */

function renderRelated(containerId, currentSlug) {
  const host = document.getElementById(containerId);
  if (!host) return;
  const node = findNodeBySlug(currentSlug) || NAV_DATA[currentSlug];
  if (!node || !node.related || !node.related.length) {
    host.hidden = true; return;
  }
  const items = node.related.map(slug => findNodeBySlug(slug) || NAV_DATA[slug]).filter(Boolean);
  if (!items.length) { host.hidden = true; return; }
  host.innerHTML = `
    <h2>Das könnte Sie auch interessieren</h2>
    <div class="related-grid">
      ${items.map(n => `
        <a class="tile" href="${resolveUrl(n.url)}">
          <div class="tile-img">
            <img src="${resolveUrl(n.image || '')}" alt="${n.label}" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'img-placeholder',textContent:this.alt}))"/>
          </div>
          <div class="tile-label"><span>${n.label}</span></div>
        </a>
      `).join('')}
    </div>
  `;
}

/* --------- Globales Image-Fallback (für inline <img> ohne onerror) --------- */

function initImageFallback() {
  document.querySelectorAll('img').forEach(img => {
    if (img.dataset.fallbackBound) return;
    img.dataset.fallbackBound = '1';
    img.addEventListener('error', () => {
      const ph = document.createElement('div');
      ph.className = 'img-placeholder';
      ph.textContent = img.alt || '';
      if (img.parentNode) img.replaceWith(ph);
    });
    /* Bereits fehlgeschlagen? */
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) {
      img.dispatchEvent(new Event('error'));
    }
  });
}

/* --------- Init --------- */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  renderBreadcrumbs();

  /* Seiten, die via Daten-Attribute dynamische Inhalte wünschen: */
  const gridHosts = document.querySelectorAll('[data-render-grid]');
  gridHosts.forEach(el => renderCategoryGrid(el.id, el.dataset.renderGrid || ''));

  const relatedHosts = document.querySelectorAll('[data-render-related]');
  relatedHosts.forEach(el => renderRelated(el.id, el.dataset.renderRelated));

  initImageFallback();
});
