# Prompt-Katalog P-001 bis P-013

Stand: 20.08.2026. Dieses Dokument ist der **kanonische Prompt-Nachweis** des Projekts. Wo ein historischer Originaltext nicht im Repository vorliegt, ist das ehrlich gekennzeichnet und die verfügbare Aufgabenbeschreibung wird wiedergegeben. Der vollständige Chat bleibt in diesen Fällen nur über den manuellen Export rekonstruierbar.

## P-001 – Master-Prompt und Projektplanung

**Datum / Werkzeug:** 30.07.2026 · Claude Code · Claude Opus 5  
**Verfügbarkeit:** Der sehr lange Originaltext liegt nur im manuellen Chat-Export `exports/P-001-master.md` vollständig vor.

Verfügbare Zusammenfassung: Entwicklung eines ContextLens-Forschungsprototyps mit 17 Anforderungsabschnitten zu Produktidee, Zielsetzung, Technik, Visual und Discussion Feed, Kontext-Erklärung, Screens 6.1–6.12, deterministischer Simulation, Design, Accessibility, Agent-Rollen, Phasen, Prompt-Transparenz, Projektstruktur und 17 Akzeptanzkriterien. Zusatz: eigener Branch und `AGENTS.md` mit allen Prompts.

## P-002 – UX- und Nutzerflussanalyse

**Datum / Werkzeug:** 30.07.2026 · Claude Code · Claude Opus 5  
**Verfügbarkeit:** Aufgabenwortlaut in `AGENTS.md`, Teilverlauf im manuellen Export.

Verfügbare Anweisungen: tatsächlichen Code zuerst lesen; keine Quelldateien ändern; vier Aussageebenen und vorsichtige Sprachregeln berücksichtigen; frühere Ideen zur dauerhaften Emotionserfassung und Datenverwertung als bewusst verworfen dokumentieren; `product-brief.md`, `user-flows.md` und Given/When/Then-Akzeptanzkriterien erstellen. Der Subagent brach ab, die Aufgabe wurde im Hauptchat fertiggestellt.

## P-003 – Frontend-Architektur

**Datum / Werkzeug:** 30.07.2026 · Claude Code · Claude Opus 5  
**Verfügbarkeit:** Aufgabenwortlaut in `AGENTS.md`, Teilverlauf im manuellen Export.

Verfügbare Anweisungen: ausschließlich deutsche Architekturdokumentation erstellen; echte Versionen und Modulgrenzen, getrennte Analyse-/Schätz-/Selbstauskunftstypen, deterministische Mock-Engine, Einwilligungs-Gating, State Management, Routing, lokale Speicherung, Test-/Build-Setup, Erweiterungsrezepte und Vereinfachungen dokumentieren. Der Subagent brach ab, die Aufgabe wurde im Hauptchat fertiggestellt.

## P-004 – UX- und Designsystem

**Datum / Werkzeug:** 30.07.2026 · Claude Code · Claude Opus 5  
**Verfügbarkeit:** Aufgabenwortlaut in `AGENTS.md`, vollständiger manueller Export vorgesehen.

Verfügbare Anweisungen: das implementierte System dokumentieren, nichts erfinden und keinen Quellcode ändern; visuelle Trennung von Plattform und Assistenz, alle Tokens, Simulationsmarkierung, Typografie, Abstände, Komponenten, sieben Kartenvarianten, Accessibility und Dark Mode erfassen; zusätzlich Screen-Spezifikationen mit Zuständen, Wireframes und Komponentenplan erstellen; Inkonsistenzen melden, aber nicht selbst beheben.

## P-005 – Simulation und Mock-Daten

**Datum / Werkzeug:** 30.07.2026 · Claude Code · Claude Opus 5  
**Verfügbarkeit:** Arbeitsphase im P-001-Hauptchat; kein separater Prompt-Export.

Verfügbare Aufgabenbeschreibung: zentrale deterministische Mock-Engine, feste Analyse je Post, unterschiedliche Konfidenzen, absichtlicher Fehlfall, Nutzerkorrektur, Neuberechnung persönlicher Übersicht, Community-Daten mit Quellen, Demo-Reset und die vorgegebenen TypeScript-Verträge implementieren.

