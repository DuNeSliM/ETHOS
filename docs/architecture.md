# Architektur

## 1. Überblick

| Baustein | Version | Zweck |
|---|---|---|
| React | 18.3 | UI |
| TypeScript | 5.7 (`strict`) | Typsicherheit |
| Vite | 6.4 | Dev-Server und Build |
| Tailwind CSS | 4.x (`@tailwindcss/vite`) | Styling über Design-Tokens |
| React Router | 6.28 | Routing |
| Recharts | 2.15 | Community-Diagramm |
| Lucide React | 0.469 | Icons |
| Vitest 3 + Testing Library | — | Tests (jsdom) |

**Harte Randbedingungen:** kein Backend, keine Datenbank, keine
Authentifizierung, keine echten Social-Media-APIs, keine echte
Emotionserkennung, keine Cloud-Abhängigkeit. Alle Daten sind lokal und
simuliert.

## 2. Verzeichnisstruktur

```
src/
  app/            ContextLens-App-Chrome, Routing, globaler Zustand
  components/     Geteilte, domänenfreie UI-Bausteine
  data/           Handgeschriebene Beispieldaten (Posts, Analysen, Community, Verläufe)
  features/
    analytics/    Community-Diagramm, Reaktionsverlauf, Vergleichslogik
    context-assistant/  Assistenzbutton, Assistenzkarte, Variantenzuordnung
    device/       Simuliertes Telefon: Rahmen, Bühne, OS-Statusleiste
    feed/         Beitragskarten, Medienplatzhalter, Feed-Umschalter
    plugin/       Präsenz der Assistenz über der fremden App
    reactions/    Eigene Reaktion, Kamera-Vorschau
    research-mode/ Szenarien, Sitzungszustand, Banner
    simulation/   Mock-Engine
    social-app/   Chrome und Identität der simulierten Plattform
  hooks/          Wiederverwendbare Hooks
  lib/            Reine Hilfsfunktionen (Speicher, Labels, Viewport)
  pages/          Screens; komponieren Features, enthalten wenig eigene Logik
  styles/         Design-Tokens und Basis-Styles
  test/           Testaufbau und Hilfsfunktionen
  types/          Gemeinsamer Typvertrag
```

**Modulgrenzen.**

- `app/` besitzt den Zustand und die Shell. Nur hier wird geschrieben.
- `features/*` kapseln je eine Domäne und dürfen `components/`, `lib/`,
  `data/` und `types/` nutzen — aber nicht querbeet einander.
- `components/` kennt keine Domänenbegriffe und keinen Zustand.
- `data/` enthält ausschließlich Daten, keine Logik.
- `lib/` ist frei von React.
- `pages/` setzt zusammen; Logik gehört in `features/`.
- `types/` ist der gemeinsame Vertrag und importiert nichts.

## 3. Datenmodell

Definiert in `src/types/index.ts`.

**Namenskonvention — der wichtigste Teil der Architektur:**

| Präfix/Suffix | Bedeutung | Beispiel |
|---|---|---|
| `...Analysis` | Aussage über den **Inhalt** | `ContentAnalysis` |
| `estimated...` | maschinelle **Vermutung** über die betrachtende Person | `estimatedExpression` |
| `selfReported...` | **Angabe der Person selbst** | `selfReportedReaction` |

Diese drei dürfen nie zu einem Feld verschmelzen. Sie sind epistemisch
verschieden: eine Textbeobachtung, eine Sensorvermutung und eine Selbstaussage.
Sobald sie in einem Feld liegen, kann die UI die Unterscheidung nicht mehr
darstellen — und genau diese Unterscheidung ist das Produkt.

**Kerntypen**

- `ContentAnalysis` — `probableTone`, `confidence`, `explanation`, `indicators`,
  `polarizationLevel`, `possibleRagebait`, `limitations` (Pflicht),
  `alternativeReadings` (Pflicht), optional `emotionalLanguage`,
  `visibleFacialExpression`, `toneOfVoice`, `possibleIntent`.
- `ViewerReaction` — `estimatedExpression` + `confidence` **und** optional
  `selfReportedReaction` + `selfReportedNote`. Beides im selben Datensatz, aber
  in getrennten Feldern.
- `CommunityReactionSummary` — zwei Verteilungen
  (`estimatedReactions`, `selfReportedReactions`), zwei Teilnehmerzahlen,
  `representativeWarning` und `sourceExplanation`.
