# Visual Novel Editor

Erstelle Visual Novels wie eine Präsentation: Folie für Folie mit Hintergrund, Figuren, Dialog und
Antwortmöglichkeiten, die die Geschichte verzweigen lassen. Läuft komplett im Browser, keine
Serverkomponente nötig.

**Live-Demo:** https://mrsnurb.github.io/projekt-vn/

## Funktionen

- Figuren (Name, Farbe, mehrere Ausdrücke) und Hintergründe einmalig zu Beginn anlegen
- Folien-Editor im PowerPoint-Stil: Folienliste, Bühnenvorschau mit positionierbaren Figuren, Dialog-Editor
- Antworten pro Folie als einfache Liste (Text + Ziel-Folie) – Verzweigungen ganz ohne Node-Editor
- Playtest direkt im Editor
- **HTML-Export**: eine einzelne, eigenständige Datei – offline spielbar per Doppelklick, inkl. aller Verzweigungen
- **PPTX-Export**: lineares Storyboard (folgt jeweils der ersten Antwortoption)
- Projekt lokal speichern/laden (nativer Dateidialog in Chrome/Edge, Download/Upload-Fallback in Firefox) plus automatische Wiederherstellung nach Absturz

## Lokal starten

Voraussetzung: [Node.js](https://nodejs.org/) (LTS).

```bash
npm install
npm run dev
```

Danach im Browser `http://localhost:5173` öffnen.

## Build

```bash
npm run build
```

Erzeugt einen statischen Build in `dist/`, der z.B. auf GitHub Pages gehostet werden kann. Ein
Push auf `main` deployed automatisch über die GitHub Action in `.github/workflows/deploy.yml`.

## Tests

```bash
npm run test
```

Unit-Tests für die Story-Engine (`src/engine/playerEngine.ts`): lineare Abläufe, Verzweigungen,
Zusammenführen von Pfaden, Zyklen, Story-Ende.