## P-006 – Accessibility- und Datenschutzreview

**Datum / Werkzeug:** 30.07.2026 · Claude Code · Claude Opus 5  
**Verfügbarkeit:** Aufgabenwortlaut in `AGENTS.md`, Teilverlauf im manuellen Export.

Verfügbare Anweisungen: als Reviewer statt Implementierer arbeiten; epistemisch ehrliche Texte, getrennte Datenarten, Einwilligung, Kamera/Netzwerk-APIs und UI-Behauptungen prüfen; WCAG 2.1 AA einschließlich echter Kontrastberechnungen, Tastatur, Fokus, ARIA, nicht-farbiger Kodierung, Diagramm-Alternativen und Reduced Motion bewerten; Datenschutz- und Accessibility-Review mit priorisierten Befunden verfassen. Der Subagent brach ab, der Hauptchat führte das Review zu Ende.

## P-007 – Qualitätssicherung

**Datum / Werkzeug:** 30.07.2026 · Claude Code · Claude Opus 5  
**Verfügbarkeit:** Aufgabenwortlaut in `AGENTS.md`, Teilverlauf im manuellen Export.

Verfügbare Anweisungen: Code und vorhandene Tests lesen, Build und Tests ausführen, aber Quell- und Testdateien nicht ändern; detaillierten Testplan für Feeds, Kartenvarianten, Unsicherheit, Korrektur, Datenquellen, Einstellungen, Löschen/Export, Research-Szenarien, Leer-/Fehlerzustände, Theme, Tastatur, 200-%-Zoom, 320 px und Desktop schreiben; Einschränkungen am Code belegbar dokumentieren.

## P-008 – Simuliertes Telefon und Plattform-Optik

**Datum / Werkzeug:** 31.07.2026 · Claude Code · Claude Opus 5  
**Originalwortlaut:**

> read the docs and then also we should copy the instagram desing as well its our selling point for the prof and also just a demo, though we should make the demo less demo and more like a real product so yeah maybe we should simulate a phone and an app on the phone that activates our plugin and we have a more mobile friendly design :d

Ergebnis: Telefonrahmen, Startbildschirm, zunächst getrennte Plattform- und ContextLens-App, mobiler Plattform-Skin. Die damalige bewusste Abweichung – Gattung statt offizieller Marke – wurde später durch P-011 teilweise revidiert: echte Plattformnamen, weiterhin keine Logos, Assets, APIs oder Konten.

## P-009 – Kamerabild, Reaktions-Emoji und Feed-Realismus

**Datum / Werkzeug:** 03.08.2026 · Claude Code · Claude Opus 5  
**Originalwortlaut:**

> so we should simulate insta more realistically so we should well keep the functions as a demo in tact and also our design should be done more like that you see what is recorded in a cam we should be able to use a real cam for that and also yeah the extra button we provide with our plugin is an emoji showing the most reactions of other users and well if you click on it you get the analyiss and percentage of reactions of our users :D

Ergebnis: lokales Kameraselbstbild ohne Auswertung, realistischere Foto-Feed-Konventionen und ein Community-Knopf auf Basis freiwilliger Selbstauskünfte. P-011 erweitert den Knopf um eine sichtbare Textbezeichnung und ehrliche Pluralitätsformulierung.

## P-010 – Gezeichnete Beispielinhalte und Farbwelt

**Datum / Werkzeug:** 03.08.2026 · Claude Code · Claude Opus 5  
**Originalwortlaut:**

> okay nice. Now we just need like real example meme videos or stuff and also do the desing like insta and also the color scheme as its just for uni ty

Ergebnis: eigene SVG-Szenen und Meme-Untertitel statt fremder Downloads, Weg für eigenes/freigegebenes Material, Foto-App-Farbwelt und lokale Follow-Funktion. Name und Logo blieben damals noch generisch; P-011 erlaubt nun den Namen Instagram, aber weiterhin keine offiziellen Logos oder Assets.

## P-011 – Drei-App-Smartphone: Instagram, Reddit und ETHOS

