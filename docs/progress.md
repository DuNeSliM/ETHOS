# Fortschritt

Stand: 03.08.2026 · Branch `feat/contextlens-prototype`
**Build:** erfolgreich · **Tests:** 121 / 121 grün

## Phasenübersicht

| Phase | Inhalt | Status |
|---|---|---|
| 1 | Product Skeleton: Setup, Routing, Landing, Onboarding, Navigation, Design-Tokens, erste Feed-Ansicht | **abgeschlossen** |
| 2 | Context Assistant: Button, Karten, Unsicherheit, Ragebait-Hinweis, Erklärung | **abgeschlossen** |
| 3 | Viewer Reaction Simulation: Anzeige, Korrektur, Kamera-UI, Trennung Schätzung/Selbstauskunft | **abgeschlossen** |
| 4 | Transparency and Analytics: Community, Verlauf, persönliche Übersicht, Speicherung, Löschen | **abgeschlossen** |
| 5 | Research Mode: drei Aufgaben, Bewertung, lokale Speicherung, JSON-/CSV-Export | **abgeschlossen** |
| 6 | Polish and QA: Responsive, Tastatur, Kontraste, Texte, Build, Tests, Leerzustände, Reset | **abgeschlossen** |
| 7 | Produktrahmung: simuliertes Telefon, Startbildschirm, eigenständige Plattform-App, Assistenz als Erweiterung darüber | **abgeschlossen** |
| 8 | Echtes Kamerabild über dem Feed, Emoji-Knopf für Community-Reaktionen, genauere Feed-Konventionen | **abgeschlossen** |
| 9 | Gezeichnete Szenen statt grauer Platzhalter, Meme-Untertitel, Farbwelt der Vorlage, Weg für echte Clips | **abgeschlossen** |

## Was funktioniert

**Inhalt und Feeds**
- 9 Beispielbeiträge (5 Visual Feed, 4 Discussion Feed) mit Kommentar-Threads
- Sichtbarer Umschalter zwischen beiden Ansichten
- Gezeichnete SVG-Szene je Beitrag statt grauer Platzhalter; Teile davon
  bewegen sich, solange die simulierte Wiedergabe läuft
- Meme-Untertitel im Bild, Hashtags in der Bildunterschrift
- Echte Dateien können jede Zeichnung ersetzen (`public/media/README.md`)
- Simulierter Video-Scrubber mit Abspielen/Pause

**Context Assistant**
- „Kontext erklären" an jedem Beitrag und an zwei ausgewählten Kommentaren
- Alle sieben Kartenvarianten erreichbar (Sarkasmus, Ironie, emotionaler Ton,
  Übertreibung, Ragebait, nicht eindeutig, unzureichender Kontext)
- Unsicherheit in drei Stufen als Wort, Zahl und Balken
- „Warum wird das so eingeschätzt?", „Nicht hilfreich", „Andere Interpretation"
- Grenzen-Block auf jeder Karte, sprachlich abgeschwächte Formulierungen
- Wird ein Hinweis durch eine Einstellung zurückgehalten, wird genau diese
  Einstellung benannt und verlinkt

**Eigene Reaktion**
- Simulierte Schätzung, standardmäßig aus
- Korrektur über neun Reaktionsoptionen plus Freitext
- Schätzung und Selbstauskunft dauerhaft getrennt sichtbar
- Optionale lokale Kamera-Vorschau (nur Anzeige, Tracks werden gestoppt)
- Echtes Selbstbild über dem Feed, solange beide Kameraschalter an sind, mit
  Panel, das echtes Bild und simulierte Auswertung auseinanderhält

**Transparenz und Auswertung**
- Community-Reaktionen mit Quellenumschalter, getrennten Teilnehmerzahlen,
  Repräsentativitätswarnung und Quellenerklärung
- Emoji-Knopf an jedem Beitrag: häufigste Selbstauskunft plus Prozentwert,
  dahinter die vollständige Auswertung (E-017)
- Reaktionsverlauf für drei Videos, synchron zum Scrubber
- Persönliche Übersicht ohne Bewertung der Person, mit Einzel- und
  Gesamtlöschung
- Datenschutz-Dashboard mit Zustandsliste, JSON-Export, Löschen, Demo-Reset

**Research Mode**
- Drei geführte Szenarien mit Banner, das den Rückweg offenhält
- Vier Bewertungsfragen (1–5) mit ausgeschriebenen Skalenenden plus Freitext
- Lokale Speicherung, Export als JSON und CSV

**Produktrahmung (Phase 7)**
- Simuliertes Telefon ab 1024 px: Gehäuse, Betriebssystem-Statusleiste mit echter
  Uhrzeit, Home-Indikator; darunter läuft dieselbe Ansicht bildschirmfüllend
