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
        /* BETTEN_MATRATZEN_CHILDREN:START */
        children: [
          { label: "Betten", url: "de/produkte/betten-matratzen/betten/", slug: "betten", filterSpec: {"Kategorie": "Bett"}, children: [
          { label: "Doppelbetten", url: "de/produkte/betten-matratzen/betten/doppelbetten/", slug: "doppelbetten", filterSpec: {"Kategorie": "Bett", "Grösse": ["140x200", "160x200", "180x200", "200x200"]}, children: [
          { label: "Doppelbett mit Stauraum", url: "de/produkte/betten-matratzen/betten/doppelbetten/doppelbett-mit-stauraum/", slug: "doppelbett-mit-stauraum", filterSpec: {"Kategorie": "Bett", "Typ": "Polsterbett", "Grösse": ["140x200", "160x200", "180x200", "200x200"]}, indexedFilter: true, children: [] }
        ] },
          { label: "Einzelbetten", url: "de/produkte/betten-matratzen/betten/einzelbetten/", slug: "einzelbetten", filterSpec: {"Kategorie": "Bett", "Grösse": ["90x200", "120x200"]}, children: [
          { label: "Einzelbett mit Stauraum", url: "de/produkte/betten-matratzen/betten/einzelbetten/einzelbett-mit-stauraum/", slug: "einzelbett-mit-stauraum", filterSpec: {"Kategorie": "Bett", "Typ": "Polsterbett", "Grösse": ["90x200", "120x200"]}, indexedFilter: true, children: [] }
        ] },
          { label: "Gästebetten / Tagesbetten", url: "de/produkte/betten-matratzen/betten/gaestebetten-tagesbetten/", slug: "gaestebetten-tagesbetten", filterSpec: {"Kategorie": "Bett", "Typ": ["Klappbett", "Ausziehbett", "Futonbett"]}, children: [
          { label: "Klappbetten", url: "de/produkte/betten-matratzen/betten/gaestebetten-tagesbetten/klappbetten/", slug: "klappbetten", filterSpec: {"Typ": "Klappbett"}, indexedFilter: true, children: [] },
          { label: "Klappbett 90x200", url: "de/produkte/betten-matratzen/betten/gaestebetten-tagesbetten/klappbett-90x200/", slug: "klappbett-90x200", filterSpec: {"Typ": "Klappbett", "Grösse": "90x200"}, indexedFilter: true, children: [] },
          { label: "Klappbett 120x200", url: "de/produkte/betten-matratzen/betten/gaestebetten-tagesbetten/klappbett-120x200/", slug: "klappbett-120x200", filterSpec: {"Typ": "Klappbett", "Grösse": "120x200"}, indexedFilter: true, children: [] },
          { label: "Klappbett 140x200", url: "de/produkte/betten-matratzen/betten/gaestebetten-tagesbetten/klappbett-140x200/", slug: "klappbett-140x200", filterSpec: {"Typ": "Klappbett", "Grösse": "140x200"}, indexedFilter: true, children: [] },
          { label: "Klappbett 160x200", url: "de/produkte/betten-matratzen/betten/gaestebetten-tagesbetten/klappbett-160x200/", slug: "klappbett-160x200", filterSpec: {"Typ": "Klappbett", "Grösse": "160x200"}, indexedFilter: true, children: [] },
          { label: "Ausziehbetten", url: "de/produkte/betten-matratzen/betten/gaestebetten-tagesbetten/ausziehbetten/", slug: "ausziehbetten", filterSpec: {"Typ": "Ausziehbett"}, indexedFilter: true, children: [] },
          { label: "Ausziehbett 90x200", url: "de/produkte/betten-matratzen/betten/gaestebetten-tagesbetten/ausziehbett-90x200/", slug: "ausziehbett-90x200", filterSpec: {"Typ": "Ausziehbett", "Grösse": "90x200"}, indexedFilter: true, children: [] },
          { label: "Ausziehbett 120x200", url: "de/produkte/betten-matratzen/betten/gaestebetten-tagesbetten/ausziehbett-120x200/", slug: "ausziehbett-120x200", filterSpec: {"Typ": "Ausziehbett", "Grösse": "120x200"}, indexedFilter: true, children: [] },
          { label: "Ausziehbett 140x200", url: "de/produkte/betten-matratzen/betten/gaestebetten-tagesbetten/ausziehbett-140x200/", slug: "ausziehbett-140x200", filterSpec: {"Typ": "Ausziehbett", "Grösse": "140x200"}, indexedFilter: true, children: [] },
          { label: "Ausziehbett 160x200", url: "de/produkte/betten-matratzen/betten/gaestebetten-tagesbetten/ausziehbett-160x200/", slug: "ausziehbett-160x200", filterSpec: {"Typ": "Ausziehbett", "Grösse": "160x200"}, indexedFilter: true, children: [] }
        ] },
          { label: "Futonbetten", url: "de/produkte/betten-matratzen/betten/futonbetten/", slug: "futonbetten", filterSpec: {"Typ": "Futonbett"}, children: [
          { label: "Futonbett 90x200", url: "de/produkte/betten-matratzen/betten/futonbetten/futonbett-90x200/", slug: "futonbett-90x200", filterSpec: {"Typ": "Futonbett", "Grösse": "90x200"}, indexedFilter: true, children: [] },
          { label: "Futonbett 120x200", url: "de/produkte/betten-matratzen/betten/futonbetten/futonbett-120x200/", slug: "futonbett-120x200", filterSpec: {"Typ": "Futonbett", "Grösse": "120x200"}, indexedFilter: true, children: [] },
          { label: "Futonbett 140x200", url: "de/produkte/betten-matratzen/betten/futonbetten/futonbett-140x200/", slug: "futonbett-140x200", filterSpec: {"Typ": "Futonbett", "Grösse": "140x200"}, indexedFilter: true, children: [] },
          { label: "Futonbett 160x200", url: "de/produkte/betten-matratzen/betten/futonbetten/futonbett-160x200/", slug: "futonbett-160x200", filterSpec: {"Typ": "Futonbett", "Grösse": "160x200"}, indexedFilter: true, children: [] },
          { label: "Futonbett 180x200", url: "de/produkte/betten-matratzen/betten/futonbetten/futonbett-180x200/", slug: "futonbett-180x200", filterSpec: {"Typ": "Futonbett", "Grösse": "180x200"}, indexedFilter: true, children: [] }
        ] },
          { label: "Boxspringbetten", url: "de/produkte/betten-matratzen/betten/boxspringbetten/", slug: "boxspringbetten", filterSpec: {"Typ": "Boxspringbett"}, children: [
          { label: "Boxspringbett 90x200", url: "de/produkte/betten-matratzen/betten/boxspringbetten/boxspringbett-90x200/", slug: "boxspringbett-90x200", filterSpec: {"Typ": "Boxspringbett", "Grösse": "90x200"}, indexedFilter: true, children: [] },
          { label: "Boxspringbett 120x200", url: "de/produkte/betten-matratzen/betten/boxspringbetten/boxspringbett-120x200/", slug: "boxspringbett-120x200", filterSpec: {"Typ": "Boxspringbett", "Grösse": "120x200"}, indexedFilter: true, children: [] },
          { label: "Boxspringbett 140x200", url: "de/produkte/betten-matratzen/betten/boxspringbetten/boxspringbett-140x200/", slug: "boxspringbett-140x200", filterSpec: {"Typ": "Boxspringbett", "Grösse": "140x200"}, indexedFilter: true, children: [] },
          { label: "Boxspringbett 160x200", url: "de/produkte/betten-matratzen/betten/boxspringbetten/boxspringbett-160x200/", slug: "boxspringbett-160x200", filterSpec: {"Typ": "Boxspringbett", "Grösse": "160x200"}, indexedFilter: true, children: [] },
          { label: "Boxspringbett 180x200", url: "de/produkte/betten-matratzen/betten/boxspringbetten/boxspringbett-180x200/", slug: "boxspringbett-180x200", filterSpec: {"Typ": "Boxspringbett", "Grösse": "180x200"}, indexedFilter: true, children: [] },
          { label: "Boxspringbett 200x200", url: "de/produkte/betten-matratzen/betten/boxspringbetten/boxspringbett-200x200/", slug: "boxspringbett-200x200", filterSpec: {"Typ": "Boxspringbett", "Grösse": "200x200"}, indexedFilter: true, children: [] },
          { label: "Boxspringbett 240x200", url: "de/produkte/betten-matratzen/betten/boxspringbetten/boxspringbett-240x200/", slug: "boxspringbett-240x200", filterSpec: {"Typ": "Boxspringbett", "Grösse": "240x200"}, indexedFilter: true, children: [] },
          { label: "Hasena Boxspringbett", url: "de/produkte/betten-matratzen/betten/boxspringbetten/hasena-boxspringbett/", slug: "hasena-boxspringbett", filterSpec: {"Typ": "Boxspringbett", "Marke": "Hasena"}, indexedFilter: true, children: [] },
          { label: "Jensen Boxspringbett", url: "de/produkte/betten-matratzen/betten/boxspringbetten/jensen-boxspringbett/", slug: "jensen-boxspringbett", filterSpec: {"Typ": "Boxspringbett", "Marke": "Jensen"}, indexedFilter: true, children: [] },
          { label: "Riposa Boxspringbett", url: "de/produkte/betten-matratzen/betten/boxspringbetten/riposa-boxspringbett/", slug: "riposa-boxspringbett", filterSpec: {"Typ": "Boxspringbett", "Marke": "Riposa"}, indexedFilter: true, children: [] },
          { label: "Weisses Boxspringbett", url: "de/produkte/betten-matratzen/betten/boxspringbetten/weisses-boxspringbett/", slug: "weisses-boxspringbett", filterSpec: {"Typ": "Boxspringbett", "Farbe": "weiss"}, indexedFilter: true, children: [] },
          { label: "Graues Boxspringbett", url: "de/produkte/betten-matratzen/betten/boxspringbetten/graues-boxspringbett/", slug: "graues-boxspringbett", filterSpec: {"Typ": "Boxspringbett", "Farbe": "grau"}, indexedFilter: true, children: [] },
          { label: "Boxspringbett mit Nachttisch", url: "de/produkte/betten-matratzen/betten/boxspringbetten/boxspringbett-mit-nachttisch/", slug: "boxspringbett-mit-nachttisch", filterSpec: {"Typ": "Boxspringbett"}, indexedFilter: true, children: [] },
          { label: "Boxspringbett mit Stauraum", url: "de/produkte/betten-matratzen/betten/boxspringbetten/boxspringbett-mit-stauraum/", slug: "boxspringbett-mit-stauraum", filterSpec: {"Typ": "Boxspringbett"}, indexedFilter: true, children: [] },
          { label: "Boxspringbett elektrisch", url: "de/produkte/betten-matratzen/betten/boxspringbetten/boxspringbett-elektrisch/", slug: "boxspringbett-elektrisch", filterSpec: {"Typ": "Boxspringbett"}, indexedFilter: true, children: [] },
          { label: "Boxspringbett Superba", url: "de/produkte/betten-matratzen/betten/boxspringbetten/boxspringbett-superba/", slug: "boxspringbett-superba", filterSpec: {"Typ": "Boxspringbett"}, indexedFilter: true, children: [] },
          { label: "Boxspringbett mit Bettkasten", url: "de/produkte/betten-matratzen/betten/boxspringbetten/boxspringbett-mit-bettkasten/", slug: "boxspringbett-mit-bettkasten", filterSpec: {"Typ": "Boxspringbett"}, indexedFilter: true, children: [] },
          { label: "Boxspringbett mit Schublade", url: "de/produkte/betten-matratzen/betten/boxspringbetten/boxspringbett-mit-schublade/", slug: "boxspringbett-mit-schublade", filterSpec: {"Typ": "Boxspringbett"}, indexedFilter: true, children: [] }
        ] },
          { label: "Himmelbetten", url: "de/produkte/betten-matratzen/betten/himmelbetten/", slug: "himmelbetten", filterSpec: {"Typ": "Himmelbett"}, children: [
          { label: "Himmelbett 140x200", url: "de/produkte/betten-matratzen/betten/himmelbetten/himmelbett-140x200/", slug: "himmelbett-140x200", filterSpec: {"Typ": "Himmelbett", "Grösse": "140x200"}, indexedFilter: true, children: [] },
          { label: "Himmelbett 160x200", url: "de/produkte/betten-matratzen/betten/himmelbetten/himmelbett-160x200/", slug: "himmelbett-160x200", filterSpec: {"Typ": "Himmelbett", "Grösse": "160x200"}, indexedFilter: true, children: [] },
          { label: "Himmelbett 180x200", url: "de/produkte/betten-matratzen/betten/himmelbetten/himmelbett-180x200/", slug: "himmelbett-180x200", filterSpec: {"Typ": "Himmelbett", "Grösse": "180x200"}, indexedFilter: true, children: [] },
          { label: "Himmelbett aus Holz", url: "de/produkte/betten-matratzen/betten/himmelbetten/himmelbett-aus-holz/", slug: "himmelbett-aus-holz", filterSpec: {"Typ": "Himmelbett", "Material": ["Eiche massiv", "Buche"]}, indexedFilter: true, children: [] }
        ] },
          { label: "Polsterbetten", url: "de/produkte/betten-matratzen/betten/polsterbetten/", slug: "polsterbetten", filterSpec: {"Typ": "Polsterbett"}, children: [
          { label: "Polsterbett 90x200", url: "de/produkte/betten-matratzen/betten/polsterbetten/polsterbett-90x200/", slug: "polsterbett-90x200", filterSpec: {"Typ": "Polsterbett", "Grösse": "90x200"}, indexedFilter: true, children: [] },
          { label: "Polsterbett 120x200", url: "de/produkte/betten-matratzen/betten/polsterbetten/polsterbett-120x200/", slug: "polsterbett-120x200", filterSpec: {"Typ": "Polsterbett", "Grösse": "120x200"}, indexedFilter: true, children: [] },
          { label: "Polsterbett 140x200", url: "de/produkte/betten-matratzen/betten/polsterbetten/polsterbett-140x200/", slug: "polsterbett-140x200", filterSpec: {"Typ": "Polsterbett", "Grösse": "140x200"}, indexedFilter: true, children: [] },
          { label: "Polsterbett 160x200", url: "de/produkte/betten-matratzen/betten/polsterbetten/polsterbett-160x200/", slug: "polsterbett-160x200", filterSpec: {"Typ": "Polsterbett", "Grösse": "160x200"}, indexedFilter: true, children: [] },
          { label: "Polsterbett 180x200", url: "de/produkte/betten-matratzen/betten/polsterbetten/polsterbett-180x200/", slug: "polsterbett-180x200", filterSpec: {"Typ": "Polsterbett", "Grösse": "180x200"}, indexedFilter: true, children: [] },
          { label: "Polsterbett 200x200", url: "de/produkte/betten-matratzen/betten/polsterbetten/polsterbett-200x200/", slug: "polsterbett-200x200", filterSpec: {"Typ": "Polsterbett", "Grösse": "200x200"}, indexedFilter: true, children: [] },
          { label: "Polsterbett Bettkasten", url: "de/produkte/betten-matratzen/betten/polsterbetten/polsterbett-bettkasten/", slug: "polsterbett-bettkasten", filterSpec: {"Typ": "Polsterbett"}, indexedFilter: true, children: [] },
          { label: "Polsterbett mit Stauraum", url: "de/produkte/betten-matratzen/betten/polsterbetten/polsterbett-mit-stauraum/", slug: "polsterbett-mit-stauraum", filterSpec: {"Typ": "Polsterbett"}, indexedFilter: true, children: [] },
          { label: "Polsterbett beige", url: "de/produkte/betten-matratzen/betten/polsterbetten/polsterbett-beige/", slug: "polsterbett-beige", filterSpec: {"Typ": "Polsterbett", "Farbe": "beige"}, indexedFilter: true, children: [] },
          { label: "Polsterbett weiss", url: "de/produkte/betten-matratzen/betten/polsterbetten/polsterbett-weiss/", slug: "polsterbett-weiss", filterSpec: {"Typ": "Polsterbett", "Farbe": "weiss"}, indexedFilter: true, children: [] },
          { label: "Polsterbett schwarz", url: "de/produkte/betten-matratzen/betten/polsterbetten/polsterbett-schwarz/", slug: "polsterbett-schwarz", filterSpec: {"Typ": "Polsterbett", "Farbe": "schwarz"}, indexedFilter: true, children: [] },
          { label: "Polsterbett grau", url: "de/produkte/betten-matratzen/betten/polsterbetten/polsterbett-grau/", slug: "polsterbett-grau", filterSpec: {"Typ": "Polsterbett", "Farbe": "grau"}, indexedFilter: true, children: [] },
          { label: "Esposa Polsterbett", url: "de/produkte/betten-matratzen/betten/polsterbetten/esposa-polsterbett/", slug: "esposa-polsterbett", filterSpec: {"Typ": "Polsterbett", "Marke": "Esposa"}, indexedFilter: true, children: [] },
          { label: "Hasena Polsterbett", url: "de/produkte/betten-matratzen/betten/polsterbetten/hasena-polsterbett/", slug: "hasena-polsterbett", filterSpec: {"Typ": "Polsterbett", "Marke": "Hasena"}, indexedFilter: true, children: [] }
        ] },
          { label: "Bettanlagen", url: "de/produkte/betten-matratzen/betten/bettanlagen/", slug: "bettanlagen", filterSpec: {"Kategorie": "Bett"}, children: [
          { label: "Bettanlage 140x200", url: "de/produkte/betten-matratzen/betten/bettanlagen/bettanlage-140x200/", slug: "bettanlage-140x200", filterSpec: {"Kategorie": "Bett", "Grösse": "140x200"}, indexedFilter: true, children: [] },
          { label: "Bettanlage 160x200", url: "de/produkte/betten-matratzen/betten/bettanlagen/bettanlage-160x200/", slug: "bettanlage-160x200", filterSpec: {"Kategorie": "Bett", "Grösse": "160x200"}, indexedFilter: true, children: [] },
          { label: "Bettanlage 180x200", url: "de/produkte/betten-matratzen/betten/bettanlagen/bettanlage-180x200/", slug: "bettanlage-180x200", filterSpec: {"Kategorie": "Bett", "Grösse": "180x200"}, indexedFilter: true, children: [] },
          { label: "Bettanlage 200x200", url: "de/produkte/betten-matratzen/betten/bettanlagen/bettanlage-200x200/", slug: "bettanlage-200x200", filterSpec: {"Kategorie": "Bett", "Grösse": "200x200"}, indexedFilter: true, children: [] }
        ] },
          { label: "Bett mit Stauraum", url: "de/produkte/betten-matratzen/betten/bett-mit-stauraum/", slug: "bett-mit-stauraum", filterSpec: {"Kategorie": "Bett", "Typ": "Polsterbett"}, children: [
          { label: "Bett mit Stauraum 90x200", url: "de/produkte/betten-matratzen/betten/bett-mit-stauraum/bett-mit-stauraum-90x200/", slug: "bett-mit-stauraum-90x200", filterSpec: {"Kategorie": "Bett", "Typ": "Polsterbett", "Grösse": "90x200"}, indexedFilter: true, children: [] },
          { label: "Bett mit Stauraum 140x200", url: "de/produkte/betten-matratzen/betten/bett-mit-stauraum/bett-mit-stauraum-140x200/", slug: "bett-mit-stauraum-140x200", filterSpec: {"Kategorie": "Bett", "Typ": "Polsterbett", "Grösse": "140x200"}, indexedFilter: true, children: [] },
          { label: "Bett mit Stauraum 160x200", url: "de/produkte/betten-matratzen/betten/bett-mit-stauraum/bett-mit-stauraum-160x200/", slug: "bett-mit-stauraum-160x200", filterSpec: {"Kategorie": "Bett", "Typ": "Polsterbett", "Grösse": "160x200"}, indexedFilter: true, children: [] },
          { label: "Bett mit Stauraum 180x200", url: "de/produkte/betten-matratzen/betten/bett-mit-stauraum/bett-mit-stauraum-180x200/", slug: "bett-mit-stauraum-180x200", filterSpec: {"Kategorie": "Bett", "Typ": "Polsterbett", "Grösse": "180x200"}, indexedFilter: true, children: [] },
          { label: "Bett mit Schubladen", url: "de/produkte/betten-matratzen/betten/bett-mit-stauraum/bett-mit-schubladen/", slug: "bett-mit-schubladen", filterSpec: {"Kategorie": "Bett", "Typ": "Polsterbett"}, indexedFilter: true, children: [] },
          { label: "Bett mit Bettkasten", url: "de/produkte/betten-matratzen/betten/bett-mit-stauraum/bett-mit-bettkasten/", slug: "bett-mit-bettkasten", filterSpec: {"Kategorie": "Bett", "Typ": "Polsterbett"}, indexedFilter: true, children: [] }
        ] },
          { label: "Holzbett", url: "de/produkte/betten-matratzen/betten/holzbett/", slug: "holzbett", filterSpec: {"Typ": ["Holzbett", "Massivholzbett"]}, children: [] },
          { label: "Bett 90x200", url: "de/produkte/betten-matratzen/betten/bett-90x200/", slug: "bett-90x200", filterSpec: {"Kategorie": "Bett", "Grösse": "90x200"}, indexedFilter: true, children: [] },
          { label: "Bett 120x200", url: "de/produkte/betten-matratzen/betten/bett-120x200/", slug: "bett-120x200", filterSpec: {"Kategorie": "Bett", "Grösse": "120x200"}, indexedFilter: true, children: [] },
          { label: "Bett 140x200", url: "de/produkte/betten-matratzen/betten/bett-140x200/", slug: "bett-140x200", filterSpec: {"Kategorie": "Bett", "Grösse": "140x200"}, indexedFilter: true, children: [] },
          { label: "Bett 160x200", url: "de/produkte/betten-matratzen/betten/bett-160x200/", slug: "bett-160x200", filterSpec: {"Kategorie": "Bett", "Grösse": "160x200"}, indexedFilter: true, children: [] },
          { label: "Bett 180x200", url: "de/produkte/betten-matratzen/betten/bett-180x200/", slug: "bett-180x200", filterSpec: {"Kategorie": "Bett", "Grösse": "180x200"}, indexedFilter: true, children: [] },
          { label: "Bett 200x200", url: "de/produkte/betten-matratzen/betten/bett-200x200/", slug: "bett-200x200", filterSpec: {"Kategorie": "Bett", "Grösse": "200x200"}, indexedFilter: true, children: [] },
          { label: "Hasena Bett", url: "de/produkte/betten-matratzen/betten/hasena-bett/", slug: "hasena-bett", filterSpec: {"Kategorie": "Bett", "Marke": "Hasena"}, indexedFilter: true, children: [] },
          { label: "Bett mit Kopfteil", url: "de/produkte/betten-matratzen/betten/bett-mit-kopfteil/", slug: "bett-mit-kopfteil", filterSpec: {"Kategorie": "Bett"}, indexedFilter: true, children: [] },
          { label: "Weisses Bett", url: "de/produkte/betten-matratzen/betten/weisses-bett/", slug: "weisses-bett", filterSpec: {"Kategorie": "Bett", "Farbe": "weiss"}, indexedFilter: true, children: [] },
          { label: "Bett beige", url: "de/produkte/betten-matratzen/betten/bett-beige/", slug: "bett-beige", filterSpec: {"Kategorie": "Bett", "Farbe": "beige"}, indexedFilter: true, children: [] },
          { label: "Bett gelb", url: "de/produkte/betten-matratzen/betten/bett-gelb/", slug: "bett-gelb", filterSpec: {"Kategorie": "Bett", "Farbe": "gelb"}, indexedFilter: true, children: [] },
          { label: "Bett pink", url: "de/produkte/betten-matratzen/betten/bett-pink/", slug: "bett-pink", filterSpec: {"Kategorie": "Bett", "Farbe": "rosa"}, indexedFilter: true, children: [] },
          { label: "Bett rot", url: "de/produkte/betten-matratzen/betten/bett-rot/", slug: "bett-rot", filterSpec: {"Kategorie": "Bett", "Farbe": "rot"}, indexedFilter: true, children: [] },
          { label: "Bett grau", url: "de/produkte/betten-matratzen/betten/bett-grau/", slug: "bett-grau", filterSpec: {"Kategorie": "Bett", "Farbe": "grau"}, indexedFilter: true, children: [] },
          { label: "Bett schwarz", url: "de/produkte/betten-matratzen/betten/bett-schwarz/", slug: "bett-schwarz", filterSpec: {"Kategorie": "Bett", "Farbe": "schwarz"}, indexedFilter: true, children: [] },
          { label: "Bett rosa", url: "de/produkte/betten-matratzen/betten/bett-rosa/", slug: "bett-rosa", filterSpec: {"Kategorie": "Bett", "Farbe": "rosa"}, indexedFilter: true, children: [] },
          { label: "Bett braun", url: "de/produkte/betten-matratzen/betten/bett-braun/", slug: "bett-braun", filterSpec: {"Kategorie": "Bett", "Farbe": "braun"}, indexedFilter: true, children: [] },
          { label: "Rattanbett", url: "de/produkte/betten-matratzen/betten/rattanbett/", slug: "rattanbett", filterSpec: {"Kategorie": "Bett", "Material": "Rattan"}, indexedFilter: true, children: [] },
          { label: "Lederbett", url: "de/produkte/betten-matratzen/betten/lederbett/", slug: "lederbett", filterSpec: {"Kategorie": "Bett", "Material": "Leder"}, indexedFilter: true, children: [] },
          { label: "Metallbett", url: "de/produkte/betten-matratzen/betten/metallbett/", slug: "metallbett", filterSpec: {"Typ": "Metallbett"}, indexedFilter: true, children: [] },
          { label: "Metallbett 90x200", url: "de/produkte/betten-matratzen/betten/metallbett-90x200/", slug: "metallbett-90x200", filterSpec: {"Typ": "Metallbett", "Grösse": "90x200"}, indexedFilter: true, children: [] },
          { label: "Metallbett 120x200", url: "de/produkte/betten-matratzen/betten/metallbett-120x200/", slug: "metallbett-120x200", filterSpec: {"Typ": "Metallbett", "Grösse": "120x200"}, indexedFilter: true, children: [] },
          { label: "Metallbett 140x200", url: "de/produkte/betten-matratzen/betten/metallbett-140x200/", slug: "metallbett-140x200", filterSpec: {"Typ": "Metallbett", "Grösse": "140x200"}, indexedFilter: true, children: [] },
          { label: "Metallbett 160x200", url: "de/produkte/betten-matratzen/betten/metallbett-160x200/", slug: "metallbett-160x200", filterSpec: {"Typ": "Metallbett", "Grösse": "160x200"}, indexedFilter: true, children: [] },
          { label: "Metallbett 180x200", url: "de/produkte/betten-matratzen/betten/metallbett-180x200/", slug: "metallbett-180x200", filterSpec: {"Typ": "Metallbett", "Grösse": "180x200"}, indexedFilter: true, children: [] }
        ] },
          { label: "Matratzen", url: "de/produkte/betten-matratzen/matratzen/", slug: "matratzen", filterSpec: {"Kategorie": "Matratze"}, children: [] },
          { label: "Schlafzimmer Textilien", url: "de/produkte/betten-matratzen/schlafzimmer-textilien/", slug: "schlafzimmer-textilien", filterSpec: {"Kategorie": "Textil"}, children: [] },
          { label: "Lattenroste", url: "de/produkte/betten-matratzen/lattenroste/", slug: "lattenroste", filterSpec: {"Kategorie": "Lattenrost"}, children: [] },
          { label: "Nachttische", url: "de/produkte/betten-matratzen/nachttische/", slug: "nachttische", filterSpec: {"Kategorie": "Nachttisch"}, children: [] },
          { label: "Bettkästen", url: "de/produkte/betten-matratzen/bettkaesten/", slug: "bettkaesten", filterSpec: {"Kategorie": "Bettkasten"}, children: [] }
        ]
        /* BETTEN_MATRATZEN_CHILDREN:END */
      },
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
  },
  designmoebel: {
    label: 'Designmöbel', url: 'de/designmoebel/', slug: 'designmoebel',
    image: 'images/cat-designmoebel.jpg',
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
      <div class="overlay-topbar">
        <span class="logo-text">pfister</span>
        <button class="overlay-close" id="overlay-close-btn" aria-label="Menü schliessen">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
      </div>
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
  document.getElementById('overlay-close-btn').addEventListener('click', closeNav);
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
  /* Indexierte Filter (Level-6-ähnlich) erscheinen NICHT im Burger —
     sie sind nur am Seitenende als Text-Links erreichbar (+ Direkt-URL). */
  const visibleChildren = (node.children || []).filter(c => !c.indexedFilter);
  visibleChildren.forEach(child => {
    const li = document.createElement('li');
    const visibleGrandChildren = (child.children || []).filter(c => !c.indexedFilter);
    const hasChildren = visibleGrandChildren.length > 0;
    /* Thumbnail vor Label, wann immer der Knoten ein image-Feld trägt
       (Top-Level + alle Level-4-Kategorien wie "Betten & Matratzen"). */
    const thumb = child.image
      ? `<img class="nav-thumb" src="${resolveUrl(child.image)}" alt="" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'nav-thumb img-placeholder'}))"/>`
      : '';
    if (hasChildren) {
      const btn = document.createElement('button');
      btn.className = 'panel-item' + (child.highlight ? ' highlight' : '');
      btn.innerHTML = `${thumb}<span>${child.label}</span><span class="chev" aria-hidden="true">›</span>`;
      btn.addEventListener('click', () => openChild(child, depth + 1));
      li.appendChild(btn);
    } else {
      const a = document.createElement('a');
      a.className = 'panel-item' + (child.highlight ? ' highlight' : '');
      a.href = resolveUrl(child.url);
      a.innerHTML = `${thumb}<span>${child.label}</span><span class="chev" aria-hidden="true">›</span>`;
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
  const allItems = parent ? (parent.children || []) : Object.values(NAV_DATA);
  /* Indexierte Filter erscheinen nicht als Kacheln (nur als Text-Links
     am Seitenende — siehe Generator). */
  const items = allItems.filter(n => !n.indexedFilter);
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
