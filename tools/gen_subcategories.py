#!/usr/bin/env python3
"""Generator: Level 4/5/6-Hierarchie unter /de/produkte/betten-matratzen/.

Erzeugt:
  - ~106 index.html-Dateien (je Level-4, Level-5 und Level-6 Knoten)
  - Ersetzt den children-Block unter `betten-matratzen` in js/main.js
  - Ersetzt sitemap.xml mit aktualisierter Version

Reproduzierbar: mehrfaches Ausfuehren liefert dasselbe Ergebnis (idempotent).

Ausfuehren:
  python3 tools/gen_subcategories.py
"""
import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = 'https://robinv0409.github.io/navigation-pfister/'
BM_ROOT = 'de/produkte/betten-matratzen/'  # Level 3 Root unter Produkte

# Grössen-Sets fuer konzeptionelle Kategorien
DOPPEL_SIZES = ['140x200', '160x200', '180x200', '200x200']
EINZEL_SIZES = ['90x200', '120x200']

# -----------------------------------------------------------------------
# HIERARCHIE — Single Source of Truth fuer alle Level 4-6 Seiten
# -----------------------------------------------------------------------
# Jeder Knoten: (label, filterSpec, children)
# filterSpec-Werte koennen String oder Liste sein (Liste => "in" Match).

def size_filter(typ_label, sizes):
    """Liste von Level-6 Knoten fuer typische 'X YxZ' SEO-Filter.
    Jeder wird als indexedFilter markiert (erscheint nicht im Burger/auf Kacheln,
    sondern nur als Text-Link am Seitenende des Elternknotens).
    """
    return {
        f'{typ_label.lower().replace(" ", "-")}-{s}': {
            'label': f'{typ_label} {s}',
            'filterSpec': {'Typ': typ_label, 'Grösse': s},
            'indexedFilter': True,
            'children': {},
        }
        for s in sizes
    }

def ifl(label, spec):
    """Indexed-filter helper — Filter-Eintrag ohne Kachel, nur als Text-Link."""
    return {'label': label, 'filterSpec': spec, 'indexedFilter': True, 'children': {}}

# Alle ehemaligen 'bett'-Level-5-Filter ziehen um DIREKT unter 'betten/'
EX_BETT_FILTERS = {
    **{f'bett-{s}': ifl(f'Bett {s}', {'Kategorie': 'Bett', 'Grösse': s})
       for s in ['90x200', '120x200', '140x200', '160x200', '180x200', '200x200']},
    'hasena-bett':       ifl('Hasena Bett',       {'Kategorie': 'Bett', 'Marke': 'Hasena'}),
    'bett-mit-kopfteil': ifl('Bett mit Kopfteil', {'Kategorie': 'Bett'}),
    'weisses-bett':      ifl('Weisses Bett',      {'Kategorie': 'Bett', 'Farbe': 'weiss'}),
    'bett-beige':        ifl('Bett beige',        {'Kategorie': 'Bett', 'Farbe': 'beige'}),
    'bett-gelb':         ifl('Bett gelb',         {'Kategorie': 'Bett', 'Farbe': 'gelb'}),
    'bett-pink':         ifl('Bett pink',         {'Kategorie': 'Bett', 'Farbe': 'rosa'}),
    'bett-rot':          ifl('Bett rot',          {'Kategorie': 'Bett', 'Farbe': 'rot'}),
    'bett-grau':         ifl('Bett grau',         {'Kategorie': 'Bett', 'Farbe': 'grau'}),
    'bett-schwarz':      ifl('Bett schwarz',      {'Kategorie': 'Bett', 'Farbe': 'schwarz'}),
    'bett-rosa':         ifl('Bett rosa',         {'Kategorie': 'Bett', 'Farbe': 'rosa'}),
    'bett-braun':        ifl('Bett braun',        {'Kategorie': 'Bett', 'Farbe': 'braun'}),
    'rattanbett':        ifl('Rattanbett',        {'Kategorie': 'Bett', 'Material': 'Rattan'}),
    'lederbett':         ifl('Lederbett',         {'Kategorie': 'Bett', 'Material': 'Leder'}),
}

