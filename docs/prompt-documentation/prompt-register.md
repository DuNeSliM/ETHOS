# Prompt-Register

Alle für den ContextLens-Prototypen eingesetzten KI-Prompts. Der Wortlaut der
Prompts steht in `AGENTS.md`, Abschnitt 2.

**Modell durchgängig:** Claude Opus 5 (`claude-opus-5`) über Claude Code (CLI).
**Daten:** 30.07.2026 (P-001 bis P-007), 31.07.2026 (P-008).

| Prompt-ID | Datum | Modell | Agent | Zweck | Kurzbeschreibung | Erzeugte Dateien / Ergebnisse | Manuelle Änderungen | Status | Chat-Export |
|---|---|---|---|---|---|---|---|---|---|
| **P-001** | 30.07.2026 | Claude Opus 5 | Main | Master-Prompt und Projektplanung | Vollständiger Auftrag: Produktidee, technischer Rahmen, Screens 6.1–6.12, Simulationssystem, Designrichtung, Accessibility, Subagent-Team, Phasen 1–6, 17 Akzeptanzkriterien; Zusatz: eigener Branch + `AGENTS.md` | Branch `feat/contextlens-prototype`; komplettes Projektsetup; gesamte `src/`-Implementierung; 89 Tests; `AGENTS.md`; `README.md` | Keine — Ausgabe direkt übernommen, iterativ im selben Chat korrigiert | **übernommen** | `exports/P-001-master.md` |
| **P-002** | 30.07.2026 | Claude Opus 5 | Agent 1 (Subagent, abgebrochen) → Main | UX- und Nutzerflussanalyse | Anforderungen aus Auftrag und Präsentation extrahieren, Kernflüsse definieren, Risiken benennen, MVP abgrenzen, Akzeptanzkriterien erstellen; Vorgabe: zuerst den Code lesen, nichts an `src/` ändern | `docs/product-brief.md`, `docs/user-flows.md`, `docs/acceptance-criteria.md` | Subagent brach wegen Sitzungslimit ab; Dokumente im Hauptchat nach denselben Vorgaben erstellt | **teilweise übernommen** | `exports/P-002-agent1.md` (nur Teilverlauf) |
| **P-003** | 30.07.2026 | Claude Opus 5 | Agent 3 (Subagent, abgebrochen) → Main | Frontend-Architektur | Struktur, Datenmodelle, Routing, State Management, lokale Speicherung, Modulgrenzen, Erweiterungspunkte dokumentieren | `docs/architecture.md` | Subagent brach ab; Dokument im Hauptchat erstellt | **teilweise übernommen** | `exports/P-003-agent3.md` (nur Teilverlauf) |
| **P-004** | 30.07.2026 | Claude Opus 5 | Agent 2 (Subagent) | Designsystem | Informationsarchitektur, Designsystem, Komponenten und Zustände, Desktop-/Mobile-Layouts, Accessibility — ausdrücklich „wie implementiert", inklusive Meldung gefundener Inkonsistenzen ohne Behebung | `docs/design-system.md`, `docs/screen-specification.md` | Keine inhaltlichen Änderungen an den Dokumenten. Die vom Agent gemeldeten Inkonsistenzen wurden im Hauptchat im **Quellcode** behoben (6 Fehler, siehe `AGENTS.md` Abschnitt 3) | **übernommen** | `exports/P-004-agent2.md` |
| **P-005** | 30.07.2026 | Claude Opus 5 | Main (Rolle Agent 5) | Simulation und Mock-Daten | Zentrale Mock-Engine mit deterministischen Szenarien, feste Analyse pro Post, Konfidenzstufen, ein Fall mit falscher Analyse, Nutzerkorrektur, Community-Daten mit Quellenangabe, Demo-Reset | `src/features/simulation/mockEngine.ts`, `src/data/posts.ts`, `src/data/analyses.ts`, `src/data/community.ts`, `src/data/timelines.ts`, `src/features/analytics/*` | Zwei Analyse-Erklärungen nachträglich abgeschwächt, nachdem ein selbst geschriebener Test sie als zu bestimmt markierte | **übernommen** | `exports/P-001-master.md` (Teil des Hauptverlaufs) |
| **P-006** | 30.07.2026 | Claude Opus 5 | Agent 6 (Subagent, abgebrochen) → Main | Accessibility- und Datenschutzreview | Texte auf Transparenz prüfen, Einwilligungsfluss prüfen, Kamera- und Datennutzung bewerten, Netzwerk-/Bildaufnahme-Sweep im Code, Kontrastwerte berechnen, WCAG-2.1-AA-Audit, zu definitive KI-Formulierungen markieren | `docs/privacy-review.md`, `docs/accessibility-review.md`; daraus 3 Code-Korrekturen (Kontrastwerte, Verlaufsbänder, Leerzustand) | Subagent brach ab; Review im Hauptchat durchgeführt, Kontrastwerte per Skript berechnet, Sweeps per ripgrep ausgeführt | **teilweise übernommen** | `exports/P-006-agent6.md` (nur Teilverlauf) |
| **P-007** | 30.07.2026 | Claude Opus 5 | Agent 7 (Subagent, abgebrochen) → Main | Qualitätssicherung | Smoke Tests, zentrale Komponenten testen, drei Research-Mode-Szenarien prüfen, Responsive-Verhalten, Fehler und Inkonsistenzen dokumentieren | `docs/test-plan.md`, `docs/known-limitations.md`; Testsuite mit 89 Tests | Subagent brach ab; Testsuite und Dokumente im Hauptchat erstellt | **teilweise übernommen** | `exports/P-007-agent7.md` (nur Teilverlauf) |
| **P-008** | 31.07.2026 | Claude Opus 5 | Main | Produktrahmung: simuliertes Telefon und Plattform-Optik | Demo soll weniger nach Demo und mehr nach Produkt aussehen: Telefon simulieren, darauf eine App, die die Erweiterung auslöst, Optik der bekannten Foto-App-Gattung übernehmen, telefonorientiertes Layout | `src/features/device/*`, `src/features/social-app/*`, `src/features/plugin/*`, `src/pages/PhoneHomePage.tsx`, `src/lib/viewport.ts`, Plattform-Skin in `src/styles/index.css`, zwei getrennte Shells; 7 neue Tests (99 gesamt); Nachzug in 8 Dokumenten | Abweichung vom Wortlaut: Gattung statt Marke — kein Markenname, kein Logo, keine übernommene Ikonografie; erfundene App `Momento`. Icon-only-Tab-Leiste und der übliche Sekundär-Grauton `#8e8e8e` (3,0:1) bewusst nicht übernommen | **übernommen** | `exports/P-008-produktrahmung.md` |

