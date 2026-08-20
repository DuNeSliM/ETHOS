# AGENTS.md — KI-Einsatz und Prompt-Transparenz

Dieses Dokument legt offen, welche KI-Unterstützung bei der Entwicklung des
ETHOS-Prototypen (historisch ContextLens) eingesetzt wurde und mit welchen
Prompts. Es dient der
Nachvollziehbarkeit für die Studienarbeit.

- **Werkzeuge/Modelle:** P-001 bis P-010: Claude Code / Claude Opus 5;
  P-011 bis P-023: OpenAI Codex / GPT-5
- **Datum der Sitzungen:** 30.07.2026, 31.07.2026, 03.08.2026 und 20.08.2026
- **Branches:** ursprünglich `feat/contextlens-prototype`, P-011 auf
  `feat/reddit-and-so`
- **Rollenverteilung:** Der Hauptchat agierte als Product Owner, technischer
  Lead und Integrator. Spezialisierte Subagents wurden für Dokumentation und
  Review eingesetzt.

Der **kanonische Prompt-Nachweis** ist
`docs/prompt-documentation/prompt-catalog.md`. Ergänzend:
`prompt-register.md` (tabellarisches Register) und `export-checklist.md`
(Checkliste für den manuellen Chat-Export).

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

### P-009 — Kamerabild, Reaktions-Emoji und mehr Feed-Realismus

**Ausführender:** Main · **Übernommen:** ja · **Sitzung:** 03.08.2026

Wortlaut der Nutzerin/des Nutzers:

> „so we should simulate insta more realistically so we should well keep the
> functions as a demo in tact and also our design should be done more like that
> you see what is recorded in a cam we should be able to use a real cam for that
> and also yeah the extra button we provide with our plugin is an emoji showing
> the most reactions of other users and well if you click on it you get the
> analyiss and percentage of reactions of our users :D"

**Auslegung im Hauptchat.** Drei Arbeitspakete:

1. **Feed-Realismus.** Die Aktionszeile trägt nur noch Symbole, darunter steht
   die „Gefällt N Personen"-Zeile — die Aufteilung dieser Gattung.
   Doppeltippen auf ein Bild vergibt ein „Gefällt mir" mit Herz-Animation,
   nimmt es aber nie zurück. Story-Ring am Profilbild, Vignette über dem Medium.
2. **Echtes Kamerabild.** Ein Selbstbild aus der echten Kamera liegt links
   unten über dem Feed, solange beide Kameraschalter an sind. Siehe
   `docs/decisions.md`, E-018.
3. **Reaktions-Emoji.** Zweiter Knopf der Assistenzschicht an jedem Beitrag:
   das Emoji der häufigsten Reaktion mit Prozentwert, dahinter die vollständige
   Auswertung. Siehe `docs/decisions.md`, E-017.

**Bewusste Abweichungen vom Wortlaut.**

- „keep the functions as a demo intact" wurde wörtlich genommen: alle bisherigen
  Funktionen und alle 99 Tests blieben unverändert gültig; die 18 neuen Tests
  kommen hinzu (117 gesamt).
- Das Emoji zeigt die **Selbstauskünfte**, nicht die Kamera-Schätzungen. Bei
  `v-ragebait` ist das ein anderes Gesicht als das der Kameras — genau der
  Fehlfall, den der Prototyp sichtbar machen soll.
- Das echte Kamerabild ändert **keine** Analyse. Die Reaktionsschätzungen
  bleiben die fest geschriebenen Werte; das Panel des Selbstbilds sagt das mit
  einer dreiteiligen Liste (echt / simuliert / nicht vorhanden).
- Kein Kommentarfeld im Feed, obwohl die Gattung eines hat: ein Bedienelement
  ohne Funktion widerspricht der bereits getroffenen Regel für Kulissenelemente.