# Ex-Metallbett-Kategorie wird Filter direkt unter betten/
EX_METALLBETT_FILTERS = {
    'metallbett': ifl('Metallbett', {'Typ': 'Metallbett'}),
    **{f'metallbett-{s}': ifl(f'Metallbett {s}', {'Typ': 'Metallbett', 'Grösse': s})
       for s in ['90x200', '120x200', '140x200', '160x200', '180x200']},
}

HIERARCHY = {
    # --- Level 4 ---
    'betten': {
        'label': 'Betten',
        'filterSpec': {'Kategorie': 'Bett'},
        'children': {
            # --- Level-5 Kategorien (erscheinen als Kacheln + im Burger) ---
            'doppelbetten': {
                'label': 'Doppelbetten',
                'filterSpec': {'Kategorie': 'Bett', 'Grösse': DOPPEL_SIZES},
                'children': {
                    # Ex-Kategorie "Doppelbett mit Stauraum" wird Filter
                    'doppelbett-mit-stauraum': ifl('Doppelbett mit Stauraum',
                        {'Kategorie': 'Bett', 'Typ': 'Polsterbett', 'Grösse': DOPPEL_SIZES}),
                }
            },
            'einzelbetten': {
                'label': 'Einzelbetten',
                'filterSpec': {'Kategorie': 'Bett', 'Grösse': EINZEL_SIZES},
                'children': {
                    'einzelbett-mit-stauraum': ifl('Einzelbett mit Stauraum',
                        {'Kategorie': 'Bett', 'Typ': 'Polsterbett', 'Grösse': EINZEL_SIZES}),
                }
            },
            'gaestebetten-tagesbetten': {
                'label': 'Gästebetten / Tagesbetten',
                'filterSpec': {'Kategorie': 'Bett', 'Typ': ['Klappbett', 'Ausziehbett', 'Futonbett']},
                'children': {
                    # Ex-Kategorie Klappbetten wird Filter (+ ihre 4 Grössen-Filter)
                    'klappbetten': ifl('Klappbetten', {'Typ': 'Klappbett'}),
                    **size_filter('Klappbett', ['90x200', '120x200', '140x200', '160x200']),
                    # Ex-Kategorie Ausziehbetten wird Filter (+ ihre 4 Grössen-Filter)
                    'ausziehbetten': ifl('Ausziehbetten', {'Typ': 'Ausziehbett'}),
                    **size_filter('Ausziehbett', ['90x200', '120x200', '140x200', '160x200']),
                }
            },
            'futonbetten': {
                'label': 'Futonbetten',
                'filterSpec': {'Typ': 'Futonbett'},
                'children': size_filter('Futonbett', ['90x200', '120x200', '140x200', '160x200', '180x200'])
            },
            'boxspringbetten': {
                'label': 'Boxspringbetten',
                'filterSpec': {'Typ': 'Boxspringbett'},
                'children': {
                    **size_filter('Boxspringbett', ['90x200', '120x200', '140x200', '160x200', '180x200', '200x200', '240x200']),
                    'hasena-boxspringbett':         ifl('Hasena Boxspringbett',   {'Typ': 'Boxspringbett', 'Marke': 'Hasena'}),
                    'jensen-boxspringbett':         ifl('Jensen Boxspringbett',   {'Typ': 'Boxspringbett', 'Marke': 'Jensen'}),
                    'riposa-boxspringbett':         ifl('Riposa Boxspringbett',   {'Typ': 'Boxspringbett', 'Marke': 'Riposa'}),
                    'weisses-boxspringbett':        ifl('Weisses Boxspringbett',  {'Typ': 'Boxspringbett', 'Farbe': 'weiss'}),
                    'graues-boxspringbett':         ifl('Graues Boxspringbett',   {'Typ': 'Boxspringbett', 'Farbe': 'grau'}),
                    'boxspringbett-mit-nachttisch': ifl('Boxspringbett mit Nachttisch', {'Typ': 'Boxspringbett'}),
                    'boxspringbett-mit-stauraum':   ifl('Boxspringbett mit Stauraum',   {'Typ': 'Boxspringbett'}),
                    'boxspringbett-elektrisch':     ifl('Boxspringbett elektrisch',     {'Typ': 'Boxspringbett'}),
                    'boxspringbett-superba':        ifl('Boxspringbett Superba',        {'Typ': 'Boxspringbett'}),
                    'boxspringbett-mit-bettkasten': ifl('Boxspringbett mit Bettkasten', {'Typ': 'Boxspringbett'}),
                    'boxspringbett-mit-schublade':  ifl('Boxspringbett mit Schublade',  {'Typ': 'Boxspringbett'}),
                }
            },
            'himmelbetten': {
                'label': 'Himmelbetten',
                'filterSpec': {'Typ': 'Himmelbett'},
                'children': {
                    **size_filter('Himmelbett', ['140x200', '160x200', '180x200']),
                    'himmelbett-aus-holz': ifl('Himmelbett aus Holz',
                        {'Typ': 'Himmelbett', 'Material': ['Eiche massiv', 'Buche']}),
                }
            },
            'polsterbetten': {
                'label': 'Polsterbetten',
                'filterSpec': {'Typ': 'Polsterbett'},
                'children': {
                    **size_filter('Polsterbett', ['90x200', '120x200', '140x200', '160x200', '180x200', '200x200']),
                    'polsterbett-bettkasten':   ifl('Polsterbett Bettkasten',     {'Typ': 'Polsterbett'}),
                    'polsterbett-mit-stauraum': ifl('Polsterbett mit Stauraum',   {'Typ': 'Polsterbett'}),
                    'polsterbett-beige':        ifl('Polsterbett beige',          {'Typ': 'Polsterbett', 'Farbe': 'beige'}),
                    'polsterbett-weiss':        ifl('Polsterbett weiss',          {'Typ': 'Polsterbett', 'Farbe': 'weiss'}),
                    'polsterbett-schwarz':      ifl('Polsterbett schwarz',        {'Typ': 'Polsterbett', 'Farbe': 'schwarz'}),
                    'polsterbett-grau':         ifl('Polsterbett grau',           {'Typ': 'Polsterbett', 'Farbe': 'grau'}),
                    'esposa-polsterbett':       ifl('Esposa Polsterbett',         {'Typ': 'Polsterbett', 'Marke': 'Esposa'}),
                    'hasena-polsterbett':       ifl('Hasena Polsterbett',         {'Typ': 'Polsterbett', 'Marke': 'Hasena'}),
                }
            },
            'bettanlagen': {
                'label': 'Bettanlagen',
                'filterSpec': {'Kategorie': 'Bett'},
                'children': {
                    f'bettanlage-{s}': ifl(f'Bettanlage {s}', {'Kategorie': 'Bett', 'Grösse': s})
                    for s in ['140x200', '160x200', '180x200', '200x200']
                }
            },
            'bett-mit-stauraum': {
                'label': 'Bett mit Stauraum',
                'filterSpec': {'Kategorie': 'Bett', 'Typ': 'Polsterbett'},
                'children': {
                    **{f'bett-mit-stauraum-{s}': ifl(f'Bett mit Stauraum {s}',
                        {'Kategorie': 'Bett', 'Typ': 'Polsterbett', 'Grösse': s})
                       for s in ['90x200', '140x200', '160x200', '180x200']},
                    # Ex-Kategorien "Bett mit Schubladen" + "Bett mit Bettkasten" werden Filter
                    'bett-mit-schubladen': ifl('Bett mit Schubladen',
                        {'Kategorie': 'Bett', 'Typ': 'Polsterbett'}),
                    'bett-mit-bettkasten': ifl('Bett mit Bettkasten',
                        {'Kategorie': 'Bett', 'Typ': 'Polsterbett'}),
                }
            },
            'holzbett': {
                'label': 'Holzbett',
                'filterSpec': {'Typ': ['Holzbett', 'Massivholzbett']},
                'children': {}
            },

            # --- Level-5 indexierte Filter direkt unter betten/
            # (Ex-Kategorie "bett" aufgeloest, Ex-Kategorie "metallbett" aufgeloest) ---
            **EX_BETT_FILTERS,
            **EX_METALLBETT_FILTERS,
        }
    },
    'matratzen': {'label': 'Matratzen', 'filterSpec': {'Kategorie': 'Matratze'}, 'children': {}},
    'schlafzimmer-textilien': {'label': 'Schlafzimmer Textilien', 'filterSpec': {'Kategorie': 'Textil'}, 'children': {}},
    'lattenroste': {'label': 'Lattenroste', 'filterSpec': {'Kategorie': 'Lattenrost'}, 'children': {}},
    'nachttische': {'label': 'Nachttische', 'filterSpec': {'Kategorie': 'Nachttisch'}, 'children': {}},
    'bettkaesten': {'label': 'Bettkästen', 'filterSpec': {'Kategorie': 'Bettkasten'}, 'children': {}},
}