**Datum / Werkzeug:** 20.08.2026 · OpenAI Codex · GPT-5  
**Verfügbarkeit:** vollständiger Wortlaut dieser Sitzung unten; manueller Export: `exports/P-011-three-apps-ethos.md`.

### Ursprünglicher Nutzerauftrag im Wortlaut

> 1.Check the repository to understand what the project is about.  
> 2.While keeping the mocksetup, add to it that it mocks smarthphone where you have 3 apps you can click on. 1. "instagram" fake that what is already there. 2. a Reddit mock where you can scroll through some mock reddit posts on the homepage. 3. A ETHOS app where you can see Statistiks like what kind of posts you like the most, what emotion you have seeing what posts and so on use some cool visuall depictions for the statistics. It Should all still be just a mock implementation. Also on the mock instagram rightnow shows some stats under each post from "our app" can you add there what emotion the majiority of users show when they saw this post? So that People who arent good with emotions have support knowing what emotion most people feel.  
> 3.Also document all prompts under docs/prompt-documentation.  
> 4.Are there more implementations / updates / refinements you would do?

### Geklärte Produktentscheidungen

- Die sichtbare Marke wird vollständig von ContextLens zu **ETHOS** umbenannt. Historische interne IDs und `contextlens.v1.*`-Speicherschlüssel bleiben zur Datenkompatibilität bestehen.
- Der bisherige visuelle Feed wird zum inoffiziellen **Instagram-Mock**; der Discussion Feed wird eine separate, scrollbare **Reddit-Mock-App**.
- Echte Plattformnamen sind erlaubt, offizielle Logos, fremde Assets, Authentifizierung und APIs nicht.
- ETHOS liegt über Instagram **und** Reddit.
- Die Übersicht zeigt standardmäßig ein reiches **simuliertes Profil** und separat **Diese Sitzung**. Beide Quellen werden nie addiert oder vermischt.
- Der Community-Knopf nutzt freiwillige Selbstauskünfte. Bei weniger als 50 Prozent steht „am häufigsten“, nicht „Mehrheit“.
- Umgesetzt wird der risikoarme Feinschliff: Abhängigkeitspatches, Recharts 3, saubere Testausgabe und Router-Future-Flags. Router 7, Playwright, Error Boundary und viewportgenaues Tracking bleiben zurückgestellt.

### Zur Umsetzung freigegebener Plan im Wortlaut

