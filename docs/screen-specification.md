# ContextLens – Screen-Spezifikation

Dieses Dokument beschreibt jeden Bildschirm des Prototyps **so, wie er implementiert
ist**. Die Abschnitte folgen exakt der Routentabelle in `src/app/App.tsx`.

Begleitdokument: `docs/design-system.md` (Tokens, Komponenten, Varianten).

---

## 0. Routentabelle und globales Layoutgerüst

| Route | Seite | Datei | Innerhalb `AppShell`? |
| --- | --- | --- | --- |
| `/` | Landing | `src/pages/LandingPage.tsx` | nein |
| `/how-it-works` | So funktioniert es | `src/pages/HowItWorksPage.tsx` | nein |
| `/onboarding` | Onboarding + Einwilligung | `src/pages/OnboardingPage.tsx` | nein |
| `/feed` | – | Redirect (`<Navigate to="/feed/visual" replace />`) | ja |
| `/feed/visual` | Visual Feed | `src/pages/VisualFeedPage.tsx` | ja |
| `/feed/discussion` | Discussion Feed | `src/pages/DiscussionFeedPage.tsx` | ja |
| `/post/:postId` | Beitragsdetail | `src/pages/PostDetailPage.tsx` | ja |
| `/overview` | Persönliche Übersicht | `src/pages/OverviewPage.tsx` | ja |
| `/settings` | Einwilligung und Einstellungen | `src/pages/SettingsPage.tsx` | ja |
| `/privacy` | Datenschutz-Dashboard | `src/pages/PrivacyPage.tsx` | ja |
| `/research` | Research Mode | `src/pages/ResearchModePage.tsx` | ja |
| `*` | 404 | `src/pages/NotFoundPage.tsx` | nein |

Landing und Onboarding liegen bewusst **außerhalb** der Shell, damit sie die volle
Breite nutzen können. Alles, wozwischen eine Testperson während einer Sitzung
navigiert, liegt **innerhalb** der Shell und zeigt daher immer die Statusleiste
(was ist aktiv, was ist simuliert, wo liegen Daten).

### Das Shell-Gerüst

```
┌──────────────────────────────────────────────────────────────┐
│ [Skip-Link: „Direkt zum Inhalt springen" – nur bei Fokus]     │
├──────────────────────────────────────────────────────────────┤ ← sticky, z-30
│ ◎ ContextLens          [Feed][Übersicht][Datenschutz]   [🌙]  │   max-w-6xl
│   Prototyp · sim.        [Einstellungen][Research]            │   md: Nav sichtbar
├──────────────────────────────────────────────────────────────┤
│ StatusBar: (Inhaltsanalyse aktiv)(Kamera aus)(nur lokal)  →   │   bg-surface-2
├──────────────────────────────────────────────────────────────┤
│ ResearchBanner (nur bei laufendem Szenario, sim-violett)      │
└──────────────────────────────────────────────────────────────┘
  <main id="main"> max-w-6xl px-4 pt-4 pb-28 md:pb-12
  … Seiteninhalt, meist nochmals mx-auto max-w-2xl …

┌──────────────────────────────────────────────────────────────┐ ← fixed bottom,
│  [▤ Feed] [☰ Übersicht] [🛡 Datenschutz] [⚙ Einst.] [◉ Res.]  │   md:hidden, z-30
└──────────────────────────────────────────────────────────────┘
```

| Breakpoint | Verhalten |
| --- | --- |
| `< 768 px` (mobil) | Top-Nav ausgeblendet (`hidden md:block`), Bottom-Nav sichtbar; `<main>` hat `pb-28` als Reserve für die Leiste; Theme-Button wird durch `ml-auto` rechts geparkt |
| `≥ 768 px` (`md`) | Top-Nav sichtbar, Bottom-Nav `md:hidden`; `<main>` nur `pb-12`; Theme-Button rückt per `md:ml-0` neben die Nav |
| `≥ 640 px` (`sm`) | betrifft vor allem Rasterspalten (`sm:grid-cols-2`, `sm:grid-cols-3`) und das `Sheet` (Bottom-Sheet → zentrierter Dialog) |

Bei jedem Routenwechsel scrollt die Shell an den Seitenanfang.

---

## 1. Landing — `/`

**Zweck:** In wenigen Sekunden erklären, was das Produkt ist – und ebenso deutlich,
was es *nicht* ist (kein Gedankenleser, kein fertiges Produkt, keine echte Plattform).