**Ergebnis.** `src/features/reactions/useCameraStream.ts`,
`src/features/reactions/LiveSelfView.tsx`,
`src/features/analytics/CommunityReactionButton.tsx`,
`src/features/analytics/communitySummary.ts`, `REACTION_EMOJI` in
`src/lib/labels.ts`, Anpassungen in `VisualPostCard`, `MediaPlaceholder`,
`DiscussionPostCard`, `CommunityReactions`, `CameraPreview`, `PluginOverlay`,
`SocialAppShell` und `src/styles/index.css`. 18 neue Tests (117 statt 99),
Build und Testsuite grün.

---

### P-010 — Gezeichnete Beispielinhalte und die Farbwelt der Vorlage

**Ausführender:** Main · **Übernommen:** ja · **Sitzung:** 03.08.2026

Wortlaut der Nutzerin/des Nutzers:

> „okay nice. Now we just need like real example meme videos or stuff and also
> do the desing like insta and also the color scheme as its just for uni ty"

**Auslegung im Hauptchat.**

1. **Inhalte.** Statt echter Memes — die praktisch immer urheberrechtlich
   geschützt sind — wurden fünf Szenen als SVG gezeichnet, eine je Beitrag mit
   Medien, plus eingebrannte Meme-Untertitel und Hashtags. Bei Videos bewegen
   sich Teile der Zeichnung während der simulierten Wiedergabe. Parallel wurde
   der Weg für echte Dateien gebaut: `media.src` ersetzt die Zeichnung,
   Anleitung in `public/media/README.md`.
2. **Farbwelt.** Verlaufsrampe, Akzentblau `#0095f6` und Like-Rot `#ed4956` der
   Vorlage übernommen.
3. **Feinschliff.** „Abonnieren"-Knopf mit echtem lokalem Zustand, Hashtags in
   der Bildunterschrift eingefärbt.

**Bewusste Abweichungen vom Wortlaut.**

- „real example meme videos" wurde **nicht** als Herunterladen fremder Memes
  umgesetzt. Stattdessen: eigene Zeichnungen als Auslieferungszustand plus ein
  dokumentierter Weg, eigenes oder freigegebenes Material einzusetzen. Der
  Rechtehinweis steht in `public/media/README.md`.
- „design like insta … and the color scheme" wurde für Farben, Verlauf und
  Layout übernommen, für **Name und Logo** weiterhin nicht. Begründung und
  Grenze in `docs/decisions.md`, E-019, das E-015 damit teilweise revidiert.
- Das Akzentblau erreicht auf Weiß nur 3,07:1 und wird daher nie für Fließtext
  benutzt; für textgroße Links gibt es eine abgedunkelte Variante.
- `v-emotional` bekam keinen Meme-Untertitel — der ernst gemeinte Beitrag darf
  nicht vorab als Witz gerahmt werden. Ein Test hält das fest.

**Ergebnis.** `src/features/feed/PostScene.tsx`,
`src/features/feed/Caption.tsx`, `public/media/README.md`, erweiterte
`SimulatedMedia`-Typen, Szenen- und Meme-Animationen sowie Plattform-Akzente in
`src/styles/index.css`, Anpassungen in `MediaPlaceholder`, `VisualPostCard` und
`src/data/posts.ts`. 4 neue Tests (121 statt 117), Build und Testsuite grün.

---

### P-011 — Drei-App-Smartphone: Instagram, Reddit und ETHOS

**Ausführender:** OpenAI Codex / GPT-5 · **Übernommen:** ja · **Sitzung:**
20.08.2026

**Vollständiger Wortlaut und Klärungen:**
`docs/prompt-documentation/prompt-catalog.md`, P-011. Der manuelle Chat-Export
ist als `docs/prompt-documentation/exports/P-011-three-apps-ethos.md`
vorgesehen.

**Kernauftrag.** Das simulierte Telefon erhält drei getrennte, anklickbare Apps:
Instagram als bisheriger visueller Mock, Reddit als eigener scrollbarer
Diskussions-Mock und ETHOS als umbenannte Assistenz-App mit visueller Statistik.
Die Assistenz liegt über beiden Social Apps. Community-Werte benennen die am
häufigsten selbstberichtete Reaktion sichtbar und sprechen unter 50 Prozent
nicht von einer Mehrheit.