> PLEASE IMPLEMENT THIS PLAN:
> # Three-App Smartphone Mock: Instagram, Reddit and ETHOS
>
> ## Summary
>
> Extend the existing phone prototype into three clearly separated, clickable apps:
>
> - **Instagram**: the current visual feed, retaining its mock content and ETHOS assistance layer.
> - **Reddit**: the existing discussion-post dataset moved into a dedicated scrollable Reddit-style app.
> - **ETHOS**: the rebranded ContextLens app, expanded into a visual analytics dashboard.
>
> Everything remains deterministic, local and simulated. Baseline is 121/121 passing tests and a successful production build.
>
> ## Implementation Changes
>
> ### Phone, branding and navigation
>
> - Rebrand all user-facing `ContextLens` text to **ETHOS** through central product/platform metadata; retain legacy internal identifiers and `localStorage` prefixes to avoid breaking stored demo data.
> - Show three unique app icons on the phone home screen: Instagram, Reddit and ETHOS. Use generic Lucide symbols rather than official logos.
> - Mark Instagram and Reddit prominently as unofficial mocks with invented accounts, content and statistics and no connection to either real platform.
> - Introduce canonical routes:
>   - `/instagram` and `/instagram/post/:postId`
>   - `/reddit` and `/reddit/post/:postId`
>   - `/ethos/overview`, `/ethos/settings`, `/ethos/privacy`, `/ethos/research`
> - Preserve existing URLs as redirects so old links and research scenarios remain recoverable.
> - Add an accessible Home control to every app shell that returns to `/phone`.
>
> ### Instagram and Reddit apps
>
> - Keep the current visual posts and Instagram-like layout, but remove the visual/discussion feed switch because Reddit becomes its own app.
> - Build a Reddit-specific shell and home feed around the four existing discussion posts, including communities, voting, comments, saved state, mock navigation and scrolling.
> - Put the ETHOS status strip, floating control, context explanation and community-reaction control over both social apps.
> - Change the community control from an emoji-only interpretation to explicit text such as `Am häufigsten: 🙄 genervt · 34 %`.
>   - Continue using simulated voluntary self-reports, not camera estimates.
>   - Say “am häufigsten” instead of “majority” when the leading value is below 50%.
>   - Preserve the full distribution, source explanation, sample-size warning and camera/self-report separation in the detail sheet.
>
> ### State and analytics contracts
>
> - Replace the ambiguous feed-mode association with `SocialPlatform = 'instagram' | 'reddit'` on posts and platform-aware filtering helpers.
> - Add persistent `PostEngagement` state for likes/upvotes and saved posts, with shared actions used by both apps.
> - Include engagements in local export, individual/all-data deletion and demo reset. Turning off history storage removes persisted engagements while keeping interactions functional in memory.
> - Add a deterministic simulated profile dataset and derive current-session analytics separately from engagements, history and self-reports. Never merge the two sources.
> - Upgrade the ETHOS overview with a source selector:
>   - **Simuliertes Profil** is the default and immediately shows rich mock data.
>   - **Diese Sitzung** updates from actual likes/upvotes and self-reported reactions and provides honest empty states.
> - Add three mobile-first, accessible visualizations:
>   - Donut chart for liked content categories.
>   - 100%-stacked horizontal “emotion landscape” showing self-reported reactions by post category.
>   - Directly labelled Instagram-versus-Reddit preference bars.
> - Pair every chart with readable values or a semantic list/table, stable labels and icons, non-colour encoding, dark-mode support and reduced-motion behavior. Automatic expression estimates remain separately identified and never presented as the user’s actual emotions.
>
> ### Low-risk refinements
>
> - Upgrade Recharts to the current 3.x line and add the matching React 18 `react-is` peer dependency.
> - Apply compatible dependency patches, including the Nano ID and React Router 6 patch resolutions; document any remaining Router advisory that requires the intentionally deferred v7 migration.
> - Make test output clean by mocking `scrollTo` and chart dimensions correctly, enabling the supported Router future flags, and moving the Research Mode cross-component notification out of render-time state updates.
> - Preserve the existing no-network, no-backend and no-real-emotion-recognition guarantees.
>
> ## Documentation and Prompt Transparency
>
> - Add P-011 to `docs/prompt-documentation/prompt-register.md` with the 20.08.2026 date, OpenAI Codex/GPT-5 attribution, requested work, clarification choices, implementation results and manual export filename.
> - Add a prompt catalog under `docs/prompt-documentation/` containing the available wording/summaries for P-001 through P-010 and the complete current prompt plus clarification decisions for P-011. Keep the existing note where an original historic prompt is only available through manual chat export.
> - Update `AGENTS.md` with P-011 and point it to the documentation directory as the canonical prompt record.
> - Bring the README, architecture, product brief, user flows, screen specification, decisions, progress, privacy/accessibility reviews, acceptance criteria, test plan and known limitations in line with the three-app architecture, ETHOS branding and new local engagement data.
>
> ## Test Plan and Acceptance Criteria
>
> - Verify the phone exposes three distinct working app destinations and decorative icons remain outside the keyboard path.
> - Verify each app opens the correct shell, can return Home and carries the correct unofficial-mock notice.
> - Verify Instagram behavior remains intact and Reddit renders all mock posts, comments, upvotes, details and ETHOS controls.
> - Verify likes/upvotes and saves survive app switches and reloads when storage is enabled, remain memory-only when disabled, and are covered by export/delete/reset.
> - Verify the majority-reaction control names the emotion visibly, uses self-reports, handles pluralities and small samples honestly, and obeys pause/community settings.
> - Verify the dashboard defaults to seeded mock data, never combines it with the session source, and updates session charts after Instagram likes, Reddit upvotes and self-reports.
> - Validate seeded totals, platform mappings and reaction distributions through data-integrity tests.
> - Test chart alternatives, keyboard use, screen-reader names, light/dark themes, reduced motion, 320px width and 200% zoom.
> - Finish with the complete unit/smoke suite, production build and dependency audit; require no high or critical unresolved vulnerabilities.
>
> ## Assumptions and Deferred Recommendations
>
> - UI and documentation remain German.
> - Real platform names are used, but official logos, copied assets, authentication and APIs are excluded.
> - Seeded analytics describe an explicitly fictional demo profile; session analytics describe only interactions made in the current browser.
> - Playwright browser tests, an application error boundary, viewport-accurate view tracking and React Router 7 migration are useful later refinements but are intentionally outside this low-risk implementation.