| Aspekt | Beschreibung |
| --- | --- |
| Layout Desktop | Eigener Header (`max-w-5xl`, Logo ohne Link + Textlink „So funktioniert es"), `<main class="mx-auto max-w-5xl px-4 py-10 sm:py-16">`; Vorteilsraster zweispaltig (`sm:grid-cols-2`) |
| Layout Mobil | Identische Einspaltenstruktur, Raster kollabiert auf eine Spalte, `py-10` statt `py-16` |
| Kein Shell-Chrome | keine StatusBar, keine Navigation – die Demo hat noch nicht begonnen |

**Inhalt in Reihenfolge**

1. Markierungsreihe: `SimulatedBadge label="Forschungsprototyp – alle Analysen sind
   simuliert"`, `Chip` „Keine echte KI", `Chip` „Keine Verbindung zu sozialen
   Netzwerken".
2. H1 „Eine freiwillige Assistenzschicht, die soziale Signale in Beiträgen erklärt"
   (`text-3xl sm:text-4xl`).
3. Einleitungsabsatz (`text-lg text-muted`).
4. `Panel variant="assist"` „Für wen ist das gedacht?" – nennt die Zielgruppe und
   den Satz „ContextLens nimmt niemandem die Deutung ab."
5. Aktionen: `Button variant="assist" size="lg"` „Demo starten" und ein
   `Button variant="secondary" size="lg"` „So funktioniert es".
6. Freiwilligkeitshinweis in `text-faint`.
7. H2 „Was die Assistenz leistet" + vier `Panel`-Karten mit Icon-Kachel
   (`bg-assist-tint text-assist-strong`).
8. `Panel variant="muted"` „Was dieser Prototyp ausdrücklich nicht ist" mit vier
   Negativpunkten.

**Zustände**

| Zustand | Verhalten |
| --- | --- |
| Erstbesuch (`onboardingDone === false`) | „Demo starten" navigiert nach `/onboarding` |
| Wiederkehr (`onboardingDone === true`) | „Demo starten" navigiert direkt nach `/feed/visual` – die Einleitung wird übersprungen, **die Einwilligungsseite aber nie erzwungen umgangen**, weil die Einstellungen bereits gespeichert sind |

**Barrierefreiheit:** Semantische Überschriftenhierarchie (ein `h1`, dann `h2`,
dann `h3` in den Karten); Icon-Kacheln sind `aria-hidden`; die Negativliste benutzt
ein `aria-hidden`-Gedankenstrich-Präfix statt eines bedeutungstragenden Zeichens.

---

## 2. So funktioniert es — `/how-it-works`

**Zweck:** Statischer Erklärer, erreichbar von der Landing-Seite. Erklärt die vier
Ebenen, deren Trennung den Kern der Idee bildet.

| Aspekt | Beschreibung |
| --- | --- |
| Layout Desktop | Header `max-w-3xl` mit `Logo` (Link) und `Button variant="ghost"` „Zurück"; `<main class="mx-auto max-w-3xl px-4 py-10">` |
| Layout Mobil | Identische Einspaltenstruktur; die Kopfzeile bleibt zweispaltig (Logo links, Zurück rechts) |

**Inhalt**

| Block | Inhalt |
| --- | --- |
| Markierung | `SimulatedBadge label="Prototyp – alle Ergebnisse sind vorab geschrieben"` |
| H1 + Lead | „So funktioniert es" + die Kernaussage: „Eine Aussage über einen Beitrag ist etwas völlig anderes als eine Aussage über einen Menschen." |
| `<ol>` mit 4 `Panel` | 1. Analyse des Inhalts · 2. Geschätzte Reaktion von dir · 3. Deine eigene Angabe · 4. Reaktionen der Community. Jede Karte hat eine Merksatz-Zeile mit `border-l-2 border-assist pl-3 text-assist-strong` |
| `Panel variant="muted"` | „Grenzen der Analyse" |
| Abschluss | `Button variant="assist" size="lg"` „Demo starten" → `/onboarding` |

**Zustände:** rein statisch, keine.

**Barrierefreiheit:** Die vier Ebenen liegen in einer geordneten Liste, also wird die
Reihenfolge auch akustisch vermittelt; Merksätze sind echter Text, nicht nur
farbliche Hervorhebung.

---

## 3. Onboarding und Einwilligung — `/onboarding`

**Zweck:** Vier Erklärschritte, danach ein ausdrücklicher Einwilligungsschritt. Der
Einwilligungsschritt ist der **letzte**; man kann nicht per „Weiter" an ihm
vorbeiklicken.

| Aspekt | Beschreibung |
| --- | --- |
| Layout | Header `max-w-2xl` (Logo ohne Link + Textlink „Überspringen"); `<main class="mx-auto max-w-2xl px-4 py-8">`. Ein Layout für alle Breiten. |
| Fortschritt | Textzeile „Schritt n von 5" **zuerst**, darunter ein Balken (`role="img"`, `aria-label="Fortschritt: Schritt n von 5"`) aus 5 Segmenten (`bg-assist` erledigt / `bg-surface-3` offen) |

**Schritte 1–4 (`STEPS`)**

| # | Icon | Titel |
| --- | --- | --- |
| 1 | `Eye` | Emotionale und soziale Signale verständlicher machen |
| 2 | `MessageSquareQuote` | Sarkasmus und mögliche Absichten erklären |
| 3 | `Users` | Freiwillige Community-Reaktionen darstellen |
| 4 | `ShieldCheck` | Datenschutz und Kontrolle |

Jeder Schritt: Icon-Kachel `size-12 bg-assist-tint`, H1, Fließtext, Punkteliste mit
`Check`-Icons in `text-assist`. Schritt 3 zeigt zusätzlich
`SimulatedBadge label="Community-Werte sind erfunden"` und `Chip` „Getrennte Anzeige
der Quellen".

**Schritt 5 – Einwilligung**

| Schalter | Default | Besonderheit |
| --- | --- | --- |
| Inhalts- und Kontextanalyse | an | – |
| Sarkasmus- und Ironiehinweise | an | – |
| Hinweise auf Polarisierung und Ragebait | an | – |
| Aggregierte Community-Reaktionen anzeigen | an | – |
| Simulierte eigene Reaktionserfassung | **aus** | steht in einem eigenen `Panel variant="muted"` mit `CameraOff`-Icon und Überschrift „Eigene Reaktionserfassung (standardmäßig aus)"; `activeNote` beim Einschalten |
| Eigene Reaktion anonym weitergeben | **aus** | `disabled`, solange die Erfassung aus ist; `disabledReason` „Erst möglich, wenn die eigene Reaktionserfassung aktiv ist." |

**Zustände**

| Zustand | Verhalten |
| --- | --- |
| Schritt 1 | „Zurück" ist `disabled` |
| Schritte 1–4 | Primäraktion „Weiter" |
| Schritt 5 | Primäraktion „Einstellungen übernehmen und starten" → setzt `onboardingDone` und navigiert nach `/feed/visual` |
| „Überspringen" | setzt ebenfalls `onboardingDone` und geht direkt in den Feed – die Defaults (Kamera aus, Teilen aus) bleiben damit erhalten |

**Barrierefreiheit:** Jeder Schritt liegt in einer `<section aria-labelledby>`; der
Fortschritt ist als Text **und** als `role="img"` verfügbar; alle Schalter sind echte
Checkboxen mit `role="switch"` (siehe `Toggle`).

---

## 4. Visual Feed — `/feed/visual`

**Zweck:** Kurzvideos und Bilder mit Bildunterschrift – der Fall, in dem Mimik und
Tonfall mitspielen. Datenquelle: `getPostsForMode('visual')`, derzeit **5** Beiträge
(`v-humor`, `v-sarcasm`, `v-emotional`, `v-ragebait`, `v-lowcontext`).

| Aspekt | Beschreibung |
| --- | --- |
| Layout Desktop | Innerhalb der Shell nochmals `mx-auto max-w-2xl` – eine zentrierte Lesespalte, kein Mehrspaltenlayout. Der `max-w-6xl`-Rahmen der Shell wirkt nur auf Header und StatusBar. |
| Layout Mobil | Dieselbe Spalte, ab 320 px nutzbar; kein separates Mobil-Design. Der `FeedModeSwitch` bleibt zweispaltig (`flex-1`). |

```
┌─── max-w-[30rem] ─────────────────────────────────┐
│ ┌─────────────────┐ ┌─────────────────┐           │  FeedModeSwitch
│ │ ▣ Visual Feed   │ │ ▤ Discussion    │           │  aktiver Tab:
│ │   aktiv         │ │   Feed          │           │  border-assist
│ │ Kurzvideos …    │ │ Textbeiträge …  │           │  bg-assist-tint
│ └─────────────────┘ └─────────────────┘           │
│                                                    │
│ Visual Feed  (🧪 Erfundene Beiträge)               │  H1 + SimulatedBadge
│ Diese Beiträge, Konten und Zahlen sind erfunden. … │
│                                                    │
│ ⊕   ◉    ◉    ◉    ◉    ◉                          │  StoriesRow
│ Dein jonas mira elif noa  klartext                 │  aria-hidden, Kulisse
│                                                    │
│ ┌────────────────────────────────────────────────┐ │  <article>
│ │ ◉ jonasunterwegs                           ⋯   │ │  Verlaufsring + Handle
│ │   Jonas Reiter                                 │ │
│ ├────────────────────────────────────────────────┤ │
│ │ ///////// randlos, Seitenverhältnis 4:5 //////│ │  MediaPlaceholder
│ │ [▶ 00:18]                 SIMULIERTER PLATZH.  │ │  variant="feed"
│ │                                                │ │
│ │           Beschreibung, was der Clip           │ │  sichtbarer altText
│ │              zeigen würde …                    │ │  mittig, text-shadow
│ │                                                │ │
│ │ (◔ Geschätzt: sichtbares Lächeln ✎)            │ │  OwnReactionControl
│ ├────────────────────────────────────────────────┤ │  (nur wenn Kamera an)
│ │ [▶ Abspielen] [====|=======] 00:04 / 00:18     │ │  Leiste auf bg-black/85
│ ├────────────────────────────────────────────────┤ │
│ │ ♡ 3.410   💬 87   ➤                        🔖  │ │  Aktionszeile
│ │ jonasunterwegs Absolut perfekter Start in …    │ │  Handle + Caption
│ │ … mehr anzeigen                                │ │  ab 120 Zeichen
│ │ Alle 87 Kommentare ansehen                     │ │
│ │ VOR 5 STD.                                     │ │
│ ├────────────────────────────────────────────────┤ │  ← Assistenzstreifen
│ │ [✨ Kontext erklären]  [⏱ Reaktionsverlauf]    │ │  border-t assist-line
│ └────────────────────────────────────────────────┘ │  bg-assist-tint/50
│                       ⋮ (weitere Beiträge)         │
│      Ende des simulierten Feeds. 5 Beispiele.      │
└────────────────────────────────────────────────────┘
```

Auf Telefonen laufen Karten und Stories randlos bis an den Bildschirmrand
(`-mx-4 sm:mx-0` auf dem Container, `border-y` plus `sm:rounded-… sm:border-x`
auf der Karte). Ab `sm` sind es abgerundete, gerahmte Karten.

**Verwendete Komponenten:** `FeedModeSwitch`, `SimulatedBadge`, `StoriesRow`,
`VisualPostCard` → (`MediaPlaceholder`, `OwnReactionControl`,
`ContextAssistantButton` → `Sheet` → `AssistantCardBody`).

**Zustände**

| Zustand | Bedingung | Darstellung |
| --- | --- | --- |
| Standard | Analyse an, Kamera aus | Assistenzstreifen mit „Kontext erklären" + Detail-Link; **kein** Reaktions-Chip |
| Kamera an | `simulatedCameraCapture` | zusätzlich der Reaktions-Chip: als Overlay auf dem Medium, bei Beiträgen ohne Medium inline im Streifen |
| Kein Analyse-Eintrag | `resolveAnalysis` → `none` | Der „Kontext erklären"-Button verschwindet ersatzlos (keine tote Affordanz) |
| Analyse durch Einstellung gesperrt | `disabled` | Der Button bleibt sichtbar; das Sheet erklärt **welcher** Schalter greift, mit Direktlink zu `/settings` |
| Pausiert | `assistantPaused` | Sheet zeigt „Der Assistent ist pausiert"; Reaktions-Chips verschwinden; StatusBar zeigt „Assistent pausiert" |
| Link-Beschriftung | Timeline vorhanden (`v-humor`, `v-emotional`, `v-ragebait`) | „Reaktionsverlauf ansehen" (`Timer`), sonst „Reaktionen ansehen" (`BarChart3`) |
| Leerzustand | tritt nicht auf – die Beiträge sind fest hinterlegt | Fußzeile nennt stets die Anzahl |

**Barrierefreiheit:** Beiträge liegen als `<li><article>` in einer `<ul>`;
Engagement-Zahlen bekommen `sr-only`-Bedeutungen; die Avatare sind `aria-hidden`
(Initialen, kein erfundenes Konterfei); der Modus-Umschalter ist eine benannte
Landmark.

---

## 5. Discussion Feed — `/feed/discussion`

**Zweck:** Textbeiträge und Threads – der Fall, in dem Ironie am schwersten zu lesen
ist, weil Tonfall und Mimik fehlen. Datenquelle: `getPostsForMode('discussion')`,
derzeit **4** Beiträge (`d-sarcasm`, `d-irony`, `d-aggressive-headline`,
`d-polarising`).

| Aspekt | Beschreibung |
| --- | --- |
| Layout | Identisch zum Visual Feed: `mx-auto max-w-2xl`, `FeedModeSwitch` oben, `space-y-5`-Liste. |
| Unterschied zur Karte | Kein Medium, dafür Community-Zeile, Headline und Kommentarbaum |

```
┌─── max-w-2xl ─────────────────────────────────────┐
│ [ ▣ Visual Feed ] [ ▤ Discussion Feed   aktiv ]   │
│ Discussion Feed  (🧪 Erfundene Beiträge)           │
│ Hier fehlen Tonfall und Mimik – Ironie ist …      │
│ ┌────────────────────────────────────────────────┐ │
│ │ r/community · @handle · vor 5 Std.             │ │
│ │ Fette Headline des Beitrags                    │ │
│ │ Beitragstext …                                 │ │
│ │ ⬆ 412   💬 57                                  │ │
│ ├────────────────────────────────────────────────┤ │  border-y assist-line
│ │ [✨ Kontext erklären] [▤ Reaktionen] (◔ Chip)  │ │  bg-assist-tint/50
│ ├────────────────────────────────────────────────┤ │
│ │ nutzerin_x                                     │ │  divide-y divide-line
│ │ Kommentartext …                                │ │
│ │ ⬆ 31   [✨ Kontext erklären]  ← nur bei        │ │  inline-Variante
│ ├────────────────────────────────────────────────┤ │     hasAnalysis
│ │ … zweiter Kommentar …                          │ │
│ ├────────────────────────────────────────────────┤ │
│ │ 1 weiterer Kommentar anzeigen  →  /post/:id    │ │
│ └────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────┘
```

**Zustände**

| Zustand | Darstellung |
| --- | --- |
| Feedansicht | maximal 2 Kommentare, darunter „n weitere(r) Kommentar(e) anzeigen" mit korrekter Beugung |
| Detailansicht | `showAllComments` – alle Kommentare, kein Mehr-Link |
| Kommentar mit eigener Analyse | zusätzlicher `ContextAssistantButton size="inline"` auf die Kommentar-ID |
| Ohne Kommentare | Kommentarsektion entfällt vollständig |
| Analyse gesperrt / pausiert | wie im Visual Feed |

**Barrierefreiheit:** Kommentarblock als `<section aria-label="Kommentare">`;
Zustimmungszahl mit `sr-only` „Zustimmungen"; Headline ist ein `<h2>` innerhalb des
`<article>`.

---

## 6. Beitragsdetail — `/post/:postId`

**Zweck:** Die einzige Seite, auf der alle vier Ebenen des Konzepts gleichzeitig
sichtbar sind – in einer **festen Reihenfolge**, weil erst die stabile Reihenfolge die
Unterscheidung erlernbar macht.

| Aspekt | Beschreibung |
| --- | --- |
| Layout | `mx-auto max-w-2xl`, alle Blöcke untereinander mit `mt-6`. Kein separates Desktop-Layout; auf großen Schirmen bleibt die Lesespalte zentriert. |
| Herkunft | „Zurück zum Feed" führt je nach `post.mode` nach `/feed/visual` oder `/feed/discussion` |

```
┌─── max-w-2xl ─────────────────────────────────────┐
│ [← Zurück zum Feed]                                │
│ Beitragstitel bzw. „Beitrag von {Autor}"           │  h1
│ Beitrag, Analyse, eigene Reaktion und Community …  │
│                                                    │
│ ①  ┌──────────────────────────────────────────┐   │  Panel (visual)
│    │ Autor · @handle · vor 2 Std.             │   │  bzw. DiscussionPostCard
│    │ [ MediaPlaceholder + Reaktions-Chip ]    │   │  mit showAllComments
│    │ Beitragstext …                           │   │
│    └──────────────────────────────────────────┘   │
│                                                    │
│ ②  ┌── Panel variant="assist" ─────────────────┐  │  bg-assist-tint
│    │ ASSISTENZSCHICHT · ANALYSE DES INHALTS    │  │  border-assist-line
│    │                        (🧪 simuliert)     │  │
│    │ ──────────────────────────────────────    │  │
│    │ [icon] Wahrscheinlich sarkastisch         │  │  AssistantCardBody
│    │        (Interpretation, keine Tatsache)   │  │
│    │  Sicherheit der Einschätzung: mittel      │  │
│    │  (2 von 3)  [██][██][░░]                  │  │
│    │  KURZE BEGRÜNDUNG …                       │  │
│    │  [💡 Warum wird das so eingeschätzt?]     │  │
│    │  WAS DIESE ANALYSE NICHT WISSEN KANN …    │  │
│    │  [👎 Nicht hilfreich] [↻ Andere Interpr.] │  │
│    └───────────────────────────────────────────┘  │
│                                                    │
│ ③  ┌── ReactionTimeline ──────────────────────┐   │  nur bei Video +
│    │ ⏱ Verlauf deiner geschätzten Reaktion    │   │  aktiver Erfassung
│    │   (🧪 erfundener Verlauf)                │   │
│    │ [ amüsiert │ nachdenklich │ angespannt ] │   │  role="img"
│    │ 00:00                             00:18  │   │
│    │ Bei 00:07: geschätzter Ausdruck …        │   │  role="status"
│    │ ABSCHNITTE IM DETAIL (Legende als Text)  │   │
│    └──────────────────────────────────────────┘   │
│                                                    │
│ ④  ┌── CommunityReactions ────────────────────┐   │
│    │ 👥 Reaktionen der Community              │   │
│    │    (🧪 erfundene Werte)                  │   │
│    │ (●Automatische Schätzungen)(○Selbstausk.)│   │  role="radiogroup"
│    │ 1.842 Personen haben freiwillig teilg.   │   │
│    │ amüsiert    ████████████████ 42 %        │   │  Chart aria-hidden
│    │ interessiert ██████████ 27 %             │   │  + sr-only-Tabelle
│    │ …                                        │   │
│    │ WOHER KOMMEN DIESE ZAHLEN? …             │   │
│    │ (⚠ Diese Gruppe muss nicht repräsent. …) │   │
│    └──────────────────────────────────────────┘   │
└────────────────────────────────────────────────────┘
```

**Blockweise Zustände**

| Block | Zustand | Darstellung |
| --- | --- | --- |
| ① Inhalt | `mode === 'discussion'` | `DiscussionPostCard showAllComments` |
| ① Inhalt | `mode === 'visual'` | `Panel as="article"` mit Autorzeile, `MediaPlaceholder` (mit `onTimeChange`) und Beitragstext |
| ② Analyse | `available` | `Panel variant="assist"` mit Kopfzeile „ASSISTENZSCHICHT · ANALYSE DES INHALTS" + `SimulatedBadge` und der vollständigen `AssistantCardBody` **inline** (kein Sheet) |
| ② Analyse | `none` | `Panel variant="muted"`, `EyeOff`-Icon, „Für diesen Beitrag ist im Prototyp keine Analyse vorbereitet." – **ohne** Einstellungs-Button |
| ② Analyse | `disabled` | derselbe Panel-Typ, Text „Das liegt an einer deiner Einstellungen." **mit** `Button variant="assist"` „Einstellungen öffnen" |
| ③ Verlauf | Timeline vorhanden **und** `duration > 0` | `ReactionTimeline` mit `currentTime` aus dem Scrubber |
| ③ Verlauf | Video, aber `simulatedCameraCapture` aus | `Panel variant="muted"` „Kein Reaktionsverlauf verfügbar" + Link zur Einstellung |
| ③ Verlauf | sonst (Bild, Textbeitrag) | Block entfällt vollständig |
| ④ Community | `showCommunityReactions` an und Datensatz vorhanden | `CommunityReactions` |
| ④ Community | sonst | `Panel variant="muted"` „Community-Reaktionen sind ausgeblendet" + Link zur Einstellung |
| Unbekannte `postId` | `getPost` liefert `undefined` | Es wird `NotFoundPage` gerendert |

**Barrierefreiheit:** Die Analyse liegt in `<section aria-labelledby="analysis-heading">`
mit einer `sr-only`-Überschrift, damit die Sektion benannt ist, ohne die sichtbare
Hierarchie zu verdoppeln. Der Scrubber im `MediaPlaceholder` treibt `currentTime`;
die dadurch wechselnde Aussage der Timeline steht in einem `role="status"`.

### Assistenz-Sheet (Feed-Variante desselben Inhalts)

```
Mobil (< 640 px)                      Desktop (≥ 640 px)
┌───────────────────────────┐         ┌───────────────────────────────┐
│  (Feed, abgedunkelt 45 %) │         │   (Seite, abgedunkelt 45 %)   │
│                           │         │  ┌─────────────────────────┐  │
├───────────────────────────┤ ← rundet│  │▔▔▔▔▔▔▔ bg-assist ▔▔▔▔▔▔│  │
│▔▔▔▔▔▔ bg-assist ▔▔▔▔▔▔▔▔│   oben  │  │ Wahrscheinlich sark.    │  │
│ Wahrscheinlich sarkastisch│         │  │ (🧪 simuliert) [✕ Schl.]│  │
│ (🧪 simuliert)  [✕ Schließ]│         │  │ Einschätzung der …      │  │
│ Einschätzung der Assist… │         │  ├─────────────────────────┤  │
├───────────────────────────┤         │  │ AssistantCardBody       │  │
│ AssistantCardBody         │         │  │ (scrollbar)             │  │
│ (scrollbar, max-h 90dvh)  │         │  └─────────────────────────┘  │
└───────────────────────────┘         └───────────────────────────────┘
  items-end, rounded-t-sheet            sm:items-center, sm:max-w-2xl,
                                        sm:rounded-sheet, sm:p-6
```

Fokus wandert beim Öffnen hinein, `Tab` zykliert innerhalb, `Escape` und ein Klick
auf den Backdrop schließen, danach kehrt der Fokus auf den auslösenden Button
zurück. Der Seitenhintergrund wird am Scrollen gehindert.

---

## 7. Persönliche Übersicht — `/overview`

**Zweck:** Zählungen und sonst nichts. Es gibt bewusst **keine** Interpretation der
Person – keine „du reagierst oft negativ"-Aussage, keine Stimmungswerte, keine
Trends. Beides verbietet der Auftrag, und beides wäre bei durchweg erfundenen
Eingangswerten ohnehin nicht vertretbar.

| Aspekt | Beschreibung |
| --- | --- |
| Layout Desktop | `mx-auto max-w-2xl`; die drei Zähler als `sm:grid-cols-3`, der Schätzung/Angabe-Vergleich als `sm:grid-cols-2` |
| Layout Mobil | Alle Raster kollabieren auf eine Spalte |

```
┌─── max-w-2xl ─────────────────────────────────────┐
│ Persönliche Übersicht  (🧪 Schätzungen simuliert) │
│ Hier stehen nur Zählungen – keine Bewertung …     │
│ (⚠ Speicherung ist ausgeschaltet …)   ← bedingt   │
│ ┌────────┐ ┌────────┐ ┌────────┐                  │
│ │   7    │ │   3    │ │   5    │                  │  sm:grid-cols-3
│ │Beiträge│ │eigene  │ │Mal     │                  │
│ │angeseh.│ │Angaben │ │geöffnet│                  │
│ └────────┘ └────────┘ └────────┘                  │
│ ┌─ Automatische Schätzung und deine Angabe ─────┐ │
│ │ ▎Schätzung passte  │ ▎Schätzung wich ab       │ │  DefinitionRow
│ │  2 von 3           │  1 von 3                 │ │  assist / self
│ │ ℹ Eine Abweichung bedeutet nicht, dass du …   │ │
│ └───────────────────────────────────────────────┘ │
│ ┌─ Häufige Inhaltskategorien ───────────────────┐ │
│ │ Sarkasmus oder Ironie          3 Beiträge     │ │
│ │ ▬▬▬▬▬▬▬▬▬▬░░░░░░░░░░  (bg-assist)             │ │  aria-hidden
│ └───────────────────────────────────────────────┘ │
│ Zuletzt betrachtete Beiträge                      │
│ ┌───────────────────────────────────────────────┐ │
│ │ Titel …                        [🗑 Löschen]   │ │  danger, aria-label
│ │ Autor · 12.06.25, 14:22 · Sarkasmus           │ │
│ │ ▎Autom. geschätzt   │ ▎Von dir angegeben      │ │
│ └───────────────────────────────────────────────┘ │
│ ┌─ DATEN LÖSCHEN (muted) ───────────────────────┐ │
│ │ [🗑 Alle Daten löschen]  → Bestätigungsschritt│ │
│ └───────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────┘
```

**Zustände**

| Zustand | Bedingung | Darstellung |
| --- | --- | --- |
| **leer** | `history.length === 0` | Frühzeitiger Return: nur H1 + `Panel variant="muted"` „Noch keine Einträge" + `Button variant="assist"` „Zum Feed". Kein Zähler, keine Löschsektion. |
| **Speicherung aus** | `!storeReactionHistory` | Zusätzlicher `Chip tone="caution"`: „Speicherung ist ausgeschaltet. Diese Liste verschwindet beim Neuladen." |
| **kein Vergleich** | `aligned + diverged === 0` | Statt Zahlen ein erklärender Satz, wann hier etwas erscheint |
| **nicht vergleichbar** | `comparison['not-comparable'] > 0` | Zusatzzeile „n Angabe(n) waren nicht vergleichbar (unklare Schätzung oder ‚andere Reaktion')" |
| **Eintrag ohne Reaktionsdaten** | kein `reactions[postId]` | Die beiden `DefinitionRow` entfallen; nur Titel, Metazeile und Löschen |
| **Löschbestätigung** | `confirmingDeleteAll` | Warntext + „Ja, alles löschen" (`danger`) und „Abbrechen" |

**Barrierefreiheit:** Schätzung und Angabe stehen immer in `<dl>`/`DefinitionRow`,
niemals zusammengefasst; die Kategorienbalken sind `aria-hidden`, weil Zahl und Name
daneben als Text stehen; Löschen-Buttons tragen ein sprechendes `aria-label` mit dem
Beitragstitel, damit sie in der Liste unterscheidbar sind.

---

## 8. Einwilligung und Einstellungen — `/settings`

**Zweck:** Alle Schalter an einem Ort, gruppiert **nach dem, worüber der Schalter
etwas aussagt** – nicht nach Featurenamen. Der Unterschied, den Testpersonen
verstehen sollen, ist „das betrifft den Beitrag" gegen „das betrifft mich".

| Aspekt | Beschreibung |
| --- | --- |
| Layout | `mx-auto max-w-2xl`, Gruppen als `<section aria-labelledby>` mit `mt-8`; Schalterlisten `space-y-2.5`. Ein Layout für alle Breiten; nur der Pausen-Block und die Fußaktionen brechen per `flex-wrap` um. |

```
┌─── max-w-2xl ─────────────────────────────────────┐
│ Einwilligung und Einstellungen                    │  h1
│ Jede Funktion ist einzeln schaltbar. …            │
│ ┌── Panel variant="assist" (bzw. muted) ────────┐ │
│ │ Assistent ist aktiv        [⏸ Alles pausieren]│ │  Master-Pause
│ │ Pausieren stoppt alle Hinweise auf einmal, …  │ │
│ └───────────────────────────────────────────────┘ │
│ ANALYSE VON BEITRÄGEN                             │  h2
│ Diese Einstellungen betreffen nur den Inhalt …    │
│ ┌───────────────────────────────────────────────┐ │
│ │ (●===) Inhalts- und Kontextanalyse            │ │  Toggle checked:
│ │        Grundfunktion. Zeigt „Kontext erkl."…  │ │  border-assist-line
│ │        AKTIV                                  │ │  bg-assist-tint
│ └───────────────────────────────────────────────┘ │
│ ┌───────────────────────────────────────────────┐ │
│ │ (===○) Sarkasmus- und Ironiehinweise   INAKTIV│ │
│ └───────────────────────────────────────────────┘ │
│ ┌───────────────────────────────────────────────┐ │
│ │ (===○) Hinweise auf Ragebait und Polarisierung│ │
│ └───────────────────────────────────────────────┘ │
│ ┌─ fieldset: Wie aufdringlich sollen Hinweise? ─┐ │
│ │ (•) Nur auf Anfrage (empfohlen)               │ │  echte Radios
│ │ ( ) Dezenter Hinweis am Beitrag               │ │
│ └───────────────────────────────────────────────┘ │
│ DEINE EIGENE REAKTION                             │  h2
│ (📷 Standardmäßig ausgeschaltet) (🧪 vorab …)     │
│ ┌ (===○) Simulierte eigene Reaktionserfassung ──┐ │
│ ┌ (===○) Kamera-Vorschau … [disabled + Grund]  ─┐ │
│ │        → CameraPreview erscheint, wenn aktiv  │ │
│ ┌ (===○) Eigene Reaktion anonym weitergeben  ───┐ │
│ ┌ (●===) Reaktionsverlauf lokal speichern    ───┐ │
│ REAKTIONEN ANDERER                                │  h2
│ ┌ (●===) Aggregierte Community-Reaktionen  ─────┐ │
│ DARSTELLUNG                                       │  h2
│ ┌ fieldset Farbschema: (•)System ( )Hell ( )Dunk┐ │
│ ───────────────────────────────────────────────── │
│ [↻ Einstellungen zurücksetzen] [🛡 Datenschutz]   │
└────────────────────────────────────────────────────┘
```

**Gruppen und Schalter**

| Gruppe | Schalter | Abhängigkeit |
| --- | --- | --- |
| Master | „Alles pausieren" / „Fortsetzen" (Button, kein Toggle) | – |
| Analyse von Beiträgen | Inhalts- und Kontextanalyse | – |
| | Sarkasmus- und Ironiehinweise | `disabled` ohne Inhaltsanalyse |
| | Hinweise auf Ragebait und Polarisierung | `disabled` ohne Inhaltsanalyse |
| | Radiogruppe „Wie aufdringlich sollen Hinweise sein?" | – |
| Deine eigene Reaktion | Simulierte eigene Reaktionserfassung | – |
| | Kamera-Vorschau anzeigen (nur Vorschau) | `disabled` ohne Erfassung |
| | Eigene Reaktion anonym weitergeben | `disabled` ohne Erfassung |
| | Reaktionsverlauf lokal speichern | – |
| Reaktionen anderer | Aggregierte Community-Reaktionen anzeigen | – |
| Darstellung | Farbschema `system` / `light` / `dark` | – |

**Zustände**

| Zustand | Darstellung |
| --- | --- |
| Assistent aktiv | Master-Block als `Panel variant="assist"`, Überschrift „Assistent ist aktiv", Button `secondary` „Alles pausieren" |
| Assistent pausiert | `Panel variant="muted"`, Überschrift „Assistent ist pausiert", Button `assist` „Fortsetzen" |
| Schalter aktiv | `Toggle`-Container `border-assist-line bg-assist-tint`, Knopf rechts mit `Check`, Statuszeile „AKTIV", ggf. `activeNote` |
| Schalter inaktiv | `border-line bg-surface`, Knopf links mit `Minus`, „INAKTIV" |
| Schalter gesperrt | `opacity-60`, Grund in `text-caution` |
| Kamera-Vorschau an | zusätzlich die `CameraPreview`-Komponente direkt unter dem Schalter |
| Abschaltkaskade | Wird die simulierte Erfassung ausgeschaltet, setzt `updateSetting` automatisch auch `liveCameraPreview` und `shareAnonymousReaction` auf `false` |

**Barrierefreiheit:** Alle Schalter sind echte Checkboxen mit `role="switch"`,
Beschriftung über `htmlFor`/`id` und Zusatzinfos über `aria-describedby`. Die beiden
Radiogruppen liegen in `<fieldset>` mit `<legend>` und nutzen native Radios mit
`accent-[var(--cl-assist)]`. Jede Gruppe ist eine `<section aria-labelledby>`.

---

## 9. Datenschutz-Dashboard — `/privacy`

**Zweck:** Ein Bildschirm, der „Was ist an, wo liegt es, wie werde ich es los"
beantwortet, ohne dass man Einstellungsschalter interpretieren muss. Die
Zustandszeilen sind bewusst **schreibgeschützte Spiegel** der Einstellungen und als
Aussagen über das System formuliert, nicht als Bedienelemente.

| Aspekt | Beschreibung |
| --- | --- |
| Layout | `mx-auto max-w-2xl`, Blöcke mit `mt-5`/`mt-6`. Aktionsleisten mit `flex-wrap gap-2.5`, brechen mobil auf mehrere Zeilen um. |

**Inhalt**

| Block | Inhalt |
| --- | --- |
| Kopf | H1 „Datenschutz-Dashboard" + `SimulatedBadge label="Prototyp"` |
| Lokalitätszusage | `Panel variant="assist"` „Verarbeitung ausschließlich lokal" – kein Backend, keine Datenbank, keine Anmeldung; Speicherort `localStorage` als `<code>` |
| Zustandszeilen | 5 `Panel` mit Icon, Name, Status-`Chip` und Erklärsatz |
| Was ist simuliert | `Panel variant="muted"` mit 5 Punkten (`bg-sim`-Aufzählungszeichen) und dem Gegenstück: „Echt sind nur: deine Einstellungen, dein Verlauf, deine eigenen Angaben und deine Research-Mode-Antworten – alle lokal." |
| Aktuell gespeichert | `Panel` mit drei Zählungen: Verlaufseinträge, Reaktionsdatensätze, Research-Mode-Ergebnisse |
| Deine Daten | drei Aktionen (siehe unten) + `role="status"`-Rückmeldung |

**Die fünf Zustandszeilen**

| Zeile | „aktiv" wenn |
| --- | --- |
| Inhaltsanalyse | `contentAnalysis && !assistantPaused` |
| Eigene Reaktionserfassung (simuliert) | `simulatedCameraCapture && !assistantPaused` |
| Kamera-Vorschau (nur Anzeige) | `liveCameraPreview` (Icon wechselt `Camera`/`CameraOff`) |
| Speicherung des Reaktionsverlaufs | `storeReactionHistory` |
| Teilen aggregierter Reaktionen | `shareAnonymousReaction` |

Jede Zeile: `Chip tone="assist"` mit `Check` und dem Wort **„aktiv"**, bzw.
`Chip tone="neutral"` mit `Minus` und **„inaktiv"**. Zusätzlich färbt sich das
Zeilen-Icon `text-assist-strong` bzw. `text-faint` – die Farbe ist also nur eine
Verstärkung, nie der Träger.

**Zustände**

| Zustand | Verhalten |
| --- | --- |
| Standard | drei Buttons: „Daten als JSON exportieren" (`assist`), „Alle Daten löschen" (`danger`), „Demo zurücksetzen" |
| Bestätigung „Daten" | `Panel variant="muted"`: „Verlauf, eigene Angaben und Testergebnisse werden entfernt. Deine Einstellungen bleiben erhalten." |
| Bestätigung „Demo" | „Setzt zusätzlich alle Einstellungen auf die Standardwerte zurück und zeigt das Onboarding erneut. Damit ist die Kameraerfassung wieder ausgeschaltet." |
| nach einer Aktion | Bestätigungssatz in `<p role="status">` (z. B. „Export als JSON-Datei gestartet.") |

**Barrierefreiheit:** Status durch Icon + Wort + Farbe (dreifach); Bestätigungen über
`role="status"` mit reservierter Mindesthöhe, damit nichts springt; Abschnitte mit
`aria-labelledby`.

---

## 10. Research Mode — `/research`

**Zweck:** Führt eine Testperson durch die drei skriptierten Szenarien und sammelt
danach je eine kurze Bewertung. Die Ergebnisse bleiben auf dem Gerät; der Export
existiert, damit eine moderierende Person sie am Sitzungsende einsammeln kann.

Die Seite hat **drei sich gegenseitig ausschließende Ansichten**, gesteuert über
`useResearchSession()`:

### 10a Übersicht (kein Szenario aktiv)

```
┌─── max-w-2xl ─────────────────────────────────────┐
│ Research Mode  (🧪 Nutzertest)                    │
│ Drei kurze Aufgaben mit je einer Bewertung danach.│
│ [role=status: „Bewertung … wurde lokal gesp."]    │
│ ┌───────────────────────────────────────────────┐ │
│ │ Szenario 1: Sarkasmus … (✓ abgeschlossen)     │ │  Chip positive/neutral
│ │ Wir möchten wissen, ob …    [▶ Wiederholen]   │ │  Button secondary
│ │ Bewertet am 12.06.25, 14:31 · Dauer 96 s      │ │
│ └───────────────────────────────────────────────┘ │
│ ┌───────────────────────────────────────────────┐ │
│ │ Szenario 2: Community-Reaktionen (◉ offen)    │ │
│ │                             [▶ Starten]       │ │  Button assist
│ └───────────────────────────────────────────────┘ │
│ ┌ Szenario 3: Eigene Reaktion korrigieren … ────┐ │
│ Ergebnisse (1 von 3)                              │
│ ┌ Tabelle (overflow-x-auto, min-w-[34rem]) ─────┐ │
│ │ Szenario │verständl.│hilfreich│störend│Vertr. │ │
│ │ sarcasm  │    5     │    4    │   2   │   3   │ │
│ └───────────────────────────────────────────────┘ │
│ [⬇ Als JSON] [▦ Als CSV] [↻ Ergebnisse löschen]  │
└────────────────────────────────────────────────────┘
```

### 10b Aufgabe läuft (`phase === 'working'`)

```
┌─── max-w-2xl ─────────────────────────────────────┐
│ (🧪 Research Mode · Aufgabe läuft)                │  Chip tone="sim"
│ Szenario 1: Sarkasmus in einem Beitrag verstehen  │  h1
│ ┌── Panel variant="assist" ─────────────────────┐ │
│ │ WORUM ES GEHT                                 │ │
│ │ Wir möchten wissen, ob die Assistenzkarte …   │ │
│ └───────────────────────────────────────────────┘ │
│ Deine Aufgabe                                     │  h2 + <ol>
│ (1) Öffne den Visual Feed und suche den Beitrag…  │
│ (2) Lies die Bildunterschrift und überlege …      │
│ (3) Öffne dann „Kontext erklären" …               │
│ [▶ Visual Feed öffnen]  [Aufgabe erledigt – jetzt│
│                          bewerten]                │
│ Du kannst dich frei in der App bewegen. Über den  │
│ Hinweis am oberen Rand kommst du jederzeit zurück.│
└────────────────────────────────────────────────────┘
```

Während dieser Phase erscheint auf **allen anderen Shell-Seiten** der
`ResearchBanner` in der `sim`-Farbfamilie mit Link „Aufgabe anzeigen" – ohne ihn
gäbe es keinen Weg zurück zur Aufgabe und zum Bewertungsformular.

### 10c Bewertung (`phase === 'rating'`)

```
┌─── max-w-2xl ─────────────────────────────────────┐
│ (🧪 Research Mode · Bewertung)                    │
│ Kurze Bewertung                                   │
│ Szenario 1: …    Es gibt keine richtigen Antworten│
│ ┌── Panel + fieldset ───────────────────────────┐ │
│ │ War der Hinweis verständlich?                 │ │  legend
│ │ [1] [2] [3] [■4■] [5]                         │ │  size-11, echte Radios
│ │ 1 = gar nicht verständlich   5 = sehr verst.  │ │  sr-only im <label>
│ └───────────────────────────────────────────────┘ │
│ … War der Hinweis hilfreich? …                    │
│ … War die Darstellung störend? …                  │
│ … Würdest du dieser Funktion vertrauen? …         │
│ ┌ Möchtest du etwas ergänzen? (optional) ───────┐ │
│ │ [textarea rows=4]                             │ │
│ └───────────────────────────────────────────────┘ │
│ [✓ Bewertung speichern] [Abbrechen]               │
│ Bitte beantworte alle vier Fragen, um zu speichern│  wenn unvollständig
└────────────────────────────────────────────────────┘
```

**Die drei Szenarien** (`src/features/research-mode/scenarios.ts`)

| ID | Titel | Startpfad |
| --- | --- | --- |
| `sarcasm` | Szenario 1: Sarkasmus in einem Beitrag verstehen | `/feed/visual` |
| `community` | Szenario 2: Community-Reaktionen eines polarisierenden Posts einordnen | `/post/v-ragebait` |
| `correction` | Szenario 3: Eigene Reaktion korrigieren und Datenschutzoptionen finden | `/settings` |

Aufgaben sind als Ziele formuliert („finde heraus, ob …"), nicht als Klickpfade –
die Hälfte der Fragestellung ist ja, ob Menschen die Bedienelemente ohne Hilfe
finden.

**Zustände**

| Zustand | Darstellung |
| --- | --- |
| kein Ergebnis gespeichert | „Noch keine Bewertungen gespeichert."; alle drei Export-/Löschbuttons `disabled` |
| Szenario abgeschlossen | `Chip tone="positive"` + `Check` „abgeschlossen", Button „Wiederholen" (`secondary`), Zeitstempel und Dauer |
| Szenario offen | `Chip tone="neutral"` + `CircleDot` „offen", Button „Starten" (`assist`) |
| Bewertung unvollständig | „Bewertung speichern" `disabled` + Hinweissatz |
| Abbruch in der Bewertung | Status „Szenario abgebrochen. Es wurde nichts gespeichert." |
| Wiederholung | `saveResearchResult` ersetzt das vorhandene Ergebnis derselben `scenarioId` |

**Barrierefreiheit:** Skalenwerte sind echte `<input type="radio" class="sr-only">`
in einem `<label>` – die Zahlen sind also fokussierbar, mit Pfeiltasten bedienbar und
über die `<legend>` der Frage zugeordnet. Beide Skalenenden stehen als Text unter
jeder Frage, damit „5" nie in einer Zeile „gut" und in der nächsten „schlecht" heißt.
Die Ergebnistabelle hat eine `sr-only`-`<caption>`, `scope="col"` und `scope="row"`
und scrollt in einem eigenen `overflow-x-auto`-Container (`min-w-[34rem]`), sodass die
Seite selbst nie horizontal scrollt.

---

## 11. 404 — `*`

**Zweck:** Sackgasse mit zwei Auswegen.

| Aspekt | Beschreibung |
| --- | --- |
| Layout | Vollbild: `flex min-h-dvh flex-col items-center justify-center gap-6 bg-canvas px-4 text-center` – identisch auf allen Breiten |
| Chrome | Außerhalb der Shell, daher **ohne** StatusBar und Navigation |
| Inhalt | `Logo asLink={false}`, H1 „Diese Seite gibt es nicht", Erklärsatz, `Button variant="assist"` „Zum Feed" und `Button variant="secondary"` „Zur Startseite" |
| Zustände | keine |

Zusätzlich wird dieselbe Komponente von `PostDetailPage` gerendert, wenn `postId`
kein bekannter Beitrag ist – dort allerdings **innerhalb** der Shell.

---

## 12. Komponentenplan

Welche Komponente auf welchem Bildschirm eingesetzt wird. `●` = direkt verwendet,
`○` = indirekt über eine andere Komponente.

| Komponente | `/` | `/how-it-works` | `/onboarding` | `/feed/visual` | `/feed/discussion` | `/post/:id` | `/overview` | `/settings` | `/privacy` | `/research` | 404 | Shell |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| `Button` | ● | ● | ● | ○ | ○ | ● | ● | ● | ● | ● | ● | |
| `Chip` | ● | | ● | ○ | ○ | ○ | ● | ● | ● | ● | | ○ |
| `SimulatedBadge` | ● | ● | ● | ● | ● | ● | ● | ● | ● | ● | | |
| `Panel` | ● | ● | ● | | | ● | ● | ● | ● | ● | | |
| `FieldLabel` | | | | ○ | ○ | ○ | ● | | ● | ● | | |
| `DefinitionRow` | | | | ○ | ○ | ○ | ● | | | | | |
| `Sheet` | | | | ○ | ○ | ○ | | | | | | |
| `Toggle` | | | ● | | | | | ● | | | | |
| `ConfidenceMeter` | | | | ○ | ○ | ○ | | | | | | |
| `StatusBar` | | | | | | | | | | | | ● |
| `Logo` | ● | ● | ● | | | | | | | | ● | ● |
| `ContextAssistantButton` | | | | ○ | ○ | | | | | | | |
| `AssistantCardBody` | | | | ○ | ○ | ● | | | | | | |
| `VisualPostCard` | | | | ● | | | | | | | | |
| `DiscussionPostCard` | | | | | ● | ● | | | | | | |
| `MediaPlaceholder` | | | | ○ | | ● | | | | | | |
| `FeedModeSwitch` | | | | ● | ● | | | | | | | |
| `OwnReactionControl` | | | | ○ | ○ | ● | | | | | | |
| `CameraPreview` | | | | | | | | ● | | | | |
| `CommunityReactions` | | | | | | ● | | | | | | |
| `ReactionTimeline` | | | | | | ● | | | | | | |
| `ResearchBanner` | | | | | | | | | | | | ● |
| `AppShell` | | | | ● | ● | ● | ● | ● | ● | ● | | – |

**Anmerkungen zur Tabelle**

- `AssistantCardBody` erscheint im Feed nur **innerhalb** eines `Sheet`, auf der
  Detailseite dagegen **inline** in einem `Panel variant="assist"`. Es ist derselbe
  Inhalt in zwei Rahmen.
- `DiscussionPostCard` wird auf `/post/:id` mit `showAllComments` wiederverwendet,
  statt eine zweite Detailkarte zu bauen.
- `StatusBar` und `ResearchBanner` gehören ausschließlich zur `AppShell` und
  erscheinen deshalb auf keiner Seite außerhalb der Shell (`/`, `/how-it-works`,
  `/onboarding`, 404).
- `Logo` ist auf den Seiten außerhalb der Shell Teil des seiteneigenen Headers.

### Datenabhängigkeiten je Bildschirm

| Bildschirm | Datenquelle | Gate-Funktion |
| --- | --- | --- |
| Feeds | `getPostsForMode()` aus `src/data/posts.ts` | – |
| Assistenzkarte | `getAnalysis()` aus `src/data/analyses.ts` | `resolveAnalysis(postId, settings)` |
| Eigene Reaktion | fest hinterlegte `SIMULATED_EXPRESSION`-Tabelle | `estimateViewerExpression(postId, settings)` |
| Reaktionsverlauf | `getTimeline()` aus `src/data/timelines.ts` (nur `v-humor`, `v-emotional`, `v-ragebait`) | `resolveTimeline(postId, settings)` |
| Community | `getCommunity()` aus `src/data/community.ts` (alle 9 Beiträge) | `resolveCommunity(postId, settings)` |
| Übersicht | `history` + `reactions` aus `AppStateProvider` | `storeReactionHistory` steuert die Persistenz |
| Research Mode | `SCENARIOS` + gespeicherte `research`-Ergebnisse | – |