# -----------------------------------------------------------------------
# Slug-Uniqueness-Check
# -----------------------------------------------------------------------

def walk(tree, path=()):
    """Iteriert (slug_chain, label, filterSpec, has_children)."""
    for slug, node in tree.items():
        chain = path + (slug,)
        yield chain, node
        for sub in walk(node.get('children', {}), chain):
            yield sub

def assert_unique_slugs():
    slugs = []
    for chain, _ in walk(HIERARCHY):
        slugs.append(chain[-1])
    dup = {s for s in slugs if slugs.count(s) > 1}
    assert not dup, f'Duplicate slugs: {dup}'


# -----------------------------------------------------------------------
# HTML-Template
# -----------------------------------------------------------------------

def slug_to_label(slug):
    return slug.replace('-', ' ').replace('x', '×').title()

def ld_item(pos, name, abs_path):
    return ('{ "@type": "ListItem", "position": ' + str(pos)
            + ', "name": ' + json.dumps(name, ensure_ascii=False)
            + ', "item": ' + json.dumps(SITE + abs_path, ensure_ascii=False) + ' }')

def abs_path_for(chain):
    return BM_ROOT + '/'.join(chain) + '/'

def rel_css_js_prefix(depth_from_root):
    """Anzahl '../' um zum Repo-Root zu kommen. depth_from_root = Tiefe der URL-Segmente."""
    return '../' * depth_from_root