### Ergebnis

- Drei getrennte App-Shells/Ziele mit kanonischen Routen und historischen Redirects.
- Gemeinsamer persistenter Engagement-Vertrag für Likes/Upvotes und Speichern; Speicher-Aus verhält sich ehrlich memory-only.
- Sichtbarer Community-Text mit Selbstauskunftsquelle und Pluralitätsregel.
- Deterministisches Demo-Profil und getrennte Sitzungsableitung mit drei zugänglichen Visualisierungen.
- Recharts 3.10.1, React Router 6.30.6, React 18 `react-is`; keine hohen/kritischen Audit-Befunde, zwei dokumentierte moderate Router-v6-Befunde.
- Typprüfung, 127/127 Tests und Produktionsbuild erfolgreich.

## P-012 – Native Kommentare und Reddit-Medien

**Datum / Werkzeug:** 20.08.2026 · OpenAI Codex · GPT-5  
**Verfügbarkeit:** vollständiger Wortlaut dieser Sitzung unten; manueller Export: `exports/P-012-comments-reddit-media.md`.

### Nutzerauftrag im Wortlaut

> Ich bin etwas verwirrt: Wenn ich bei Instagram auf den Kommentar-Button bzw. auf „Kommentare ansehen“ klicke, bekomme ich nicht die bekannte Instagram-Kommentarsektion angezeigt. Stattdessen sehe ich „Beitrag von XXX“, „Assistenzschicht“, „Reaktionsverlauf“ und „Reaktionen der Community“.
>
> Sollte diese Ansicht nicht eigentlich nur erscheinen, wenn ich auf einen der Buttons in der Ethos-Box klicke? Bitte überprüfe und korrigiere dieses Verhalten. Beim Klick auf den normalen Kommentar-Button soll die übliche Instagram-Kommentarsektion geöffnet werden.
>
> Beim Reddit-Mock ist mir außerdem aufgefallen, dass beim Subreddit `c/` statt `r/` angezeigt wird. Bitte ändere das auf die Reddit-übliche Schreibweise `r/`.
>
> Außerdem möchte ich im Reddit-Mock nicht nur Text-Posts sehen, sondern auch mindestens einen Bild-/Meme-Post sowie einen Video-Post.
>
> Der Video-Post soll aus `r/marvel` stammen und den Titel **„Doctor Doom Wins in Avengers: Doomsday“** haben. Die Videodatei befindet sich unter:
>
> `public/media/doom.mp4`
>
> Der Marvel-Post soll beim Öffnen von Reddit als **zweiter Post** angezeigt werden. Das Video soll sich wie bei Reddit üblich verhalten: standardmäßig pausiert sein und zunächst den ersten Frame als Vorschau anzeigen. Der Nutzer soll das Video aber abspielen können, und beim Abspielen soll auch der Ton funktionieren.
>
> Als **dritten Post** möchte ich einen Bild-/Meme-Post aus `r/de`. Das dafür vorgesehene Bild habe ich angehängt und es befindet sich zusätzlich unter:
>
> `public/media/kerle.jpg`
>
> Die Reihenfolge soll also mindestens so aussehen:
>
> 1. bisheriger erster Reddit-Post
> 2. Video-Post aus `r/marvel` – „Doctor Doom Wins in Avengers: Doomsday“
> 3. Bild-/Meme-Post aus `r/de` mit `kerle.jpg`

### Umsetzung und Entscheidungen

