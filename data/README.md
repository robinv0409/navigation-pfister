# Produkt-Daten

Dieser Ordner enthält den **zentralen Produkt-Datensatz** für den Pfister-
Prototyp. Die Website liest beim Start automatisch `data/produkte.json`
und zeigt die Produkte auf allen passenden Kategorieseiten an (gefiltert
nach der jeweiligen `filterSpec` der Seite).

## Upload-Workflow (via Chat)

1. Du hängst eine **Excel** (`.xlsx`) oder **CSV** (`.csv`) an deine Nachricht
   im Chat an.
2. Ich committe die Rohdatei nach `data/produkte.xlsx` (bzw. `.csv`) und
   erzeuge daneben `data/produkte.json` mit:
   ```bash
   python3 tools/import_excel.py data/produkte.xlsx
   ```
3. Push → GitHub Pages deployt in 1–3 Minuten → alle Sub-Seiten zeigen
   die neuen Produkte automatisch (vorgefiltert nach Seiten-Attribut).

Das Browser-Upload-Feature auf `/de/produkte/betten-matratzen/` bleibt
parallel bestehen und überschreibt im Browser (`localStorage`) den
Default-Datensatz aus diesem Ordner.

## Spalten-Schema der Excel/CSV

| Spalte          | Pflicht | Bedeutung / Beispiel                                   |
|-----------------|---------|--------------------------------------------------------|
| `Name`          | ✓       | Produktname, z.B. `Boxspringbett Basel 180x200`        |
| `Preis`         | ✓       | Zahl in CHF, z.B. `2490`                              |
| `AltPreis`      |         | Ursprungspreis bei Sale-Artikeln                      |
| `Bild`          |         | URL oder relativer Pfad; fehlt → grauer Platzhalter   |
| `Badge`         |         | `Neu`, `Sale` oder leer                               |
| **`Kategorie`** | ✓       | `Bett` · `Matratze` · `Lattenrost` · `Nachttisch` · `Bettkasten` · `Textil` |
| `Matratzenmass` |         | z.B. `180x200`. Alias: `Grösse`, `Groesse`, `Mass`    |
| `Farbe`         |         | z.B. `grau`, `beige`, `schwarz`                       |
| `Material`      |         | z.B. `Stoff`, `Leder`, `Eiche massiv`                 |
| `Produktart`    |         | z.B. `Boxspringbett`, `Polsterbett`. Alias: `Typ`     |
| `Marke`         |         | z.B. `Hasena`, `Jensen`, `Riposa`, `Pfister Collection`|
| `Härtegrad`     |         | z.B. `weich`, `mittel`, `fest`                        |

Die Filter-Pills auf den Kategorieseiten nutzen die Spalten in fester
Reihenfolge: **Matratzenmass · Farbe · Material · Produktart**.

## Wie die Seiten die Daten filtern

Jede Kategorieseite hat ein fix codiertes `filterSpec` (z.B.
`{"Typ":"Boxspringbett"}` auf `/boxspringbetten/`). Die Website zeigt
nur Produkte, bei denen *alle* angegebenen Spalten-Werte passen.

Zusätzlich kann der Nutzer über die Filter-Pills weiter einschränken
(Multi-Select pro Spalte, AND zwischen Spalten).

## Bilder

Spalte `Bild` kann enthalten:
- Absolute URL (z.B. `https://images.unsplash.com/photo-…`)
- Relativer Repo-Pfad (`images/produkte/boxspringbett-basel.jpg`)
- Leer → automatischer grauer Platzhalter mit Produkt-Name als Alt-Text