**Klärungsentscheidungen.** Reale Plattformnamen, aber keine offiziellen Logos,
Assets, Authentifizierung oder APIs; ein reiches fiktives Demo-Profil als
Standard und eine strikt getrennte Sitzungsquelle; persistente Likes/Upvotes und
Speicherungen mit memory-only-Verhalten bei deaktivierter Speicherung;
risikoarme Dependency- und Warnungsbereinigung. Router 7, Playwright, globale
Error Boundary und viewportgenaues View-Tracking bleiben bewusst offen.

**Ergebnis.** Kanonische Instagram-, Reddit- und ETHOS-Routen mit historischen
Redirects; zentrale Identität und `SocialPlatform`; `PostEngagement` in Zustand,
Export, Löschung und Reset; Reddit-Shell; ETHOS-Overlay über beiden Apps;
deterministisches Demo-Profil und getrennte Sitzungsanalyse; Donutdiagramm,
100-%-Emotionslandschaft und direkt beschriftete Plattformbalken mit semantischen
Alternativen. Recharts 3 und kompatible Patches; Typprüfung, 127/127 Tests und
Produktionsbuild erfolgreich. Keine hohe oder kritische Audit-Schwachstelle;
zwei moderate Router-v6-Advisories bleiben bis zur v7-Migration dokumentiert.

---

### P-012 — Native Kommentare und Reddit-Medien

**Ausführender:** OpenAI Codex / GPT-5 · **Übernommen:** ja · **Sitzung:**
20.08.2026

**Vollständiger Wortlaut:**
`docs/prompt-documentation/prompt-catalog.md`, P-012. Der manuelle Chat-Export
ist als `docs/prompt-documentation/exports/P-012-comments-reddit-media.md`
vorgesehen.

**Kernauftrag.** Normale Instagram-Kommentar-Controls sollen die bekannte
Instagram-Kommentarsektion statt der ETHOS-Analyse öffnen. Reddit soll `r/`
verwenden und als zweiten Post ein bedienbares, hörbares Doom-Video aus
`r/marvel`, als dritten ein Kerle-Meme aus `r/de` zeigen.

**Ergebnis.** Native Instagram-Kommentar- und Reddit-Thread-Seiten sind von
den `/ethos`-Analyseansichten getrennt. Alle Communities verwenden `r/`.
`RedditPostMedia` bindet `doom.mp4` ohne Autoplay/`muted` mit erstem pausiertem
Frame und `kerle.jpg` mit Bildbeschreibung ein. Analyse-/Community-Daten,
Dokumentation und Tests wurden ergänzt; Typprüfung, 132/132 Tests,
Produktionsbuild und Browserprüfung erfolgreich.

---

### P-013 — Doom-Video und Handy-Vollbild

**Ausführender:** OpenAI Codex / GPT-5 · **Übernommen:** ja · **Sitzung:**
20.08.2026

**Vollständiger Wortlaut und Bildreferenzen:**
`docs/prompt-documentation/prompt-catalog.md`, P-013. Der manuelle Chat-Export
ist als `docs/prompt-documentation/exports/P-013-video-phone-fullscreen.md`
vorgesehen.

**Kernauftrag.** Seitliche schwarze Ränder am Doom-Video entfernen und das
Video vergrößern; den technischen Demo-Erklärabsatz am Post entfernen; einen
Modus anbieten, der die linke Demo-Erklärung ausblendet und das Telefon groß
in der Mitte zeigt.

**Ergebnis.** Das native Video nutzt sein 4:3-Seitenverhältnis über die volle
Kartenbreite. `DeviceLayout` besitzt einen umkehrbaren und zugänglichen
`Handy-Vollbild`-Präsentationsmodus ohne Browser-Berechtigung. Typprüfung,
133/133 Tests, Produktionsbuild und visuelle Browserprüfung erfolgreich.

---

### P-014 bis P-019 — ETHOS-App-Icon

**Ausführender:** OpenAI Codex / GPT-5 · **Sitzung:** 20.08.2026
**Vollständige Prompts und Antworten:**
`docs/prompt-documentation/exports/P-014-P-022-icon-security-session.md`,
Anker P-014 bis P-019.

