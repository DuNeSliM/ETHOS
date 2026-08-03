# AGENTS.md — KI-Einsatz und Prompt-Transparenz

Dieses Dokument legt offen, welche KI-Unterstützung bei der Entwicklung des
ContextLens-Prototypen eingesetzt wurde und mit welchen Prompts. Es dient der
Nachvollziehbarkeit für die Studienarbeit.

- **Werkzeug:** Claude Code (CLI)
- **Modell:** Claude Opus 5 (`claude-opus-5`)
- **Datum der Sitzungen:** 30.07.2026 und 31.07.2026
- **Branch:** `feat/contextlens-prototype`
- **Rollenverteilung:** Der Hauptchat agierte als Product Owner, technischer
  Lead und Integrator. Spezialisierte Subagents wurden für Dokumentation und
  Review eingesetzt.

Ergänzend: `docs/prompt-documentation/prompt-register.md` (tabellarisches
Register), `docs/prompt-documentation/export-checklist.md` (Checkliste für den
manuellen Chat-Export).

---

## 1. Übersicht der Agents

| ID | Rolle | Ausführung | Ergebnis |
|---|---|---|---|
| **Main** | Product Owner, technischer Lead, Integrator | Hauptchat | Projektsetup, gesamte Implementierung, Integration, Fehlerbehebung |
| **Agent 1** | Product and UX Research | Subagent | **abgebrochen** (Sitzungslimit) → im Hauptchat fertiggestellt |
| **Agent 2** | UX and Design System | Subagent | **erfolgreich** |
| **Agent 3** | Frontend Architecture | Subagent | **abgebrochen** (Sitzungslimit) → im Hauptchat fertiggestellt |
| **Agent 4** | Feed and UI Implementation | im Hauptchat ausgeführt | siehe Begründung unten |
| **Agent 5** | Simulation and Analytics | im Hauptchat ausgeführt | siehe Begründung unten |
| **Agent 6** | Privacy and Accessibility Review | Subagent | **abgebrochen** (Sitzungslimit) → im Hauptchat fertiggestellt |
| **Agent 7** | QA and User Testing | Subagent | **abgebrochen** (Sitzungslimit) → im Hauptchat fertiggestellt |

**Warum Agent 4 und 5 nicht als Subagents liefen.** Beide hätten dieselben
zentralen Dateien bearbeitet — Design-Tokens (`src/styles/index.css`), den
Typvertrag (`src/types/index.ts`) und die Mock-Engine. Parallel schreibende
Agents hätten sich dort gegenseitig überschrieben. Die Implementierung erfolgte
deshalb im Hauptchat, mit den Rollenbeschreibungen als Arbeitsphasen. Siehe
`docs/decisions.md`, E-013.

**Warum vier Subagents abbrachen.** Ein Nutzungslimit der Sitzung. Agent 2 war
zu diesem Zeitpunkt bereits fertig. Die Deliverables der übrigen vier wurden
anschließend im Hauptchat erstellt — inhaltlich nach denselben Vorgaben, aber
ohne separaten Chatverlauf. Das ist beim Export zu berücksichtigen.

---

## 2. Prompts im Wortlaut

### P-001 — Master-Prompt und Projektplanung

**Ausführender:** Main · **Übernommen:** ja

Der vollständige Auftragstext der Nutzerin/des Nutzers. Umfang: 17 Abschnitte
mit Produktidee, Zielsetzung, technischem Rahmen, Produktform (ContextLens mit
Visual Feed und Discussion Feed), zentraler UI-Komponente „Kontext erklären",
den erforderlichen Screens 6.1–6.12, dem Simulationssystem inklusive
TypeScript-Typvorgaben, Designrichtung, Accessibility-Anforderungen,
Subagent-Team, Umsetzungsphasen 1–6, Prompt-Dokumentation, erwarteter
Projektstruktur, 17 Akzeptanzkriterien und Arbeitsweise.

Zusatzanweisung am Ende: *„do it in an extra branch and also add agents.md where
you include a list of all prompts we did for transparency"*.