## Statuslegende

- **übernommen** — Ergebnis wurde vollständig verwendet.
- **teilweise übernommen** — Ergebnis wurde verwendet, aber ergänzt, korrigiert
  oder nach Abbruch neu erstellt.
- **verworfen** — Ergebnis wurde nicht verwendet. *(Bisher kein Fall.)*

## Anmerkungen zur Vollständigkeit

1. **Vier Subagents brachen wegen eines Sitzungslimits ab** (P-002, P-003,
   P-006, P-007). Für diese existiert nur ein Teilverlauf. Die jeweiligen
   Deliverables wurden anschließend im Hauptchat erstellt und sind daher Teil
   des Exports von P-001.
2. **P-004 (Agent 2) lief vollständig durch** und hat einen eigenen,
   auswertbaren Verlauf.
3. **Iterative Korrekturen innerhalb des Hauptchats** (Build-Fehler,
   Testfehler, Fehlerbehebungen nach dem Agent-Review) sind keine eigenständigen
   Prompts, sondern Teil des Verlaufs von P-001. Sie sind im Export enthalten.
4. **P-008 stammt aus einer zweiten Sitzung** (31.07.2026) und hat einen eigenen
   Verlauf. Er beginnt mit der Anweisung, zuerst die Dokumentation zu lesen.
5. Es wurde **keine KI zur Laufzeit** des Prototyps eingesetzt. Der ausgelieferte
   Code enthält kein Modell und keinen API-Aufruf; alle Analysen sind fest
   geschriebene Beispieldaten.