- `ReactionTimelineSegment` — `expression` (Ausdruck) **und** `label`
  (Alltagswort). Deshalb kann die UI „amüsiert" anzeigen, während die
  hinterlegte Behauptung „sichtbares Lächeln" bleibt.
- `Settings` — alle Einwilligungsschalter plus Darstellung.
- `HistoryEntry`, `ResearchResult`, `AssistantFeedback`, `Post`, `Comment`,
  `SimulatedMedia`.

## 4. Simulation Engine

`src/features/simulation/mockEngine.ts` ist die **einzige** Stelle, die
Analyseergebnisse liefert. Alles ist deterministisch und rein.

**Einwilligungs-Gating.** Die Resolver geben nicht einfach `null` zurück,
sondern einen benannten Grund:

```ts
resolveAnalysis(postId, settings)
// { status: 'available', analysis, variant }
// { status: 'disabled', reason: 'paused' | 'analysis-off' | 'sarcasm-off' | 'ragebait-off' }
// { status: 'none' }
```

Dadurch kann die UI sagen, *welcher* Schalter den Hinweis zurückhält, statt nur
nichts anzuzeigen — eine der Forschungsfragen lautet, ob Nutzende zu den
Schaltern zurückfinden.

`estimateViewerExpression()` liefert `null`, solange
`simulatedCameraCapture === false` oder der Assistent pausiert ist. Es gibt
keinen Codepfad, der ohne diesen Schalter eine Schätzung erzeugt (durch Test
abgesichert). Analog `resolveTimeline()` und `resolveCommunity()`.

**Variantenableitung.** `deriveCardVariant()` bestimmt die Darstellung aus den
Daten, in fester Rangfolge:

1. keine Indikatoren → `insufficient-context`
2. `possibleRagebait` → `ragebait`
3. `sarcastic` → `sarcasm`, `ironic` → `irony`
4. `frustrated` / `aggressive` → `emotional`
5. `humorous` → `exaggeration`
6. sonst → `ambiguous`

Weil die Variante berechnet und nicht gespeichert wird, kann eine Überschrift
nie den Daten widersprechen, die sie zusammenfasst.

**Beabsichtigter Fehlfall.** `SIMULATED_EXPRESSION['v-ragebait']` ist `smile`,
obwohl der Beitrag die meisten Menschen ärgert. Research-Mode-Szenario 3 baut
darauf auf.

## 5. State Management

Ein einziger React-Context (`src/app/AppStateProvider.tsx`). Bewusst keine
State-Bibliothek: Der Datenumfang ist klein, und wenn genau **eine** Datei alle
Schreibvorgänge besitzt, lässt sich die Datenschutzaussage prüfen.

Besonderheiten:

- **Persistenz per Effekt.** Wird `storeReactionHistory` abgeschaltet, werden die
  vorhandenen Schlüssel **entfernt**, nicht nur weitere Schreibvorgänge
  unterlassen.
- **Schalterkopplung.** `simulatedCameraCapture = false` schaltet
  `liveCameraPreview` und `shareAnonymousReaction` mit ab.
- **`recordEstimate` überschreibt nie.** Existiert bereits ein Datensatz, bleibt
  er unverändert — sonst würde ein Re-Render eine Korrektur der Testperson
  stillschweigend zurücksetzen.
- **`recordSelfReport` behält die Schätzung** im selben Datensatz.
- **Standardwerte sind der Fallback.** Gespeicherte Einstellungen werden über
  `DEFAULT_SETTINGS` gespreizt, damit ein fehlender Schlüssel aus einem älteren
  Build nicht `undefined` wird.
- **Theme** wird als `data-theme` auf `<html>` gesetzt bzw. entfernt.

## 6. Routing

`src/app/App.tsx`, drei ineinanderliegende Ebenen:

```
/                    Landing                 ─┐ Projektseite,
/how-it-works        So funktioniert es      ─┘ volle Breite
<DeviceLayout>                                 simuliertes Telefon
  /onboarding        Einrichtung + Einwilligung
  /phone             Startbildschirm
  <SocialAppShell>   simulierte Plattform
    /feed/visual  /feed/discussion  /post/:postId
  <AppShell>         ContextLens-App
    /overview  /settings  /privacy  /research
*                    Wiederherstellungsseite
```