def generate_html(chain, node):
    label = node['label']
    url_path = abs_path_for(chain)           # z.B. de/produkte/betten-matratzen/betten/boxspringbetten/
    filter_spec = node.get('filterSpec', {})
    has_children = bool(node.get('children'))
    current_slug = chain[-1]

    # Tiefe in Verzeichnis-Segmenten
    depth = url_path.count('/')              # z.B. "de/produkte/betten-matratzen/betten/boxspringbetten/" -> 5
    up = '../' * depth
    upload_path = up + BM_ROOT               # Link zurueck zur Haupt-Upload-Seite

    # Breadcrumbs JSON-LD
    ld_items = [ld_item(1, 'Pfister', ''),
                ld_item(2, 'Produkte', 'de/produkte/'),
                ld_item(3, 'Betten & Matratzen', BM_ROOT)]
    # Eltern-Kette ohne die aktuelle Seite
    cumulative = ''
    for i, slug in enumerate(chain):
        cumulative += slug + '/'
        # finde label fuer diesen slug im Tree
        cur = HIERARCHY
        for s in chain[:i+1]:
            node_at = cur[s]
            cur = node_at.get('children', {})
        ld_items.append(ld_item(4 + i, node_at['label'], BM_ROOT + cumulative))

    ld_block = ',\n      '.join(ld_items)

    # Breadcrumb-Trail fuer body data-breadcrumb
    breadcrumb_trail = 'produkte/betten-matratzen/' + '/'.join(chain)

    title = f'{label} kaufen | Pfister'
    desc  = f'{label} bei Pfister entdecken – grosse Auswahl für erholsamen Schlaf. Filtern Sie nach Grösse, Marke und weiteren Merkmalen.'
    desc  = desc[:155]

    spec_json = json.dumps(filter_spec, ensure_ascii=False)

    hreflang_de = 'de/produkte/betten-matratzen/' + '/'.join(chain) + '/'

    # Kacheln fuer Unterkategorien:
    # Nur auf Level-4-Seiten (direkt unter betten-matratzen). JS rendert die
    # Kacheln aus NAV_DATA und ueberspringt Knoten mit indexedFilter: true.
    # Level-5-Seiten zeigen KEINE Kacheln — dort erscheinen die indexierten
    # Filter-URLs stattdessen als Text-Links am Seitenende (s.u.).
    tiles_section = ''
    if has_children and len(chain) == 1:
        tiles_section = f'''
    <section>
      <h2>Kategorien</h2>
      <div class="tile-grid" data-render-grid="{current_slug}"></div>
    </section>
'''

    # Indexed-Links am Seitenende (statisch, SEO-freundlich):
    # Alle Kinder mit indexedFilter: true werden als unterstrichene Text-Links
    # gelistet — sie erscheinen NICHT im Burger/als Kachel, sondern nur hier.
    indexed_links_section = ''
    indexed_children = [
        (slug, child) for slug, child in node.get('children', {}).items()
        if child.get('indexedFilter')
    ]
    if indexed_children:
        links_html = '\n'.join(
            f'        <a class="indexed-link" href="{s}/">{esc(c["label"])}</a>'
            for s, c in indexed_children
        )
        indexed_links_section = f'''
    <nav class="indexed-links" aria-label="Verwandte Suchen">
      <h2>Verwandte Suchen</h2>
      <div class="indexed-links-wrap">
{links_html}
      </div>
    </nav>
'''

    html = f"""<!DOCTYPE html>
<html lang="de-CH">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <meta name="description" content="{desc}" />
  <link rel="canonical" href="{SITE}{url_path}" />
  <meta name="robots" content="index, follow" />

  <meta property="og:title" content="{title}" />
  <meta property="og:description" content="{desc}" />
  <meta property="og:url" content="{SITE}{url_path}" />
  <meta property="og:type" content="website" />

  <!--
  <link rel="alternate" hreflang="de-ch" href="https://www.pfister.ch/{hreflang_de}" />
  -->

  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {ld_block}
    ]
  }}
  </script>

  <link rel="stylesheet" href="{up}css/style.css" />
</head>
<body data-breadcrumb="{breadcrumb_trail}" data-filter-spec='{spec_json}'>
  <div id="site-header"></div>
  <nav id="breadcrumbs" class="breadcrumbs"></nav>

  <main>
    <section style="padding:20px 16px 8px;">
      <h1>{esc(label)}</h1>
      <p class="intro">{esc(label)} bei Pfister – vorgefilterte Auswahl basierend auf den hochgeladenen Produktdaten.</p>
    </section>
{tiles_section}
    <section>
      <h2>Produkte</h2>
      <div id="subcat-app" data-upload-path="{upload_path}"></div>
    </section>
{indexed_links_section}  </main>

  <footer class="site-footer">© Pfister – Prototyp · Alle Preise in CHF</footer>
  <script src="{up}js/main.js"></script>
  <script src="{up}js/subcategory.js"></script>
</body>
</html>
"""
    return html, url_path

