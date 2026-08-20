# Nutzerflüsse

Stand: 20.08.2026. Alle Pfade entsprechen `src/app/App.tsx`.

## Navigation

```text
/ → /onboarding → /phone
                    ├── /instagram → /instagram/post/:id (Kommentare)
                    │               └── /instagram/post/:id/ethos
                    ├── /reddit    → /reddit/post/:id (Thread)
                    │               └── /reddit/post/:id/ethos
                    └── /ethos/overview
                        ├── /ethos/settings
                        ├── /ethos/privacy
                        └── /ethos/research
```

Jede App hat eine Home-Steuerung nach `/phone`. Historische Routen werden zur passenden kanonischen Route umgeleitet.

## F-1 – Einstieg und App-Wahl

1. Landing und Onboarding erklären Simulation, Grenzen und Einwilligung.
2. Kamera, Vorschau und Weitergabe bleiben standardmäßig aus.
3. Abschluss führt auf den Telefon-Startbildschirm.
4. Instagram, Reddit und ETHOS sind drei getrennte interaktive Symbole; Kulissen-Icons sind nicht fokussierbar.

**Erfolg:** Die Person kann die drei Apps unterscheiden und versteht, dass ETHOS über beiden Social Apps läuft.

## F-2 – Instagram-Post einordnen

1. `/instagram` zeigt den sichtbaren inoffiziellen Mock-Hinweis und fünf visuelle Posts.
2. Like und Speichern ändern lokalen Zustand; Doppeltipp vergibt nur ein Like.
3. „Kontext erklären“ öffnet ein fokussiertes Sheet mit Lesart, Konfidenz, Begründung, Alternativen und Grenzen.
4. `Am häufigsten: …` öffnet die freiwilligen Community-Selbstauskünfte mit Verteilung, n, Quellenhinweis und kleiner-Stichproben-Warnung.
5. Kommentar-Symbol und „Alle Kommentare ansehen“ öffnen ausschließlich `/instagram/post/:id` mit der Instagram-Kommentarsektion.
6. Nur `ETHOS-Auswertung` im farblich getrennten ETHOS-Streifen öffnet `/instagram/post/:id/ethos` mit Analyse, Verlauf und Community-Verteilung.

**Abbruchrisiko:** Der Community-Wert wird als Norm gelesen; die UI sagt deshalb „am häufigsten“, „simuliert“ und „nicht repräsentativ“.

## F-3 – Reddit-Post einordnen

1. `/reddit` zeigt den Reddit-spezifischen Mock-Hinweis, sechs `r/`-Communities und einen scrollbaren Feed.
2. Der zweite Beitrag ist das pausierte, mit Ton abspielbare Video aus `r/marvel`; der dritte das beschriebene Bild-Meme aus `r/de`.
3. Upvote, Kommentare, Speichern und native Detailseiten verwenden Reddit-Terminologie.
4. Kontext-, Community- und Selbstauskunftssteuerung funktionieren wie auf Instagram; das ETHOS-Overlay bleibt sichtbar.
5. `/reddit/post/:id` zeigt den vollständigen Thread, `/reddit/post/:id/ethos` ausschließlich die getrennte ETHOS-Auswertung.

**Erfolg:** Die Person erkennt Reddit als eigene App, ohne die ETHOS-Schicht für eine Reddit-Funktion zu halten.

## F-4 – Eigene Reaktion und Kamera

1. `/ethos/settings` schaltet die simulierte Reaktionserfassung explizit ein.
2. Optional kann danach die lokale Kameravorschau gestartet werden.
3. Eine vorab geschriebene Ausdrucksschätzung kann durch aktive Selbstauskunft ergänzt/korrigiert werden; beide bleiben getrennt sichtbar.
4. Abschalten der Erfassung beendet Vorschau und Weitergabe.

**Erfolg:** Die Person versteht, dass die Kamera keine Analyse erzeugt.

## F-5 – Statistiken erkunden

1. `/ethos/overview` öffnet mit **Simuliertes Profil**.
2. Donut, Emotionslandschaft und Plattformbalken zeigen reiche fiktive Daten samt Listen/Tabellen.
3. **Diese Sitzung** zeigt ausschließlich Likes/Upvotes, gespeicherte Posts und Selbstauskünfte des aktuellen Browsers.
4. Vor Interaktionen erscheint ein ehrlicher Leerzustand; nach Aktionen aktualisieren sich Werte und Diagramme.

**Erfolg:** Die Quellen werden nicht als zusammengerechnetes persönliches Profil missverstanden.

## F-6 – Speicherung, Export und Löschung

1. Interaktionen bleiben bei aktiver Speicherung über App-Wechsel und Reload erhalten.
2. Wird Speicherung ausgeschaltet, entfernt ETHOS die zugehörigen `localStorage`-Werte; die aktuelle UI bleibt im Arbeitsspeicher funktional.
3. `/ethos/privacy` zeigt Mengen und exportiert auch aktuelle Interaktionen.
4. Ein Verlaufseintrag löscht zugehörige Reaktion und Engagement; „Alle Daten löschen“ leert alle personenbezogenen Prototypdaten, Einstellungen bleiben; Reset setzt zusätzlich Einwilligung und Onboarding zurück.

## F-7 – Research Mode

1. `/ethos/research` bietet drei reproduzierbare Szenarien.
2. Start führt zur passenden kanonischen Instagram-/Reddit-/ETHOS-Route; ein Banner hält den Rückweg offen.
3. Vier Pflichtbewertungen und optionaler Freitext werden lokal gespeichert.
4. JSON/CSV-Export und Löschen bleiben verfügbar.

**Erfolg:** Alle Szenarien sind ohne Moderationsnavigation durchführbar.