Die Verschachtelung ist inhaltlich, nicht kosmetisch: `SocialAppShell` und
`AppShell` sind zwei Apps auf demselben Gerät, und keine enthält die andere.
Beide zeigen den Zustand der Assistenzschicht permanent an — in der
ContextLens-App über `StatusBar`, über der Plattform über `PluginStatusStrip`,
mit identischem Wortlaut.

`/feed` leitet auf `/feed/visual` um, `*` auf eine Wiederherstellungsseite. Beim
Routenwechsel scrollt die jeweilige Shell über `scrollAppToTop()`
(`src/lib/viewport.ts`) an den Anfang: Innerhalb des Geräterahmens ist der
Telefonbildschirm (`#app-viewport`) die Scrollfläche, außerhalb das Fenster.

## 7. Lokale Speicherung

`src/lib/storage.ts`. Schlüssel sind namespaced und versioniert
(`contextlens.v1.*`), damit ein Schemawechsel keine inkompatiblen Altdaten
wiederbelebt.

Defensiv: Lesefehler und kaputtes JSON gelten als „keine Daten"; Schreibfehler
(Quota, privater Modus) werden geschluckt — die App läuft dann im Speicher
weiter. Eine laufende Testsitzung darf daran nicht scheitern.

`snapshotAll()` liefert den Export, `clearAll()` löscht ausschließlich die
eigenen Schlüssel. `downloadFile()` erzeugt einen Blob und eine Object-URL —
kein Netzwerk.

Der Research-Mode-Sitzungszustand liegt in einem eigenen Schlüssel, weil die
Testperson die Seite verlässt und in der App unterwegs ist. Mehrere gemountete
Instanzen des Hooks (Banner und Seite) werden über ein `CustomEvent`
synchronisiert, tabübergreifend über das `storage`-Event.

## 8. Build und Tests

`vite.config.ts`: Alias `@ → src`, React- und Tailwind-Plugin,
`manualChunks` trennt `recharts` und den React-Kern vom Anwendungscode
(Feed-Einstieg lädt das Diagramm-Bundle nicht mit).

`src/test/setup.ts` ergänzt in jsdom fehlende Browser-APIs: `matchMedia`,
`offsetWidth`/`offsetHeight` (Recharts misst sonst 0×0 und rendert nichts) und
`ResizeObserver`. Nach jedem Test wird aufgeräumt und `localStorage` geleert.

Testabdeckung: 121 Tests in sieben Dateien, siehe `docs/test-plan.md`.

## 9. Erweiterungspunkte

**Neuen Beitrag hinzufügen**
1. Objekt in `src/data/posts.ts` ergänzen (eindeutige `id`, `mode`, `researchNote`).
2. Analyse in `src/data/analyses.ts` unter derselben `id` ergänzen —
   `limitations` und `alternativeReadings` sind Pflicht.
3. Community-Datensatz in `src/data/community.ts` ergänzen, beide Verteilungen
   müssen 100 ergeben.
4. Optional: Verlauf in `src/data/timelines.ts` (lückenlos bis zur Laufzeit) und
   Schätzwert in `SIMULATED_EXPRESSION`.
5. `npm test` — die Datenintegritätstests prüfen alle vier Punkte.

**Neue Kartenvariante**
1. In `AssistantCardVariant` (`src/types/index.ts`) ergänzen.
2. Titel und Untertitel in `src/lib/labels.ts`.
3. Icon und Farbfamilie in `variantPresentation.ts`.
4. Ableitungsregel in `deriveCardVariant()` einsortieren — die Rangfolge ist
   testrelevant.

**Neuen Einwilligungsschalter**
1. Feld in `Settings` ergänzen, Standardwert in `DEFAULT_SETTINGS` — bei allem,
   was die Person selbst betrifft, `false`.
2. `<Toggle>` in `SettingsPage` und ggf. im Onboarding-Einwilligungsschritt.
3. Gating im passenden Resolver der Mock-Engine.
4. Zeile im Datenschutz-Dashboard, damit der Zustand sichtbar bleibt.

## 10. Bewusste Vereinfachungen

- Kein Code-Splitting je Route (nur Vendor-Chunks).
- Ein einziger Context — breite Re-Renders, bei dieser Größe irrelevant.
- Keine i18n-Schicht; Deutsch ist fest verdrahtet (siehe E-011).
- Kein E2E-Test (Playwright war optionales Stretch Goal).
- Recharts für wenige Diagramme; das ist das größte Bundle.
- Der Video-Player ist ein Timer, kein `<video>`-Element.
- Kein Error Boundary — ein Absturz zeigt eine leere Seite.
