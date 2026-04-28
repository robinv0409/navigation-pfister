#!/usr/bin/env python3
"""Konvertiert ein Excel (.xlsx) oder CSV in data/produkte.json.

Die JSON-Datei wird von js/filter.js und js/subcategory.js automatisch
geladen, wenn im Browser kein User-Upload in localStorage gesetzt ist.

Nutzung:
  python3 tools/import_excel.py data/produkte.xlsx
  python3 tools/import_excel.py "data/test produkte.csv"

Die Quelldatei wird NICHT kopiert — sie liegt bereits im Zielpfad.
Das Script erzeugt daneben data/produkte.json.

Header-Mapping (HEADER_MAP):
  Beim Import werden bekannte Pfister-Spaltennamen auf das interne
  Schema umgeschrieben (z.B. "Produktname" → "Name", "Marken" → "Marke").

Auto-Kategorie:
  Wenn die Quelle keine "Kategorie"-Spalte hat, wird aus dem
  "Typ"/"Produktart"/"Art"-Wert eine Kategorie abgeleitet (Bett,
  Matratze, Lattenrost, Nachttisch, Bettkasten, Textil).
"""
import csv
import json
import sys
import zipfile
import re
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent

# --------------------------------------------------------------------------
# Konfig: Header-Normalisierung + Kategorie-Ableitung
# --------------------------------------------------------------------------

HEADER_MAP = {
    'Produktname': 'Name',
    'Produkttitel': 'Name',
    'Titel': 'Name',
    'Marken':      'Marke',
    'Brand':       'Marke',
    'Produktart':  'Typ',
    'Art':         'Subkategorie',  # behalten als zusätzliches Feld
    'Adresse':     'ProduktURL',
    'Inhaltstyp':  '_skip_',
    'Artikel-Nr 1': 'ArtikelNr',
    'Holzart':     'Holzart',
    'Material Kern Topper': 'MaterialKern',
    'Holzqualität': 'Holzqualitaet',
}

# Regelt: Spaltenwert "Typ" → Kategorie
TYP_ZU_KATEGORIE = {
    # Betten und Bett-Varianten
    **{t: 'Bett' for t in [
        'Bett', 'Doppelbett', 'Einzelbett', 'Boxspringbett', 'Polsterbett',
        'Holzbett', 'Massivholzbett', 'Metallbett', 'Himmelbett', 'Klappbett',
        'Futonbett', 'Ausziehbett', 'Raumsparbett', 'Tagesbett', 'Schlafsofa',
        'Kinderbett', 'Babybett', 'Etagenbett', 'Hochbett'
    ]},
    'Matratze': 'Matratze',
    'Lattenrost': 'Lattenrost',
    'Nachttisch': 'Nachttisch',
    'Bettkasten': 'Bettkasten',
    'Bettwäsche': 'Textil',
    'Frottee':    'Textil',
}

def derive_kategorie(rec):
    """Wenn Kategorie fehlt: vom Typ ableiten, sonst Default 'Bett'."""
    if rec.get('Kategorie'):
        return rec['Kategorie']
    typ = rec.get('Typ', '').strip()
    if typ in TYP_ZU_KATEGORIE:
        return TYP_ZU_KATEGORIE[typ]
    return 'Bett'

# --------------------------------------------------------------------------
# Auto-Augmentation — fügt fehlende Demo-Werte deterministisch hinzu
# --------------------------------------------------------------------------
# Pfister-Daten haben oft keine Preise/Ratings/Discounts. Damit der
# Prototyp wie ein echter Webshop wirkt, generieren wir diese Werte
# pseudozufällig — aber STABIL (gleicher Datensatz → gleicher Wert),
# basiert auf einem Hash über ArtikelNr (oder Name) als Seed.

import hashlib
import random as _random

