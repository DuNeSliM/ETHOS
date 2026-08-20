# Bekannte Einschränkungen

Stand: 20.08.2026.

## Grundsätzlich

- **Keine KI und keine echte Emotionserkennung.** Inhaltsanalysen, Ausdrucksschätzungen, Community-Werte und Demo-Profil sind feste lokale Daten. Das Kamerabild beeinflusst sie nicht.
- **Inoffizielle Mocks.** Instagram und Reddit sind nur erkennbare UI-Attrappen. Es gibt keine Plattformverbindung, Anmeldung, API oder offiziellen Logos/Assets. Sämtliche Accounts, Posts und Zahlen sind erfunden.
- **Nur elf Posts.** Fünf Instagram- und sechs Reddit-Beispiele decken die Forschungsfälle ab, aber kein realistisches Langzeitverhalten.
- **Lokale Medien und Rechte.** Reddit bindet die vom Projekt bereitgestellten Dateien `doom.mp4` und `kerle.jpg` ein; Rechte und Vorführfreigabe müssen außerhalb des Prototyps geklärt sein. Übrige Beiträge verwenden eigene SVG-Szenen.
- **Fiktives Profil.** Das standardmäßige Statistikprofil beschreibt keine Testperson. Es dient nur dazu, Visualisierungen sofort prüfbar zu machen.
- **Community-Daten sind keine Norm.** Trotz „am häufigsten“, Quellenhinweis und Repräsentativitätswarnung können Zahlen Anpassungsdruck erzeugen.
- **Nur Deutsch.** Keine i18n-Schicht.

## Technisch

| Grenze | Auswirkung / Empfehlung |
|---|---|
| Kein Playwright | Smoke-Tests laufen in jsdom; Tastatur, Kamera, 320 px, 200-%-Zoom und Screenreader final manuell prüfen |
| Kein Error Boundary | unerwarteter Renderfehler kann eine leere App hinterlassen |
| View bei Mount | Verlauf bedeutet „Karte gerendert“, nicht viewportgenau gesehen; später IntersectionObserver |
| Ein React-Context | breitere Re-Renders; bei neun Posts unkritisch |
| `localStorage` | browser-/gerätegebunden; bei Fehlern läuft Zustand nur im Speicher |
| Legacy-Präfix | `contextlens.v1.*` bleibt intern sichtbar, damit frühere Studiendaten kompatibel bleiben |
| Breakpoints am Browser | Telefon im Desktopfenster erbt `sm/md`; app-interne Raster bleiben daher einspaltig; Container Queries wären sauberer |
| Recharts-Bundle | größter Vendor-Chunk; Route-Level Lazy Loading wäre eine spätere Optimierung |
| Router 6 | zwei moderate Advisories bleiben; vollständiger Fix erfordert die bewusst zurückgestellte v7-Migration |
| Fokusfilter in jsdom | Browserzweig von `offsetParent` ist nur manuell aussagekräftig |
| Zwei Playermodelle | Instagram nutzt für feste Reaktionszeitachsen weiterhin einen simulierten Player ohne Ton/Buffering; nur der Reddit-Doom-Post nutzt natives Video mit Ton |
| Große lokale Videodatei | `doom.mp4` vergrößert Build und erste Medienabfrage deutlich; für Verteilung später weboptimiert transkodieren |
| Handy-Vollbild | fokussierter Präsentationsmodus innerhalb der Webseite, nicht die sicherheitsgeschützte Browser-Fullscreen-API; der Beenden-Schalter bleibt deshalb immer sichtbar |

## Inhaltliche und ethische Grenzen

- Ein fester Kontextvorschlag kann trotz Hedging übermäßig autoritativ wirken.
- Der Fehlfall `v-ragebait` muss im Debriefing als absichtlich falsche Ausdrucksschätzung offengelegt werden.
- Selbstauskünfte können durch vorher gezeigte Schätzungen oder Community-Werte geankert werden.
- Reaktionskategorien reduzieren individuelle und kulturelle Unterschiede.
- Kleine Testgruppen erlauben qualitative Einsichten, keine repräsentative Statistik.
- Research-Freitext kann Personenbezug enthalten und muss vor externer Auswertung geprüft werden.

## Für eine echte Produktversion nötig

- belastbare Plattformintegration und Vereinbarungen mit Plattformbetreibern,
- Rechtsgrundlage, Datenschutz-Folgenabschätzung und Prüfung biometrischer/sensitiver Daten,
- validiertes On-Device-Modell mit kalibrierter Unsicherheit, Bias-/Kulturprüfung und Beschwerdeweg,
- echte Aggregation mit Mindestgruppen, Differential-Privacy-/Reidentifikationsschutz,
- internationale Sprache und individuelle Ausdrucksprofile ohne Diagnosebehauptung,
- unabhängige WCAG-Prüfung, Security Review, E2E-/Gerätetest und Wiederherstellungsstrategie.

## Bewusst zurückgestellte Low-Risk-Folgeschritte

React Router 7, Playwright, globale Error Boundary und viewportgenaues View-Tracking wurden für P-011 ausdrücklich nicht mit einer funktionsreichen UI-Änderung vermischt. Sie bleiben die nächsten technischen Empfehlungen.