> **Für den Export:** Der Master-Prompt ist der erste Nutzerbeitrag im
> exportierten Chatverlauf und muss dort im vollen Wortlaut erhalten bleiben.
> Er wird hier nicht dupliziert, um Abweichungen zwischen zwei Fassungen zu
> vermeiden.

**Ergebnis:** Branch `feat/contextlens-prototype`, Projektsetup, vollständige
Implementierung, alle Dokumente.

---

### P-002 — UX- und Nutzerflussanalyse (Agent 1)

**Ausführender:** Subagent (abgebrochen) → Main · **Übernommen:** teilweise
(Aufgabe im Hauptchat ausgeführt)

Kernanweisungen des Prompts:

- Rolle: Agent 1 (Product and UX Research). Dokumente auf Deutsch.
- Zuerst die **tatsächliche Implementierung lesen** (`src/types`, `src/data`,
  `mockEngine.ts`, `App.tsx`, `AppStateProvider.tsx`, `scenarios.ts`,
  `src/pages`), keine Quelldateien ändern.
- Kontext: vier strikt getrennte Aussageebenen; Sprachregeln (abgeschwächte
  Formulierungen erlaubt, definitive Aussagen über Gefühle verboten).
- Hintergrund: Die ursprüngliche Idee (README) und die Präsentation nennen
  dauerhafte Emotionserfassung, „Verkauf Nutzerdaten" und KI-Training. Diese
  Richtung wird bewusst verworfen; das ist als Produktentscheidung und als
  Risiko zu dokumentieren.