- Normale Instagram-Kommentarwege und die ETHOS-Detailansicht wurden auf eigene Routen getrennt. Dasselbe Trennprinzip gilt für Reddit-Threads.
- Die bisherige kombinierte Ansicht bleibt erhalten, heißt sichtbar `ETHOS-Auswertung` und ist nur über den Assistenzstreifen erreichbar.
- Jeder Instagram-Post erhielt eine erfundene Kommentar-Auswahl; ein neues Eingabefeld ergänzt Kommentare nur im Speicher der geöffneten Ansicht.
- Alle Reddit-Community-Namen wurden von `c/` auf `r/` korrigiert.
- `d-doom-video` steht als zweiter Reddit-Post unter `r/marvel`; `d-kerle-meme` steht als dritter unter `r/de`.
- Reddit verwendet für diese Dateien native Medien: Video-Controls ohne Autoplay und ohne Stummschaltung; minimaler Seek für den ersten pausierten Frame; semantisches Bild mit Textalternative.
- Analyse- und Community-Mockdaten, Datenintegritätstests, Routen-/UI-Smoke-Tests sowie Projekt- und Prompt-Dokumentation wurden ergänzt.

### Ergebnis

- Native Plattform-Kommentare und ETHOS-Auswertung sind navigativ und visuell getrennt.
- Reddit enthält sechs Beiträge mit Text, Video und Bild/Meme in der geforderten Reihenfolge.
- Typprüfung, 132/132 Tests, Produktionsbuild und Browserprüfung erfolgreich.

## P-013 – Doom-Video und Handy-Vollbild

**Datum / Werkzeug:** 20.08.2026 · OpenAI Codex · GPT-5  
**Verfügbarkeit:** vollständiger Wortlaut dieser Sitzung unten; manueller Export: `exports/P-013-video-phone-fullscreen.md`.

**Bereitgestellte visuelle Referenzen:**
`codex-clipboard-6d056693-2a59-4e61-8af4-d36d519d4238.png` und
`codex-clipboard-c8abcd43-ce3f-4e10-b9e0-f840b3688801.png`.

### Nutzerauftrag im Wortlaut

> 1. entferne die schwarzen ränder neben dem video/ mach das video größer.
> 2. entferne den text "Ein lokal eingebundener Beispielclip für den inoffiziellen Reddit-Mock. Der Beitrag, das Konto und alle Zahlen sind erfunden."
> 3. gib eine möglichkeit das handy als fullscreen zu machen also das link der abschnitt Demo-aufbau ethos öäfut als erweiterung.... weg ist und das handy größer in der mitte ist.

### Umsetzung und Ergebnis

- Das Doom-Video verwendet sein echtes 4:3-Seitenverhältnis statt eines 16:9-Rahmens. Es füllt damit die gesamte Kartenbreite ohne seitlichen Spalt.
- Der genannte Demo-Erklärtext wurde aus den Postdaten entfernt; leere Post-Bodies erzeugen kein leeres Markup.
- `DeviceLayout` erhielt den Desktop-Schalter `Handy-Vollbild`. Er blendet die linke `DeviceCaption` aus und vergrößert/zentriert den Telefonrahmen; `Vollbild beenden` stellt die Ausgangsansicht wieder her.
- Der Präsentationsmodus nutzt keine Browser-Fullscreen-Berechtigung. `aria-pressed`, eindeutige Schalternamen und ein dauerhaft erreichbarer Rückweg bleiben erhalten.
- Browserprüfung: Video und Kartenbreite jeweils 351 px, 0 px Seitenspalt, pausierter erster Frame; fokussiertes Telefon 456 px breit und horizontal mittig; keine Konsolenfehler.
- Typprüfung, 133/133 Tests und Produktionsbuild erfolgreich.

## Manuelle Exportpflicht

Der Chat-Export kann nicht durch den Prototyp erzeugt werden. Vor Abgabe sind die in `prompt-register.md` und `export-checklist.md` genannten Dateien manuell aus den jeweiligen Oberflächen zu exportieren. Besonders P-001 ist nötig, weil dessen historischer Master-Prompt nicht vollständig im Repository dupliziert wurde.