**Kernauftrag.** Ein ETHOS-App-Icon iterativ entwickeln: zunächst teal-farbene
Linse, dann Kamera plus wachsames Auge plus Emotion, anschließend eine
dystopische Tech-Apokalypse-/Surveillance-Anmutung, danach Vereinfachung für den
Smartphone-Icon-Raster, Entfernen der drei Statuspunkte und Rückkehr zum
hell-dunklen Teal-Verlauf. Abschließend alle älteren Varianten löschen und das
finale Icon überall einsetzen.

**Ergebnis.** `public/ethos-app-icon.png` ist das einzige kanonische Asset.
`EthosIcon` bindet es in Smartphone-Topbar, App-Raster, Home-Widget,
ETHOS-Header, Plugin-Overlay und Statusstreifen ein; Favicon und Touch-Icon
verwenden dieselbe Datei. Frühere Varianten wurden aus dem Projekt entfernt.
Die P-016-Bildreferenz ist für die Prompt-Transparenz unter
`docs/prompt-documentation/exports/assets/` gesichert. Typprüfung, 133 Tests und
Build erfolgreich.

---

### P-020 und P-021 — Dependency-Audit und React Router 7

**Ausführender:** OpenAI Codex / GPT-5 · **Sitzung:** 20.08.2026
**Vollständige Prompts und Antworten:**
`docs/prompt-documentation/exports/P-014-P-022-icon-security-session.md`,
Anker P-020 und P-021.

**Kernauftrag.** Zwei moderate Meldungen nach `npm install` untersuchen und
anschließend beheben.

**Ergebnis.** Die Meldungen wurden auf React Router 6.30.6 zurückgeführt und
gegen die deklarative Client-Routing-Architektur geprüft. Danach erfolgte die
separat getestete Migration auf `react-router-dom`/`react-router` 7.18.2; die
obsoleten v6-Future-Props wurden entfernt. `npm audit` meldet null bekannte
Schwachstellen; Typprüfung, 133/133 Tests und Produktionsbuild sind grün.

---

### P-022 — Aktive Sitzung dokumentieren

**Ausführender:** OpenAI Codex / GPT-5 · **Sitzung:** 20.08.2026
**Vollständiger Prompt und Antwort:**
`docs/prompt-documentation/exports/P-014-P-022-icon-security-session.md#p-022`.

**Kernauftrag und Ergebnis.** Alle Nutzerprompts, sichtbaren Arbeitsupdates und
finalen Antworten dieser Sitzung wurden mit Einzelankern dokumentiert. Lokale
absolute Pfade sind für die Abgabe normalisiert; verdeckte Überlegungen und rohe
Werkzeugausgaben bleiben ausgeschlossen. Katalog, Register, Checkliste und
Querverweise reichen nun bis P-022.

---

### P-023 — Drei-App-Sitzung vollständig dokumentieren

**Ausführender:** OpenAI Codex / GPT-5 · **Sitzung:** 20.08.2026
**Vollständige Prompts und Antworten:**
`docs/prompt-documentation/chat-transcript-2026-08-20.md`.

**Kernauftrag und Ergebnis.** Alle sichtbaren Nutzerprompts, Pläne,
Arbeitsupdates und Abschlussantworten des getrennten Drei-App-Tasks wurden
chronologisch dokumentiert. Das Transkript umfasst P-011 bis P-013 und P-023;
die projektweit bereits im parallelen Icon-/Security-Task vergebenen IDs P-014
bis P-022 bleiben getrennt. System-/Entwickleranweisungen, interne Begründungen
und Werkzeugprotokolle sind kein Bestandteil des Nutzer-/Assistentenverlaufs.
Katalog, Register, Checkliste und Querverweise reichen nun bis P-023.

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
- Der aktuelle Stand besteht 133 Tests, Typprüfung und Produktionsbuild.
- Die Aussagen zur Produktrahmung sind ebenfalls testgestützt: dass der
  Startbildschirm drei getrennte Apps anbietet, dass Kulissensymbole keine
  Bedienelemente sind und dass ein funktionsloses Bedienelement der simulierten
  App das auch sagt, prüft `src/app/smoke.test.tsx`.