# Preisbereiche pro Typ (ungefähr Pfister-Niveau).
PRICE_RANGES = {
    'Boxspringbett':  (1490, 4990),
    'Polsterbett':    (590, 2490),
    'Holzbett':       (590, 2290),
    'Massivholzbett': (890, 2890),
    'Metallbett':     (390, 1290),
    'Himmelbett':     (1290, 3490),
    'Klappbett':      (390, 990),
    'Futonbett':      (490, 1290),
    'Ausziehbett':    (490, 1490),
    'Raumsparbett':   (490, 1290),
    'Kinderbett':     (290, 990),
    'Babybett':       (190, 690),
    'Doppelbett':     (790, 2490),
    'Einzelbett':     (390, 1290),
    'Tagesbett':      (590, 1490),
    'Etagenbett':     (590, 1690),
    'Hochbett':       (490, 1390),
    'Familienbett':   (1290, 3490),
    'Bettanlage':     (990, 2990),
    'Balkenbett':     (790, 2290),
    'Lederbett':      (1490, 3990),
}

def _seed_for(rec):
    key = (rec.get('ArtikelNr') or rec.get('Name') or '').strip()
    if not key:
        key = json.dumps(rec, sort_keys=True, ensure_ascii=False)
    return int(hashlib.md5(key.encode('utf-8')).hexdigest(), 16)

def augment(rec):
    """Generiert fehlende Felder deterministisch (Demo-Daten für Prototyp)."""
    rng = _random.Random(_seed_for(rec))

    # --- Preis ---
    if not rec.get('Preis'):
        typ = rec.get('Typ', '').strip()
        lo, hi = PRICE_RANGES.get(typ, (390, 1990))
        # Preis zu nächsten 10er, mit ".90" als typischem Pfister-Suffix.
        base = round(rng.uniform(lo, hi) / 10) * 10
        rec['Preis'] = f'{base - 10 + 0.90:.2f}'   # z.B. 438.90

    # --- Sale (25% der Produkte) ---
    is_sale = rng.random() < 0.25
    if is_sale and not rec.get('AltPreis'):
        try:
            preis_num = float(str(rec['Preis']).replace(',', '.'))
            discount_pct = rng.choice([15, 20, 25, 30, 35, 40])
            alt = round(preis_num / (1 - discount_pct / 100) / 10) * 10
            rec['AltPreis'] = f'{alt:.2f}'
            rec['Discount'] = str(discount_pct)
        except Exception:
            pass

    # --- Rating + ReviewCount (alle Produkte) ---
    if not rec.get('Rating'):
        rating = round(rng.uniform(3.8, 5.0) * 10) / 10
        rec['Rating'] = f'{rating:.1f}'
    if not rec.get('ReviewCount'):
        rec['ReviewCount'] = str(rng.randint(2, 87))

    # --- Online Only (35% der Produkte) ---
    if 'OnlineOnly' not in rec or rec.get('OnlineOnly') == '':
        rec['OnlineOnly'] = 'true' if rng.random() < 0.35 else ''

    # --- Badge (Neu für 15%, Sale wenn Discount, sonst nichts) ---
    if not rec.get('Badge'):
        if is_sale:
            rec['Badge'] = 'Sale'
        elif rng.random() < 0.15:
            rec['Badge'] = 'Neu'

    return rec

def normalize_header(h):
    h = h.strip()
    return HEADER_MAP.get(h, h)

# --------------------------------------------------------------------------
# XLSX-Parser (ohne openpyxl — nur Standardbibliothek)
# --------------------------------------------------------------------------
# Minimaler Parser für die erste Sheet eines XLSX. Reicht für unsere Excel-
# Dateien mit einer einzigen Produkttabelle und ersten Zeile als Header.

NS = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}