- Startbildschirm mit ContextLens-Widget, zwei benutzbaren App-Symbolen und
  Kulissensymbolen ohne Funktion
- Simulierte Foto-App „Momento" mit eigener Wortmarke, Segmented Control,
  Tab-Leiste und eigener Farbwelt (`.platform-skin`, schwarz auf weiß)
- ContextLens erscheint dort nur als Erweiterung: Statusleiste unter der
  Kopfzeile und schwebender Knopf mit Panel (Hauptschalter plus Verweise)
- Bedienelemente der Plattform, die es im Prototyp nicht gibt, sagen das beim
  Antippen, statt stumm zu bleiben

**Querschnitt**
- Hell-/Dunkelmodus, telefonorientiertes Layout von 320 px aufwärts
- Tastaturbedienung, Fokusfalle im Dialog, Skip-Link
- Kein Status wird nur über Farbe kommuniziert
- StatusBar zeigt durchgehend Analyse-, Kamera- und Speicherstatus

## Meilensteinprotokoll

| Schritt | Ergebnis |
|---|---|
| Branch angelegt | `feat/contextlens-prototype` |
| Präsentation ausgewertet | Folie 10 produktrelevant; Folien 11–21 gehören zu einer anderen Aufgabe und wurden nicht verwendet |
| Setup | React 18, TS strict, Vite 6, Tailwind 4, Router 6, Recharts 2, Vitest 3 |
| Erster Build | 3 Konfigurationsfehler behoben (CSS-Typen, `node:url`, Vitest-Typkonflikt durch Vite-5/6-Doppelung → Vitest 3) |
| Testsuite | 89 Tests; 3 Fehlschläge behoben — davon einer ein **echter Inhaltsfehler** (zwei Erklärungen nicht abgeschwächt) |
| Subagents | 5 gestartet, 1 erfolgreich (Designsystem), 4 wegen Sitzungslimit abgebrochen; deren Deliverables im Hauptchat erstellt |
| Review-Korrekturen | 8 Befunde behoben, siehe `AGENTS.md` Abschnitt 3 |
| Kontrastprüfung | Alle Textpaare erreichen AA; zwei Token korrigiert |
| Visual Feed überarbeitet | Struktur einer Foto-Sharing-Oberfläche: Stories-Streifen, randlose 4∶5-Medien, Aktionszeile, Handle-Caption. Nur Struktur übernommen, keine Marke |
| Visual Feed überarbeitet (2. Durchgang) | Feed randlos, Trennung nur durch Haarlinie, Story-Ringe aus der Plattformrampe |
| Telefonrahmen ergänzt | `features/device/`, `#app-viewport` als Scrollfläche, `transform`-Regel für `position: fixed` |
| Apps getrennt | Zwei Shells statt einer: `SocialAppShell` (Plattform) und `AppShell` (ContextLens) |
| Mehrspaltige Desktop-Layouts entfernt | `sm:grid-cols-*` in der Übersicht und das breite Sheet-Layout ersetzt – Begründung in `docs/known-limitations.md` |
| Feed-Konventionen geschärft | Aktionszeile nur mit Symbolen, „Gefällt N Personen"-Zeile darunter, Doppeltipp-Herz (vergibt, nimmt nie zurück), Story-Ring am Profilbild |
| Echtes Kamerabild ergänzt | `useCameraStream` als einzige `getUserMedia`-Stelle; `LiveSelfView` über dem Feed; E-018 |
| Emoji-Knopf ergänzt | Häufigste Selbstauskunft je Beitrag, Sheet mit vollständiger Auswertung; E-017 |
| Bilder gezeichnet | Fünf SVG-Szenen (`PostScene.tsx`), Meme-Untertitel, `src`-Feld für echte Dateien; E-020 |
| Farbwelt der Vorlage übernommen | Verlaufsrampe, Akzentblau, Like-Rot; E-019 revidiert E-015 teilweise |
| Abschlussprüfung | Build erfolgreich, 121/121 Tests grün |

## Offene Punkte

**Vor dem ersten Nutzertest**
- Manuelle Geräteprüfung (echtes Smartphone, echter Desktop-Browser)
- Kamera-Vorschau auf echter Hardware prüfen (M-25 bis M-27 im Testplan)
- Exportdateien in einer Tabellenkalkulation gegenprüfen

**Nachgelagert**
- Screenreader-Test (NVDA, VoiceOver)
- Automatisierter A11y-Scan (axe oder Lighthouse)
- Playwright-E2E-Smoke-Test (optionales Stretch Goal, nicht umgesetzt)
- Chatverläufe manuell exportieren
  (`docs/prompt-documentation/export-checklist.md`)

**Bewusst nicht umgesetzt**
- Alles unter „Ausdrücklich nicht enthalten" in `docs/product-brief.md`
- Die verworfenen Ideen aus der Präsentation, siehe `docs/decisions.md`
