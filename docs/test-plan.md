# Testplan

Stand: 20.08.2026 · 8 Testdateien, 133/133 Tests grün.

## Automatisierte Abdeckung

| Datei/Bereich | Tests | Schwerpunkt |
|---|---:|---|
| `data.test.ts` | 27 | IDs, Plattformzuordnung, Reddit-Reihenfolge/`r/`, Analysen, Verteilungen, Sprachregeln, Medien/Kommentare |
| `mockEngine.test.ts` | 23 | Determinismus, Gating, Varianten, Kategorien, Fehlfall |
| `ContextAssistant.test.tsx` | 13 | Sheet, Unsicherheit, Grenzen, Fokus/Tastatur, Feedback |
| `CommunityReactionButton.test.tsx` | 10 | sichtbare häufigste Reaktion, Quelle, Pluralität, n, Pause/Opt-out |
| `OwnReactionControl.test.tsx` | 8 | Schätzung/Selbstauskunft, Korrektur, Freitext |
| `LiveSelfView.test.tsx` | 6 | Kamera-Verfügbarkeit, Start/Stopp, Erklärung |
| `personalAnalytics.test.ts` | 3 | Demo-Totale, Plattform/Kategorie, nur Selbstauskunft als Emotion |
| `smoke.test.tsx` | 43 | Einrichtung, drei Apps, Shells, Handy-Vollbild, native/ETHOS-Details, Reddit-Medien, Persistenz, Privacy, Research, Übersicht, 404 |

Das jsdom-Setup mockt `scrollTo`, Elementdimensionen und `getBoundingClientRect`; Router-Future-Flags vermeiden Deprecation-Ausgabe. Diagrammanimationen sind aus. Die Suite muss ohne React-/Recharts-/Router-Warnungen laufen.

## Manuelle Testmatrix

| ID | Schritte | Erwartung |
|---|---|---|
| M-01 | `/phone` nur per Tab bedienen | genau die sinnvollen Ziele; Kulissen-Icons übersprungen |
| M-02 | alle drei Apps öffnen und Home nutzen | korrektes Chrome, Rückkehr nach `/phone` |
| M-03 | Instagram und Reddit prüfen | jeweils sichtbarer, plattformspezifischer Mock-Hinweis |
| M-04 | Instagram vollständig scrollen; Kommentar-Icon und Textlink öffnen | fünf Medienposts; beide Links führen zur nativen Kommentarsektion ohne Analyseblöcke |
| M-05 | Reddit vollständig scrollen | sechs Posts; `r/`-Communities; Doom-Video an Position 2; Kerle-Meme an Position 3 |
| M-05a | Doom-Video vor und nach Play prüfen | zunächst pausiert mit erstem Frame; Play funktioniert; Ton ist nicht stumm; Pause funktioniert |
| M-05b | normale Detail- und ETHOS-Links beider Apps öffnen | Kommentar/Thread und ETHOS-Auswertung bleiben getrennt |
| M-05c | Doom-Post bei normaler und fokussierter Handygröße prüfen | kein Erklärabsatz; Video nutzt volle Breite ohne seitliche schwarze Ränder |
| M-05d | `Handy-Vollbild` ein- und ausschalten | Demo-Erklärung verschwindet; Telefon wird größer und mittig; Beenden stellt Ausgangsansicht wieder her |
| M-06 | führenden Community-Wert öffnen | Textlabel, vollständige Selbstauskunftsverteilung, Quelle, n, Warnungen |
| M-07 | `v-lowcontext` öffnen | kleine Stichprobe gesondert erklärt |
| M-08 | Community aus / ETHOS pausiert | Button/Zahlen zurückgehalten, benannter Grund |
| M-09 | Like + Save, App wechseln, Reload | Zustand bleibt bei aktiver Speicherung |
| M-10 | Speicherung aus, dann interagieren | aktuelle Sitzung funktioniert; nach Reload leer; Schlüssel entfernt |
| M-11 | Daten exportieren | JSON enthält `engagements`, auch aktuelle In-Memory-Werte |
| M-12 | Einzel-, Gesamt- und Reset-Löschung | Engagements passend entfernt; Reset zeigt Onboarding und Kamera aus |
| M-13 | Übersicht initial öffnen | fiktives Demo-Profil ausgewählt und erklärt |
| M-14 | Quelle „Diese Sitzung“ wählen | keine Demo-Zahlen; ehrlicher Leerzustand |
| M-15 | Instagram-Like + Reddit-Upvote + zwei Selbstauskünfte | Sitzung aktualisiert Kategorien, Plattformen und Emotionstabelle |
| M-16 | Demo/Sitzung mehrfach umschalten | keine addierten oder überhängenden Zahlen |
| M-17 | Hell/Dunkel/System | alle Charts, Labels, Tabellen und Fokus sichtbar |
| M-18 | Reduced Motion | keine Chartanimation; Szenen/Übergänge reduziert |
| M-19 | 320 px und 200-%-Zoom | keine horizontale Pflichtnavigation; Inhalte nicht abgeschnitten |
| M-20 | Screenreader | Charts benannt, Listen/Tabellen lesbar, Home/Mock-Hinweise verständlich |
| M-21 | echte Kamera erlauben/ablehnen/stoppen | Preview lokal; kein Einfluss auf Analysen; Tracks stoppen |
| M-22 | alte Routen aufrufen | Redirect in richtige App; Legacy-Post wählt Plattform |
| M-23 | unbekannte ID/Route | Inline-Fehler bzw. Wiederherstellungsseite |
| M-24 | drei Research-Szenarien | Banner, Rückweg, Pflichtfragen, Speicherung und Export funktionieren |

## Regression vor Abgabe

```bash
npm run typecheck
npm test
npm run build
npm audit --audit-level=high
```

Zusätzlich `rg --files src -g '*.js'` prüfen, damit `tsc` keine Duplikate neben TypeScript erzeugt, sowie den Datenschutz-Sweep aus `privacy-review.md` wiederholen.

## Moderierter Nutzertest

Vorab Einwilligung der Testperson; keine Klarnamen in der Sitzungskennung. Reihenfolge der Social Apps variieren. Nach jeder Aufgabe vier Fragen zu Verständlichkeit, Auffindbarkeit, Vertrauen und wahrgenommener Kontrolle (1–5) plus Freitext. JSON/CSV lokal sichern, Freitexte auf Personenbezug prüfen, anschließend Demo zurücksetzen und debriefen: Alle Analysen, Profile und Community-Werte waren simuliert; das Kamerabild wurde nicht ausgewertet.