- Deliverables: `docs/product-brief.md` (Problem, Vision, vier Ebenen,
  MVP-Abgrenzung, 10 Forschungsfragen, Risiken, „bewusst verworfene Ideen"),
  `docs/user-flows.md` (Kernflüsse mit Einstieg, Schritten, Erfolgskriterium,
  Abbruchrisiken, Navigationsdiagramm), `docs/acceptance-criteria.md`
  (Given/When/Then, Status ERFÜLLT/TEILWEISE/OFFEN, plus die 17 Kriterien aus
  dem Auftrag).
- Abschlussbericht: erstellte Dateien, Annahmen, offene Entscheidungen, Risiken.

---

### P-003 — Frontend-Architektur (Agent 3)

**Ausführender:** Subagent (abgebrochen) → Main · **Übernommen:** teilweise

Kernanweisungen:

- Rolle: Agent 3 (Frontend Architecture). Dokument auf Deutsch, Bezeichner
  englisch. Nur Dokumentation, kein Quellcode.
- Zu lesen: `package.json`, `vite.config.ts`, `tsconfig.json`, `src/app/*`,
  `src/types`, `src/lib`, `mockEngine.ts`, `src/data`, Hooks, Tests.
- Deliverable `docs/architecture.md` mit zehn geforderten Abschnitten:
  Überblick mit echten Versionen und den harten Randbedingungen;
  Verzeichnisstruktur mit Modulgrenzen; Datenmodell inklusive der
  Namenskonvention `...Analysis` / `estimated...` / `selfReported...` und der
  Begründung, warum diese nie verschmelzen dürfen; Simulation Engine
  (Determinismus, Einwilligungs-Gating mit benanntem Grund statt `null`,
  Rangfolge in `deriveCardVariant`, der absichtliche Fehlfall bei `v-ragebait`);
  State Management inklusive Schalterkopplung und „`recordEstimate`
  überschreibt nie"; Routing; lokale Speicherung; Build- und Test-Setup;
  Erweiterungspunkte als nummerierte Rezepte; bewusste Vereinfachungen.

---

### P-004 — Designsystem (Agent 2)

**Ausführender:** Subagent · **Übernommen:** ja (erfolgreich abgeschlossen)

Kernanweisungen:

- Rolle: Agent 2 (UX and Design System). Dokumente auf Deutsch. Designsystem
  **wie implementiert** dokumentieren, nicht erfinden. Kein Quellcode ändern.
- Zu lesen: `src/styles/index.css` (Token-Quelle: `--cl-*` über `@theme inline`
  als Tailwind-Utilities), alle Komponenten, alle Features, `AppShell`,
  `src/pages`, `src/lib/labels.ts`.
- Deliverable `docs/design-system.md`: Prinzipien; die zwei visuellen Welten
  (Plattform vs. Assistenzschicht) und wie sie getrennt werden; vollständige
  Token-Tabellen mit Hell-/Dunkelwerten; das „Simuliert"-Markierungssystem;
  Typografie, Abstände, Radien, Elevation; Komponenteninventar mit Varianten
  und Zuständen; die 7 Kartenvarianten mit Icon und Farbfamilie sowie der
  Hinweis, dass die Variante **abgeleitet** und nicht gespeichert wird;
  A11y-Regeln des Systems; Dark-Mode-Strategie.
- Deliverable `docs/screen-specification.md`: ein Abschnitt je Route,
  Desktop- und Mobile-Layout, Komponenten, Inhalte, Zustände (leer / mit Daten /
  durch Einstellung deaktiviert / pausiert), A11y-Hinweise, ASCII-Wireframes,
  Komponentenplan.
- Abschlussbericht inklusive gefundener Inkonsistenzen — ausdrücklich **ohne**
  sie zu beheben.

**Wirkung.** Agent 2 meldete zwölf Inkonsistenzen. Davon wurden im Hauptchat
sechs als echte Fehler behoben (siehe Abschnitt 3).

---

### P-005 — Simulation und Mock-Daten

**Ausführender:** Main (Rolle Agent 5) · **Übernommen:** ja

Als Arbeitsphase im Hauptchat ausgeführt, abgeleitet aus Abschnitt 7 des
Master-Prompts: zentrale Mock-Engine mit deterministischen Szenarien, feste
Analyse pro Post, verschiedene Konfidenzstufen, ein Szenario mit falscher oder
unklarer Analyse, Nutzerkorrektur, Neuberechnung der persönlichen Übersicht,
Community-Daten mit sichtbarer Datenquelle, Reset der Demo, sowie die drei
vorgegebenen TypeScript-Typen.

**Ergebnis:** `src/features/simulation/mockEngine.ts`, `src/data/*.ts`,
`src/features/analytics/*`.

---

### P-006 — Accessibility- und Datenschutzreview (Agent 6)

**Ausführender:** Subagent (abgebrochen) → Main · **Übernommen:** teilweise

Kernanweisungen:

- Rolle: Agent 6. **Reviewer, nicht Implementierer** — Befunde mit Datei, Zeile,
  Begründung und Vorschlag melden, `src/` nicht ändern.
- Prüfkriterien A (Wortlaut/epistemische Ehrlichkeit): abgeschwächte
  Formulierungen; Schätzungen beschreiben sichtbares Verhalten, keine inneren
  Zustände; verbotene Formulierungen; keine Vermischung der drei Aussagetypen;
  keine psychologischen Diagnosen; simulierte Daten eindeutig markiert.
- Prüfkriterien B (Einwilligung/Daten): Schalter einzeln; Kamera und Weitergabe
  niemals standardmäßig aktiv; Pausieren, Korrigieren, Exportieren, Löschen;
  **Verifikation der UI-Behauptungen im Code** — Suche nach `fetch`,
  `XMLHttpRequest`, `WebSocket`, `sendBeacon`, `canvas`, `drawImage`,
  `toDataURL`, `getImageData`, `MediaRecorder`, externen URLs; Prüfung, ob die
  Kamera-Vorschau ausschließlich anzeigt und ihre Tracks stoppt.
- Prüfkriterien C (Accessibility, WCAG 2.1 AA): Semantik, Tastatur, Fokus,
  Dialogverhalten, ARIA, **keine reine Farbkodierung**, Diagramm-Alternativen,
  **Kontrastwerte mit echten Zahlen berechnen**, `prefers-reduced-motion`,
  skalierbare Schrift, Formularbeschriftungen, Statusmeldungen, verständliche
  Sprache.
- Deliverables: `docs/privacy-review.md` und `docs/accessibility-review.md`, je
  mit Befundtabelle, Verifikationsergebnissen und priorisierten Empfehlungen.
  Für das Datenschutzdokument zusätzlich ein Abschnitt zu DSGVO Art. 9 und
  EU AI Act, ausdrücklich als „nicht im Prototyp umgesetzt" gekennzeichnet.

---

### P-007 — Qualitätssicherung (Agent 7)

**Ausführender:** Subagent (abgebrochen) → Main · **Übernommen:** teilweise

Kernanweisungen:

- Rolle: Agent 7 (QA and User Testing). Dokumente auf Deutsch. Bestehende Tests
  und Code lesen, `npm test` und `npm run build` ausführen dürfen, aber **keinen
  Quellcode und keine Testdateien ändern**.
- Deliverable `docs/test-plan.md`: Testziele; Abdeckung der automatisierten
  Tests je Datei als Tabelle; manuelle Testfälle mit ID, Vorbedingung,
  Schritten, erwartetem Ergebnis — mindestens beide Feeds, alle sieben
  Kartenvarianten mit dem jeweils auslösenden Beitrag, Unsicherheitsanzeige,
  Reaktionskorrektur, Trennung Schätzung/Selbstauskunft, Community-Umschalter,
  Verlaufssynchronisation, alle Einwilligungsschalter, Pausieren, Exporte,
  Löschfunktionen, die drei Szenarien, Leerzustände, unbekannte Route,
  Hell/Dunkel, Tastaturbedienung, 200 % Zoom, 320 px und Desktop; Abschnitt zur
  Durchführung moderierter Nutzertests inklusive Einwilligung der Testperson,
  den vier Bewertungsfragen und der Ergebnissicherung; Regressionsstrategie.
- Deliverable `docs/known-limitations.md`: grundsätzliche, technische und
  inhaltliche Einschränkungen, Risiken für die Nutzertests, sowie was einer
  echten Produktversion fehlen würde. Jeder Punkt muss am Code überprüfbar sein.

---

### P-008 — Produktrahmung: simuliertes Telefon und Plattform-Optik

**Ausführender:** Main · **Übernommen:** ja · **Sitzung:** 31.07.2026

Wortlaut der Nutzerin/des Nutzers:

> „read the docs and then also we should copy the instagram desing as well its
> our selling point for the prof and also just a demo, though we should make the
> demo less demo and more like a real product so yeah maybe we should simulate a
> phone and an app on the phone that activates our plugin and we have a more
> mobile friendly design :d"

**Auslegung im Hauptchat.** Aus dem Auftrag wurden vier Arbeitspakete abgeleitet:

1. Ein simuliertes Telefon als Rahmen der gesamten Demo, inklusive
   Startbildschirm, von dem aus die Erweiterung und die fremde App getrennt
   erreichbar sind.
2. Die simulierte Plattform bekommt die Optik ihrer Gattung: eigene Wortmarke,
   Stories-Ringe, randlose Beiträge, Tab-Leiste, schwarz-auf-weiß-Farbwelt.
3. ContextLens erscheint über dieser App nur noch als Erweiterung – Statusleiste
   und schwebender Knopf – und hat daneben eine eigene App.
4. Das Layout wird durchgehend telefonorientiert; mehrspaltige Desktop-Layouts
   werden entfernt statt ausgeblendet.

**Bewusste Abweichung vom Wortlaut.** „Copy the Instagram design" wurde als
*Gattung*, nicht als *Marke* umgesetzt: übernommen sind Aufbau und Konventionen,
nicht Name, Logo, Ikonografie oder Markenfarbverlauf. Die simulierte App heißt
`Momento`, der Farbverlauf ist eine eigene Rampe, und jede Feed-Ansicht trägt
sichtbar den Hinweis, dass Konten und Zahlen erfunden sind. Begründung in
`docs/decisions.md`, E-015. Ebenfalls nicht übernommen wurde die reine
Icon-Tab-Leiste dieser Gattung: Beschriftungen bleiben sichtbar, und der
Sekundär-Grauton `#8e8e8e` wurde durch einen kontraststarken ersetzt.

**Ergebnis.** `src/features/device/`, `src/features/social-app/`,
`src/features/plugin/`, `src/pages/PhoneHomePage.tsx`, Plattform-Skin und
Geräteregeln in `src/styles/index.css`, zwei getrennte Shells in der
Routentabelle. Sieben neue Tests (99 statt 92), Build und Testsuite grün.
Dokumentation nachgezogen in `decisions.md` (E-014 bis E-016), `design-system.md`,
`screen-specification.md`, `accessibility-review.md`, `test-plan.md`,
`known-limitations.md`, `progress.md` und `README.md`.

---

## 3. Korrekturen nach dem Agent-Review

Aus dem Bericht von Agent 2 und den eigenen Prüfungen des Hauptchats wurden
folgende **echte Fehler** behoben:

| # | Befund | Datei | Behebung |
|---|---|---|---|
| 1 | Klickfläche des Einwilligungsschalters (24 px) kleiner als der sichtbare Schalter (44 px); Fokusring umschloss nur ein Drittel | `components/Toggle.tsx` | Eingabefeld auf `h-6 w-11` vergrößert |
| 2 | `hintVisibility` war eine tote Einstellung — bedienbar, aber ohne Wirkung | `context-assistant/ContextAssistantButton.tsx` | Option „Dezenter Hinweis" zeigt nun die Variantenüberschrift am Beitrag |
| 3 | Leerzustand der Community-Anzeige nannte pauschal die Nutzereinstellung als Grund, auch bei Pause oder fehlenden Daten | `pages/PostDetailPage.tsx` | Drei Fälle werden unterschieden |
| 4 | Vollbild-404 wurde bei unbekannter Beitrags-ID **innerhalb** der Shell gerendert (doppelte Navigation) | `pages/PostDetailPage.tsx` | Inline-Panel statt `NotFoundPage` |
| 5 | Navigationseintrag „Feed" war im Discussion Feed nicht aktiv markiert | `app/AppShell.tsx` | Präfix-Abgleich plus `aria-current="page"` |
| 6 | Beschriftung der Verlaufsbänder mit `mix-blend-luminosity`, `unclear`-Band bei 1,84:1 unlesbar | `features/analytics/ReactionTimeline.tsx` | `text-inverse` statt Blend-Modus; `unclear` durch Schraffur statt Helligkeit unterschieden |
| 7 | `--cl-text-faint` (3,91:1) und `--cl-border-strong` (1,84:1) unter den WCAG-Grenzwerten | `styles/index.css` | Neue Werte, alle geprüften Paare erreichen nun AA |
| 8 | Zwei Analyse-Erklärungen zu bestimmt formuliert | `data/analyses.ts` | Abgeschwächt; ein Test erzwingt die Regel dauerhaft |

Nicht behoben, aber dokumentiert: Fokusfilter-Verhalten in jsdom, schemafeste
Farbverläufe der Medienplatzhalter, ungenutzte Button-Variante — siehe
`docs/known-limitations.md`.

---

## 4. Hinweise zur Prüfbarkeit

- Die Sprachregeln sind nicht nur dokumentiert, sondern als automatisierte Tests
  kodiert (`src/data/data.test.ts`): jede Erklärung muss eine Abschwächung
  enthalten, verbotene Absolutformulierungen führen zum Testfehler.
- Die Datenschutzaussagen sind im Code überprüfbar: die Suche nach Netzwerk- und
  Bildaufnahme-APIs liefert null Treffer im ausführbaren Code. Belege in
  `docs/privacy-review.md`, Abschnitt 1.
- Alle 99 Tests sind grün, `npm run build` läuft fehlerfrei.
- Die Aussagen zur Produktrahmung sind ebenfalls testgestützt: dass der
  Startbildschirm zwei getrennte Apps anbietet, dass Kulissensymbole keine
  Bedienelemente sind und dass ein funktionsloses Bedienelement der simulierten
  App das auch sagt, prüft `src/app/smoke.test.tsx`.