def parse_xlsx(path: Path):
    with zipfile.ZipFile(path) as z:
        # Shared Strings (Text-Werte stehen dort, nicht in den Zellen direkt).
        shared = []
        if 'xl/sharedStrings.xml' in z.namelist():
            root = ET.parse(z.open('xl/sharedStrings.xml')).getroot()
            for si in root.findall('main:si', NS):
                # Zelle kann aus mehreren <t>-Runs bestehen.
                parts = [t.text or '' for t in si.findall('.//main:t', NS)]
                shared.append(''.join(parts))

        # Erste Sheet.
        sheet_name = 'xl/worksheets/sheet1.xml'
        if sheet_name not in z.namelist():
            sheet_name = next((n for n in z.namelist() if n.startswith('xl/worksheets/sheet')), None)
        if not sheet_name:
            raise RuntimeError('Keine Worksheet-XML in .xlsx gefunden.')

        root = ET.parse(z.open(sheet_name)).getroot()
        rows = []
        for row in root.findall('main:sheetData/main:row', NS):
            cells = []
            for c in row.findall('main:c', NS):
                ref = c.get('r', '')                         # z.B. "B3"
                t = c.get('t', '')
                col_idx = col_ref_to_idx(re.match(r'[A-Z]+', ref).group(0)) if ref else len(cells)
                # Füll leere Zwischen-Spalten auf.
                while len(cells) < col_idx:
                    cells.append('')
                v_el = c.find('main:v', NS)
                is_el = c.find('main:is', NS)
                if t == 's' and v_el is not None:
                    cells.append(shared[int(v_el.text)])
                elif t == 'inlineStr' and is_el is not None:
                    parts = [x.text or '' for x in is_el.findall('.//main:t', NS)]
                    cells.append(''.join(parts))
                elif v_el is not None:
                    cells.append(v_el.text or '')
                else:
                    cells.append('')
            rows.append(cells)
        return rows

def col_ref_to_idx(letters: str) -> int:
    idx = 0
    for ch in letters:
        idx = idx * 26 + (ord(ch) - ord('A') + 1)
    return idx - 1

# --------------------------------------------------------------------------
# CSV-Parser
# --------------------------------------------------------------------------
def parse_csv(path: Path):
    # Separator heuristisch erkennen (erste Zeile).
    with path.open('r', encoding='utf-8-sig') as f:
        sample = f.readline()
    sep = ';' if sample.count(';') > sample.count(',') else ','
    with path.open('r', encoding='utf-8-sig', newline='') as f:
        reader = csv.reader(f, delimiter=sep)
        return [row for row in reader]

# --------------------------------------------------------------------------
# Hauptlogik
# --------------------------------------------------------------------------
def rows_to_records(rows):
    if not rows:
        return []
    raw_header = [h.strip() for h in rows[0]]
    # Header normalisieren (Pfister-Spalten → internes Schema).
    header = [normalize_header(h) for h in raw_header]
    records = []
    for row in rows[1:]:
        if not any(str(c).strip() for c in row):
            continue
        rec = {}
        for i, h in enumerate(header):
            if h == '_skip_':
                continue
            val = row[i] if i < len(row) else ''
            rec[h] = '' if val is None else str(val).strip()
        # Kategorie ableiten falls nicht vorhanden.
        rec['Kategorie'] = derive_kategorie(rec)
        # Aliase synchronisieren, damit die Filter-Logik in subcategory.js
        # (die nach `Grösse` und `Typ` sucht) auch auf Pfister-Daten greift.
        if rec.get('Matratzenmass') and not rec.get('Grösse'):
            rec['Grösse'] = rec['Matratzenmass']
        if rec.get('Typ') and not rec.get('Produktart'):
            rec['Produktart'] = rec['Typ']
        # Fehlende Demo-Werte (Preis, Rating, Discount, OnlineOnly) ergänzen.
        rec = augment(rec)
        records.append(rec)
    return records

def main():
    if len(sys.argv) < 2:
        print(__doc__, file=sys.stderr)
        sys.exit(1)
    src = Path(sys.argv[1]).resolve()
    if not src.exists():
        print(f'Datei nicht gefunden: {src}', file=sys.stderr)
        sys.exit(1)

    suffix = src.suffix.lower()
    if suffix in ('.xlsx', '.xlsm'):
        rows = parse_xlsx(src)
    elif suffix == '.csv':
        rows = parse_csv(src)
    else:
        print(f'Unterstütze Formate: .xlsx, .xlsm, .csv (nicht: {suffix})', file=sys.stderr)
        sys.exit(1)

    records = rows_to_records(rows)
    if not records:
        print('Datei enthält keine Zeilen.', file=sys.stderr)
        sys.exit(1)

    out = ROOT / 'data' / 'produkte.json'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'wrote {out}  ({len(records)} Datensätze, {len(records[0])} Spalten)')

if __name__ == '__main__':
    main()
