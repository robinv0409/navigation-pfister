# Bilder – Pfister Prototyp

Alle Bilder der Seite werden aus diesem Ordner geladen. Fehlt ein Bild,
ersetzt `js/main.js` es automatisch durch einen grauen Platzhalter mit
Alt-Text – es erscheint nie ein broken-image-Icon.

## Erwartete Dateien

### Allgemein
- `hero.jpg` — Hero-Bild auf der Startseite (ca. 1600×1000, JPG)
- `pfister-logo.png` — Logo im Header (Hoehe 24px, transparent)

### Kategorie-Kacheln (fuer Burger + Uebersichten)
- `cat-produkte.jpg`
- `cat-raeume.jpg`
- `cat-marken.jpg`
- `cat-angebote.jpg`
- `cat-betten-matratzen.jpg`
- `cat-sofas-sessel.jpg`
- `cat-tische-stuehle.jpg`
- `cat-garten-balkon.jpg`
- `cat-vorhaenge.jpg`
- `cat-beleuchtung.jpg`
- `cat-dekoration.jpg`
- `cat-baby-kinder.jpg`
- `cat-textilien.jpg`
- `cat-schlafzimmer.jpg` … `cat-entree-diele.jpg` (pro Raum)

Format quadratisch (ca. 800×800), JPG, ca. 100–200 kB.

### Produkt-Bilder
Dateiname-Schema: `p-<produkt-slug>.jpg` (Seitenverhaeltnis 4:3, ca. 1000×750).

Beispiele:
- `p-sofa-lugano.jpg`
- `p-bett-basel.jpg`
- `p-esstisch-zuerich.jpg`
- `p-pendelleuchte-arco.jpg`
- …

## Hinweis zum Fallback

Fehlt ein Bild, erscheint ein grauer Platzhalter mit dem Alt-Text des Bildes.
So kann der Prototyp auch ohne finale Bilder vorgezeigt werden.