def esc(s):
    return (s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;'))


# -----------------------------------------------------------------------
# NAV_DATA-Fragment bauen
# -----------------------------------------------------------------------

def build_nav_children_js(tree, indent=10):
    """Baut JS-Array fuer NAV_DATA children aus der HIERARCHY."""
    ind = ' ' * indent
    lines = []
    for slug, node in tree.items():
        label = node['label']
        url = BM_ROOT + build_slug_path(slug, tree)
        # Wir muessen den Pfad ausgehend von chain berechnen — hier ist nur
        # Top-Level aufrufbar; darum bauen wir rekursiv mit chain.
        pass
    return ''

def build_nav_array(tree, chain=()):
    items = []
    for slug, node in tree.items():
        sub_chain = chain + (slug,)
        url = BM_ROOT + '/'.join(sub_chain) + '/'
        child_js = build_nav_array(node.get('children', {}), sub_chain)
        filter_spec = node.get('filterSpec')
        parts = [
            f'label: {json.dumps(node["label"], ensure_ascii=False)}',
            f'url: {json.dumps(url)}',
            f'slug: {json.dumps(slug)}',
        ]
        if filter_spec:
            parts.append('filterSpec: ' + json.dumps(filter_spec, ensure_ascii=False))
        if node.get('indexedFilter'):
            parts.append('indexedFilter: true')
        parts.append('children: ' + child_js)
        items.append('{ ' + ', '.join(parts) + ' }')
    return '[\n          ' + ',\n          '.join(items) + '\n        ]' if items else '[]'


def clean_old_tree():
    """Entferne das komplette betten-matratzen-Unterverzeichnis
    (ausser index.html der Hauptseite selbst), bevor neu geschrieben wird.
    Vermeidet Waisen-HTMLs von entfernten Kategorien wie /bett/, /metallbett/, ..."""
    import shutil
    base = ROOT / BM_ROOT
    if not base.exists():
        return
    for child in base.iterdir():
        if child.is_dir():
            shutil.rmtree(child)
    print(f'cleaned old subcategory tree under {BM_ROOT}')


# -----------------------------------------------------------------------
# main.js patchen
# -----------------------------------------------------------------------

def patch_main_js(children_js):
    path = ROOT / 'js' / 'main.js'
    text = path.read_text(encoding='utf-8')
    pattern = re.compile(
        r'(/\* BETTEN_MATRATZEN_CHILDREN:START \*/).*?(/\* BETTEN_MATRATZEN_CHILDREN:END \*/)',
        re.DOTALL
    )
    if not pattern.search(text):
        raise RuntimeError('Marker BETTEN_MATRATZEN_CHILDREN:START/END nicht gefunden in js/main.js')
    replacement = '\\1\n        children: ' + children_js + '\n        \\2'
    new_text = pattern.sub(replacement, text)
    path.write_text(new_text, encoding='utf-8')
    print('patched js/main.js with NAV_DATA children block')


# -----------------------------------------------------------------------
# Sitemap aktualisieren
# -----------------------------------------------------------------------

SITEMAP_BASE = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>{S}</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>{S}de/produkte/</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>{S}de/produkte/betten-matratzen/</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>{S}de/produkte/sofas-sessel/</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>{S}de/produkte/tische-stuehle/</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>{S}de/produkte/garten-balkon/</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>{S}de/produkte/vorhaenge/</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>{S}de/produkte/beleuchtung/</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>{S}de/produkte/dekoration/</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>{S}de/produkte/baby-kinder/</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>{S}de/produkte/textilien/</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>{S}de/raeume/</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>{S}de/raeume/schlafzimmer/</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>{S}de/raeume/wohnzimmer/</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>{S}de/raeume/esszimmer/</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>{S}de/raeume/garten/</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>{S}de/raeume/kueche/</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>{S}de/raeume/buero/</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>{S}de/raeume/kinderzimmer/</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>{S}de/raeume/babyzimmer/</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>{S}de/raeume/jugendzimmer/</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>{S}de/raeume/badezimmer/</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>{S}de/raeume/entree-diele/</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>{S}de/marken/</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>{S}de/angebote/</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>{S}de/designmoebel/</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
""".replace('{S}', SITE)

def write_sitemap(new_chains):
    lines = [SITEMAP_BASE]
    for chain in new_chains:
        depth = len(chain)
        prio = {1: 0.5, 2: 0.4}.get(depth, 0.3)
        cf = 'monthly' if depth <= 2 else 'monthly'
        loc = SITE + abs_path_for(chain)
        lines.append(f'  <url><loc>{loc}</loc><changefreq>{cf}</changefreq><priority>{prio}</priority></url>')
    lines.append('</urlset>\n')
    (ROOT / 'sitemap.xml').write_text('\n'.join(lines), encoding='utf-8')
    print(f'wrote sitemap.xml with {len(new_chains)} new URLs')


# -----------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------

def main():
    assert_unique_slugs()
    clean_old_tree()
    count = 0
    new_chains = []
    for chain, node in walk(HIERARCHY):
        html, url_path = generate_html(chain, node)
        out = ROOT / url_path / 'index.html'
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(html, encoding='utf-8')
        new_chains.append(chain)
        count += 1
    print(f'wrote {count} HTML files')

    # NAV_DATA children
    children_js = build_nav_array(HIERARCHY)
    patch_main_js(children_js)

    # Sitemap
    write_sitemap(new_chains)

    print('DONE.')

if __name__ == '__main__':
    main()
