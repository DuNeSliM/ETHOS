# ContextLens – Design System

Dieses Dokument beschreibt das Designsystem **so, wie es implementiert ist**. Jede
Aussage lässt sich am Code prüfen; die jeweilige Quelldatei ist genannt.

Technischer Rahmen: React + TypeScript + Tailwind CSS v4, Icons aus `lucide-react`,
Charts aus `recharts`, Routing über `react-router-dom`.

Quelle der Wahrheit für alle Tokens: `src/styles/index.css`.

---

## 1. Designprinzipien

Die Prinzipien sind nicht nachträglich formuliert, sondern stehen als Kommentare in
den Quelldateien und sind dort umgesetzt.

| Prinzip | Bedeutung | Umsetzung im Code |
| --- | --- | --- |
| **Ruhig statt alarmierend** | Die Assistenz drängt sich nicht auf. Kein Dauer-Banner mit Emotionsanzeige über dem Inhalt. | `ContextAssistantButton` rendert nur einen kleinen Button; die gesamte Analyse liegt hinter einem `Sheet` (`src/features/context-assistant/ContextAssistantButton.tsx`). |
| **Hinweise auf Abruf** | Nichts wird automatisch über den Beitrag gelegt. | Default `hintVisibility: 'on-demand'` (`src/app/AppStateProvider.tsx`), Onboarding-Text „Nichts wird automatisch über den Inhalt gelegt." |
| **Nicht klinisch** | Keine Laborästhetik, keine Prozentbalken als Hauptaussage, keine Diagnose-Sprache. | Sicherheit wird als Wort + „2 von 3" + Balken gezeigt (`ConfidenceMeter`); Wortschatz zentral und gehedgt in `src/lib/labels.ts`. |
| **Nicht überladen** | Feste, immer gleiche Reihenfolge in der Assistenzkarte, damit man lernt, wo man schaut. | Kommentar und Reihenfolge in `AssistantCardBody.tsx`: Überschrift → Kurzlesart → Sicherheit → Begründung → Beobachtungen → Ton/Ausdruck → Polarisierung → Grenzen → Feedback. |
| **Jede Karte gibt ihre Grenzen zu** | Der Block „Was diese Analyse nicht wissen kann" ist nicht optional. | `AssistantCardBody.tsx` rendert `analysis.limitations` bedingungslos. |
| **Simuliertes ist immer als solches markiert** | Eine Testperson darf nie im Zweifel sein, ob eine Zahl gemessen wurde. | `SimulatedBadge`, `.sim-hatch`, `sim`-Tokenfamilie – siehe Abschnitt 4. |
| **Trennung von drei Aussagearten** | Aussage über den Beitrag ≠ Maschinenschätzung über die Person ≠ Selbstauskunft. | Typ-Namenskonvention in `src/types/index.ts`; `DefinitionRow` mit `tone="assist"` vs. `tone="self"` in `OwnReactionControl` und `OverviewPage`. |
| **Freiwilligkeit ist sichtbar** | Was gerade läuft, steht permanent im Chrome. | `StatusBar` unter dem Header auf jeder Seite innerhalb der `AppShell`. |

---

## 2. Die zwei visuellen Welten

Der Kommentarkopf von `src/styles/index.css` benennt sie explizit:

1. **Simulierte PLATTFORM** (Feeds, Beiträge, Kommentare) → neutrale Grautöne,
   „fotografische" Medien-Platzhalter, dichte Informationsanordnung.
2. **ASSISTENZSCHICHT** (Kontextassistent, Reaktions-Chips, Transparenzflächen) →
   Teal-`assist`-Familie, gerundete Panels, Linsen-Ikonografie.

### Wie die Trennung technisch hergestellt wird

| Mittel | Konkret | Fundstelle |
| --- | --- | --- |
| **Eigene Farbfamilie** | Alles, was zur Assistenz gehört, benutzt `assist`-Tokens (`bg-assist`, `bg-assist-tint`, `text-assist-strong`, `border-assist-line`). Plattforminhalt benutzt nur `surface`/`line`/`ink`/`muted`. | `src/styles/index.css`, alle Feature-Komponenten |
| **Assistenzstreifen an der Karte** | Post-Karten sind bis zur Engagement-Zeile neutral; die Assistenz sitzt darunter in einem eigenen abgesetzten Streifen `border-t border-assist-line bg-assist-tint/50`. | `VisualPostCard.tsx` Z. 90, `DiscussionPostCard.tsx` Z. 77 (dort `border-y`) |
| **Teal-Oberkante am Sheet** | Jedes Sheet trägt oben eine 6 px hohe Leiste `h-1.5 w-full bg-assist` mit `aria-hidden`. | `src/components/Sheet.tsx` Z. 145 |
| **Panel-Rahmen** | `Panel variant="assist"` = `bg-assist-tint border-assist-line`; Plattformkarten benutzen `border-line bg-surface`. | `src/components/primitives.tsx` |
| **Linsen-Ikonografie** | Das Logo ist ein aus Tokens gezeichnetes SVG (Außenring + Fokuspunkt) auf `bg-assist`, kein Bild. | `src/components/Logo.tsx` |
| **Chrome gehört zur Assistenz** | Header, Navigation, StatusBar sind bewusst in der Assistenz-Sprache gestaltet; der `<Outlet />`-Inhalt darunter „sieht aus wie ein anderes Produkt". | Kommentar in `src/app/AppShell.tsx` |
| **Assist-Auslöser sind erkennbar** | Der „Kontext erklären"-Button ist immer `border-assist-line bg-assist-tint text-assist-strong` mit `Sparkles`-Icon. | `ContextAssistantButton.tsx` |
| **Aktive Navigation in Teal** | Aktive Nav-Items: `bg-assist-tint text-assist-strong` (Desktop) bzw. `text-assist-strong` + Teal-Unterstrich (Mobile). | `AppShell.tsx` |

Der Plattformbereich benutzt **keine** `assist`-Tokens – ausgenommen genau die
Streifen, die die Assistenz einführt. Damit bleibt die Regel „Teal = Assistenz"
lesbar.

---

## 3. Farbtokens

Semantische Werte liegen als CSS Custom Properties (`--cl-*`) vor und werden über
`@theme inline` als Tailwind-Utilities re-exportiert (`--color-*`). Nur so kann ein
Farbschema komplett getauscht werden, ohne eine einzige Utility-Klasse anzufassen.

### 3.1 Plattform-Flächen (`surface` / `line`)

| CSS-Variable | Tailwind-Token | Utility-Beispiel | Hell | Dunkel |
| --- | --- | --- | --- | --- |
| `--cl-canvas` | `--color-canvas` | `bg-canvas` | `#f4f6f8` | `#0a0e13` |
| `--cl-surface` | `--color-surface` | `bg-surface` | `#ffffff` | `#141b23` |
| `--cl-surface-2` | `--color-surface-2` | `bg-surface-2` | `#eef1f5` | `#1c252f` |
| `--cl-surface-3` | `--color-surface-3` | `bg-surface-3` | `#e3e8ee` | `#26313d` |
| `--cl-border` | `--color-line` | `border-line` | `#d6dce4` | `#2c3944` |
| `--cl-border-strong` | `--color-line-strong` | `border-line-strong` | `#b6c0cc` | `#43535f` |

### 3.2 Text (`ink` / `muted` / `faint` / `inverse`)

| CSS-Variable | Tailwind-Token | Utility | Hell | Dunkel | Verwendung |
| --- | --- | --- | --- | --- | --- |
| `--cl-text` | `--color-ink` | `text-ink` | `#121822` | `#e9eef3` | Fließtext, Überschriften |
| `--cl-text-muted` | `--color-muted` | `text-muted` | `#55606f` | `#a3b1bf` | Erläuterungen, Sekundärtext |
| `--cl-text-faint` | `--color-faint` | `text-faint` | `#77828f` | `#8593a1` | Metadaten, Labels, Platzhalter |
| `--cl-text-inverse` | `--color-inverse` | `text-inverse` | `#ffffff` | `#0a0e13` | Text auf `bg-ink` (Primary-Button) |

### 3.3 Assistenzschicht (`assist`)

| CSS-Variable | Tailwind-Token | Utility | Hell | Dunkel | Verwendung |
| --- | --- | --- | --- | --- | --- |
| `--cl-assist` | `--color-assist` | `bg-assist`, `border-assist` | `#0d6e80` | `#5ed4e6` | Flächen, Logo, aktive Marker |
| `--cl-assist-strong` | `--color-assist-strong` | `text-assist-strong` | `#0a5361` | `#96e6f2` | Assistenz-Text auf Tint |
| `--cl-assist-tint` | `--color-assist-tint` | `bg-assist-tint` | `#e8f7fa` | `#0d2b33` | Assistenz-Panels, Streifen |
| `--cl-assist-tint-2` | `--color-assist-tint-2` | `hover:bg-assist-tint-2` | `#d2eef4` | `#12414c` | Hover auf Tint-Flächen |
| `--cl-assist-border` | `--color-assist-line` | `border-assist-line` | `#93cddb` | `#1f6577` | Panel- und Streifenränder |
| `--cl-assist-on` | `--color-assist-on` | `text-assist-on` | `#ffffff` | `#062028` | Text auf `bg-assist` |

Beachte die Umkehrung im Dunkelmodus: `assist` wird hell (Cyan), `assist-tint` wird
dunkel, `assist-on` wird fast schwarz. Die Rollen bleiben identisch, nur die Helligkeit
dreht.

### 3.4 Ton-/Statusfamilien

Diese Familien werden **nie allein** eingesetzt: jeder Status trägt zusätzlich ein
Icon und einen Text (siehe Abschnitt 8).

| Familie | CSS-Variablen | Tailwind-Tokens | Hell | Dunkel | Semantik im Prototyp |
| --- | --- | --- | --- | --- | --- |
| `info` | `--cl-info`, `--cl-info-tint` | `--color-info`, `--color-info-tint` | `#1d4ed8` / `#e8eeff` | `#9db6ff` / `#17203a` | **Selbstauskunft der Person**, Confidence „mittel", Alternativlesarten |
| `positive` | `--cl-positive`, `--cl-positive-tint` | `--color-positive`, `--color-positive-tint` | `#146c43` / `#e6f4ec` | `#79d3a3` / `#10281d` | Humor/Übertreibung, Confidence „hoch", „abgeschlossen" |
| `caution` | `--cl-caution`, `--cl-caution-tint` | `--color-caution`, `--color-caution-tint` | `#8a5300` / `#fdf1dc` | `#e8bd72` / `#2e2313` | Sarkasmus/Ironie, aktive Kamera, Repräsentativitätswarnung, Confidence „niedrig" |
| `alert` | `--cl-alert`, `--cl-alert-tint` | `--color-alert`, `--color-alert-tint` | `#a4243d` / `#fdebef` | `#f2a0b0` / `#33161e` | Ragebait, hohe Polarisierung, Löschen-Buttons |
| `neutral` | `--cl-neutral`, `--cl-neutral-tint` | `--color-neutral-ink`, `--color-neutral-tint` | `#4a5563` / `#eef1f5` | `#a9b6c3` / `#1c252f` | „inaktiv", „nicht eindeutig", ausgeschaltete Funktionen |

> Das Token heißt bewusst `--color-neutral-ink` und nicht `--color-neutral`, weil
> `neutral` in Tailwind bereits ein Paletten-Name ist.

### 3.5 Simulationsmarker (`sim`)

| CSS-Variable | Tailwind-Token | Utility | Hell | Dunkel |
| --- | --- | --- | --- | --- |
| `--cl-sim` | `--color-sim` | `text-sim`, `bg-sim` | `#6b3fa0` | `#c9aef0` |
| `--cl-sim-tint` | `--color-sim-tint` | `bg-sim-tint` | `#f3edfb` | `#221a33` |
| `--cl-sim-border` | `--color-sim-line` | `border-sim-line` | `#c9b1e6` | `#4d3a72` |

Violett ist im Prototyp **ausschließlich** für „das hier ist erfunden" reserviert.
Es kommt in keiner anderen Bedeutung vor.

### 3.6 Fokus und Schatten

| Variable | Hell | Dunkel | Verwendung |
| --- | --- | --- | --- |
| `--cl-focus` | `#0b4f5e` | `#8fe3f2` | `:focus-visible { outline: 3px solid var(--cl-focus) }` |
| `--cl-shadow` | `15 24 34` (RGB-Tripel) | `0 0 0` | Basis für `.panel-shadow` |

---

## 4. Das „simuliert"-Markierungssystem

Drei Ebenen, die zusammenwirken:

| Mittel | Was es ist | Wo es eingesetzt wird | Warum |
| --- | --- | --- | --- |
| **`SimulatedBadge`** | `Chip` mit `tone="sim"` und `FlaskConical`-Icon; Prop `label` überschreibt den Default `„Simuliert"`. | Landing, How-it-works, Onboarding (Schritt 3), beide Feeds (`„Erfundene Beiträge"`), `MediaPlaceholder` (`„Platzhalter"`), Sheet-Titel (`„simuliert"`), `AssistantCardBody`-Fuß (`„Diese Einschätzung ist vorab geschrieben, nicht berechnet"`), `CommunityReactions` (`„erfundene Werte"`), `ReactionTimeline` (`„erfundener Verlauf"`), Übersicht, Datenschutz, Research Mode, Einstellungen. | Eine Testperson soll nie im Zweifel sein, ob eine Zahl gemessen wurde. |
| **`.sim-hatch`** | Utility in `index.css`: diagonale Schraffur aus `repeating-linear-gradient` mit `color-mix(in srgb, var(--cl-sim) 14%, transparent)`. | Nur in `MediaPlaceholder.tsx` als `absolute inset-0`-Overlay über dem Farbverlauf. | Ein Platzhalter darf auch flüchtig nie wie echtes Videomaterial aussehen. |
| **`sim`-Tokenfamilie** | Siehe 3.5. | `Chip tone="sim"`, `ResearchBanner` (`bg-sim-tint`, `border-sim-line`, `text-sim`), Aufzählungspunkte im Datenschutz-Dashboard (`bg-sim`), Research-Mode-Statuschips. | Durchgehend dieselbe Farbe für „nicht echt", auch außerhalb von Badges. |

Zusätzlich als Text-Markierung:

- Das Logo trägt permanent die Unterzeile „Prototyp · simulierte Daten"
  (`src/components/Logo.tsx`).
- `MediaPlaceholder` hat eine sichtbare `figcaption`: „Simulierter Platzhalter. In
  diesem Prototyp gibt es keine echten Bilder oder Videos."
- Beide Feeds enden mit „Ende des simulierten Feeds."

---

## 5. Typografie, Abstände, Radien, Elevation

### Typografie

| Aspekt | Wert | Fundstelle |
| --- | --- | --- |
| Schriftfamilie | `--font-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif` | `@theme inline` |
| Basisgröße | `body { font-size: 1rem }` – alles skaliert in `rem` und folgt damit der Browser-Schriftgröße | `@layer base` |
| Zeilenhöhe Fließtext | `1.55` | `@layer base` |
| Zeilenhöhe Überschriften | `1.25` plus `text-wrap: balance` für `h1`–`h4` | `@layer base` |
| Font-Smoothing | `-webkit-font-smoothing: antialiased`, `-webkit-text-size-adjust: 100%` | `@layer base` |
| Formularelemente | `button, input, select, textarea { font: inherit; color: inherit }` | `@layer base` |

Praktisch verwendete Größenstufen:

| Rolle | Klassen | Beispiel |
| --- | --- | --- |
| Seiten-H1 | `text-2xl font-bold tracking-tight` (Landing: `text-3xl sm:text-4xl`) | Einstellungen, Übersicht, Datenschutz |
| Feed-H1 | `text-xl font-bold tracking-tight` | Visual/Discussion Feed, Post-Detail |
| Sheet-Titel | `text-lg font-semibold tracking-tight` | `Sheet` |
| Karten-Headline | `text-lg font-bold tracking-tight` | `AssistantCardBody` |
| Abschnitts-H2 | `text-base font-bold` / `text-lg font-bold tracking-tight` | Panels bzw. Settings-Gruppen |
| Beitragstext | `text-[0.9375rem] leading-relaxed` (15 px) | Post-Body, Kurzbegründung |
| Sekundärtext | `text-sm text-muted` | überall |
| Metadaten | `text-xs text-faint` | Autorzeile, Zeitstempel |
| `FieldLabel` | `text-xs font-bold uppercase tracking-wide text-faint` | Abschnittsköpfe in Karten und Sheets |
| Mikro-Label | `text-[0.6875rem]` (11 px) | Logo-Unterzeile, Mobile-Nav, Timeline-Achse |
| Zahlenwerte | zusätzlich `tabular-nums`, Zeitangaben `font-mono tabular-nums` | Übersicht, Timeline |

### Abstände

Es gibt kein eigenes Spacing-Token; die Tailwind-Standardskala wird benutzt, aber mit
festen Rhythmen:

| Rhythmus | Wert | Verwendung |
| --- | --- | --- |
| Innenabstand Panel | `p-3.5` (kompakt) / `p-4` (Standard) / `p-5` (Landing-Blöcke) | `Panel` |
| Karten-Innenabstand | `px-4` horizontal durchgehend, vertikal `py-2.5`/`py-3` | Post-Karten |
| Abschnittsabstand in Karten | `space-y-5` | `AssistantCardBody`, `OwnReactionControl`-Sheet |
| Listenabstand Feed | `space-y-5` | Feed-Seiten |
| Abstand Seitenabschnitte | `mt-6` / `mt-8` | Settings, Privacy, Overview, Post-Detail |
| Chip-/Button-Reihen | `gap-2` bzw. `gap-2.5` / `gap-3` | überall |
| Hauptbereich | `px-4 pb-28 pt-4 md:pb-12` – `pb-28` reserviert Platz für die Mobile-Bottom-Nav | `AppShell` |

### Radien

| Token / Klasse | Wert | Verwendung |
| --- | --- | --- |
| `--radius-panel` | `1rem` | `Panel`, Post-Karten (`rounded-[var(--radius-panel)]`) |
| `--radius-sheet` | `1.25rem` | `Sheet`: mobil `rounded-t-[…]`, ab `sm` allseitig |
| `rounded-lg` | `0.5rem` | Buttons, Links, Eingabefelder |
| `rounded-xl` | `0.75rem` | `Toggle`-Container, `FeedModeSwitch`-Tabs, Fieldsets, Icon-Kacheln, Medien-Platzhalter |
| `rounded-full` | – | Chips, Reaktions-Buttons, Avatare, Fortschritts-/Confidence-Balken |
| Fokusring | `border-radius: 0.25rem` in der `:focus-visible`-Regel | global |

### Elevation

Es gibt genau **eine** Schattenstufe:

```css
.panel-shadow {
  box-shadow:
    0 1px 2px rgb(var(--cl-shadow) / 0.06),
    0 8px 24px -12px rgb(var(--cl-shadow) / 0.14);
}
```

Sie wird ausschließlich vom `Sheet` benutzt. Alle anderen Flächen werden über
Rahmen (`border-line`, `border-assist-line`) statt über Schatten getrennt. Im
Dunkelmodus ist `--cl-shadow: 0 0 0`, der Schatten wird also zu schwarzem Nebel
statt zu einem farbigen Schlagschatten.

Zusätzliche Ebenen-Kontrolle über `z-index`:

| Ebene | z-index | Element |
| --- | --- | --- |
| Skip-Link (fokussiert) | `z-50` | `AppShell` |
| Sheet (Backdrop + Dialog) | `z-50` | `Sheet` |
| Sticky Header | `z-30` | `AppShell` |
| Mobile Bottom-Nav | `z-30` | `AppShell` |

---

## 6. Komponenten-Inventar

### 6.1 `Button` — `src/components/primitives.tsx`

**Zweck:** einziger Button-Baustein für Aktionen. Rendert immer ein echtes
`<button>` mit `type="button"` als Default.

| Prop | Werte | Default |
| --- | --- | --- |
| `variant` | `primary`, `assist`, `secondary`, `ghost`, `danger` | `secondary` |
| `size` | `sm`, `md`, `lg` | `md` |
| `fullWidth` | `boolean` | – |
| … | alle `ButtonHTMLAttributes<HTMLButtonElement>` | – |

| Variante | Klassen | Einsatz |
| --- | --- | --- |
| `primary` | `bg-ink text-inverse hover:opacity-90` | derzeit nirgends aktiv verwendet |
| `assist` | `bg-assist text-assist-on hover:bg-assist-strong` | Hauptaktion der Assistenzschicht (Demo starten, Weiter, Export, Bewertung speichern) |
| `secondary` | `bg-surface text-ink border-line-strong hover:bg-surface-2` | Standardaktion |
| `ghost` | `bg-transparent border-transparent hover:bg-surface-2` | Zurück-Links, Onboarding-„Zurück" |
| `danger` | `bg-surface text-alert border-alert/50 hover:bg-alert-tint font-semibold` | Löschen, Angabe entfernen |

| Größe | Klassen |
| --- | --- |
| `sm` | `text-sm px-3 py-1.5 gap-1.5` |
| `md` | `text-sm px-4 py-2 gap-2` |
| `lg` | `text-base px-5 py-2.5 gap-2` |

| Zustand | Verhalten |
| --- | --- |
| default | siehe Varianten-Tabelle |
| hover | `transition-colors`, variantenspezifisch |
| focus | globaler `:focus-visible`-Ring (3 px `--cl-focus`, Offset 2 px) |
| active | keine gesonderte Behandlung |
| disabled | `disabled:cursor-not-allowed disabled:opacity-50` (Onboarding „Zurück" auf Schritt 1, Research-Exporte ohne Ergebnisse, „Bewertung speichern" bis alle vier Fragen beantwortet sind) |

Icons werden als Kind übergeben und tragen immer `aria-hidden="true"`; das Label
steht als Text daneben.

### 6.2 `Chip` — `src/components/primitives.tsx`

**Zweck:** Inline-Status-Pille. Enthält laut Kommentar **immer lesbaren Text**, nie
nur ein Icon.

| Prop | Werte | Default |
| --- | --- | --- |
| `tone` (`ChipTone`) | `assist`, `info`, `positive`, `caution`, `alert`, `neutral`, `sim` | `neutral` |
| `icon` | `ReactNode` (optional) | – |
| `children` | Text | erforderlich |

| Ton | Klassen |
| --- | --- |
| `assist` | `bg-assist-tint text-assist-strong border-assist-line` |
| `info` | `bg-info-tint text-info border-info/30` |
| `positive` | `bg-positive-tint text-positive border-positive/30` |
| `caution` | `bg-caution-tint text-caution border-caution/40` |
| `alert` | `bg-alert-tint text-alert border-alert/40` |
| `neutral` | `bg-neutral-tint text-neutral-ink border-line-strong` |
| `sim` | `bg-sim-tint text-sim border-sim-line` |

Basis: `inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs
font-semibold leading-tight`. Der Chip ist nicht interaktiv, hat also keine Hover-,
Focus- oder Disabled-Zustände.

### 6.3 `SimulatedBadge` — `src/components/primitives.tsx`

**Zweck:** Markiert alles vom Prototyp Erfundene.

| Prop | Typ | Default |
| --- | --- | --- |
| `label` | `string` | `'Simuliert'` |
| `className` | `string` | `''` |

Implementiert als `<Chip tone="sim" icon={<FlaskConical className="size-3.5" />}>`.
Ein einziger Zustand. Siehe Abschnitt 4 für die Einsatzorte.

### 6.4 `Panel` — `src/components/primitives.tsx`

**Zweck:** Flächen-Container mit `--radius-panel` und einem Rahmen.

| Prop | Werte | Default |
| --- | --- | --- |
| `variant` | `plain`, `assist`, `muted` | `plain` |
| `as` | `div`, `section`, `article`, `aside` | `div` |
| `className` | `string` | `''` |

| Variante | Klassen | Bedeutung |
| --- | --- | --- |
| `plain` | `bg-surface border-line` | neutraler Inhaltsblock |
| `assist` | `bg-assist-tint border-assist-line` | gehört zur Assistenzschicht |
| `muted` | `bg-surface-2 border-line` | zurückgenommen: Grenzen-Block, Hinweise, „nicht verfügbar"-Zustände |

Kein Padding im Default – Padding wird über `className` gesetzt (`p-3.5`, `p-4`, `p-5`).

### 6.5 `FieldLabel` — `src/components/primitives.tsx`

**Zweck:** Abschnittskopf innerhalb von Karten und Sheets. Rendert ein `<h3>` mit
`text-xs font-bold uppercase tracking-wide text-faint` und optionalem Icon
(`icon`-Prop, immer `aria-hidden`). Keine Varianten, keine Zustände.

### 6.6 `DefinitionRow` — `src/components/primitives.tsx`

**Zweck:** Schlüssel/Wert-Zeile überall dort, wo Schätzung und Selbstauskunft
gemeinsam erscheinen. Der Kommentar im Code nennt den Grund: „Keeping it in one
component is what guarantees the two never merge visually."

| Prop | Werte | Default |
| --- | --- | --- |
| `term` | `string` (wird `<dt>`) | erforderlich |
| `children` | `ReactNode` (wird `<dd>`) | erforderlich |
| `tone` | `plain`, `assist`, `self` | `plain` |

| Ton | Linke Akzentlinie | Bedeutung |
| --- | --- | --- |
| `plain` | `border-line` | neutral |
| `assist` | `border-assist` | Maschinenschätzung |
| `self` | `border-info` | Angabe der Person |

Layout: `border-l-2 … pl-3`, `dt` = `text-xs font-semibold uppercase tracking-wide
text-faint`, `dd` = `text-sm font-medium text-ink`.

### 6.7 `Sheet` — `src/components/Sheet.tsx`

**Zweck:** Zugänglicher Dialog. Mobil Bottom-Sheet, ab `sm` zentriertes Panel.
Bewusst handgebaut statt `<dialog>`, damit sich das Fokusverhalten im Browser und
in jsdom identisch verhält (die Tests prüfen es).

| Prop | Typ | Bedeutung |
| --- | --- | --- |
| `open` | `boolean` | bei `false` wird `null` gerendert |
| `onClose` | `() => void` | Escape, Backdrop-Klick, Schließen-Button |
| `title` | `string` | wird `<h2>` und `aria-labelledby` |
| `description` | `string?` | wird `aria-describedby` |
| `children` | `ReactNode` | scrollbarer Inhaltsbereich |
| `footer` | `ReactNode?` | klebrige Aktionszeile unten (`border-t bg-surface-2`) |
| `titleAdornment` | `ReactNode?` | Element neben dem Titel, in der Praxis `<SimulatedBadge label="simuliert" />` |

ARIA und Verhalten:

| Aspekt | Umsetzung |
| --- | --- |
| Rolle | `role="dialog" aria-modal="true"`, `tabIndex={-1}` am Panel |
| Fokus rein | beim Öffnen auf das erste fokussierbare Element, sonst auf das Panel |
| Fokusfalle | `Tab`/`Shift+Tab` zykliert innerhalb des Panels (Keydown-Listener in der Capture-Phase) |
| Fokus zurück | Cleanup-Effekt fokussiert das zuvor aktive Element |
| Escape | schließt und stoppt die Propagation |
| Backdrop | `bg-black/45`, `aria-hidden="true"`, Klick schließt |
| Scroll-Lock | `document.body.style.overflow = 'hidden'`, alter Wert wird wiederhergestellt |
| Höhe | `max-h-[90dvh]`, Inhalt `overflow-y-auto` |
| Assistenz-Marke | 6 px `bg-assist`-Oberkante, `aria-hidden` |
| Schließen-Button | Icon **und** Text „Schließen" |

Zustände: nur `open` / geschlossen; `footer` und `titleAdornment` optional.

### 6.8 `Toggle` — `src/components/Toggle.tsx`

**Zweck:** Einwilligungsschalter. Basiert auf einem echten
`<input type="checkbox" role="switch">`; Track und Knopf sind rein dekorativ
(`aria-hidden`) darübergezeichnet.

| Prop | Typ |
| --- | --- |
| `checked` | `boolean` |
| `onChange` | `(next: boolean) => void` |
| `label` | `string` (mit `htmlFor` verbunden) |
| `description` | `ReactNode?` |
| `activeNote` | `ReactNode?` – Zusatzhinweis nur wenn `checked` |
| `disabled` | `boolean` (Default `false`) |
| `disabledReason` | `string?` – Text in `text-caution` |

| Zustand | Darstellung |
| --- | --- |
| **unchecked** | Container `border-line bg-surface`; Track `border-line-strong bg-surface-3`; Knopf links, `Minus`-Glyphe; Statuszeile „INAKTIV" |
| **checked** | Container `border-assist-line bg-assist-tint`; Track `border-assist bg-assist`; Knopf rechts (`translate-x-[1.375rem]`), `Check`-Glyphe; Statuszeile „AKTIV"; optional `activeNote` in einem `bg-surface`-Kasten |
| **disabled** | `opacity-60`, `cursor-not-allowed`; `disabledReason` als `text-caution`-Absatz |
| **focus** | globaler `:focus-visible`-Ring auf dem echten Checkbox-Element |
| **hover** | keine eigene Hover-Behandlung; `transition-colors` am Container |

Barrierefreiheit: `aria-describedby` verweist auf den Block mit Beschreibung,
Deaktivierungsgrund und Aktivnotiz. Der Zustand ist dreifach kodiert – Position,
Glyphe (`Check`/`Minus`) und Wort („Aktiv"/„Inaktiv").

### 6.9 `ConfidenceMeter` — `src/components/ConfidenceMeter.tsx`

**Zweck:** Unsicherheit einer Analyse. Drei Kanäle transportieren denselben Wert:
Wort, Stufenzahl, Balken. Farbe ist laut Kommentar der unwichtigste Kanal.

| Prop | Typ | Default |
| --- | --- | --- |
| `confidence` | `'low' \| 'medium' \| 'high'` | erforderlich |
| `showSentence` | `boolean` | `true` |

| Wert | Wort (`CONFIDENCE_LABEL`) | Stufen (`CONFIDENCE_STEPS`) | Balkenfarbe |
| --- | --- | --- | --- |
| `low` | niedrig | 1 von 3 | `bg-caution` |
| `medium` | mittel | 2 von 3 | `bg-info` |
| `high` | hoch | 3 von 3 | `bg-positive` |

Nicht gefüllte Stufen: `bg-surface-3`. Der Balkenblock ist `role="img"` mit
`aria-label="Sicherheit {Wort}, {n} von 3 Stufen"`. Bei `showSentence` folgt ein
Satz aus `CONFIDENCE_SENTENCE` mit `CircleHelp`-Icon.

### 6.10 `StatusBar` — `src/components/StatusBar.tsx`

**Zweck:** Dauerhafter Statusstreifen unter dem Header. Beantwortet jederzeit vier
Fragen, ohne dass man in die Einstellungen muss. Container: `border-t border-line
bg-surface-2`, innen `max-w-6xl`.

| Chip | Bedingung | Ton | Icon | Text |
| --- | --- | --- | --- | --- |
| Analyse | `assistantPaused` | `caution` | `Pause` | „Assistent pausiert" |
| Analyse | `contentAnalysis && !paused` | `assist` | `ScanText` | „Inhaltsanalyse aktiv" |
| Analyse | sonst | `neutral` | `ScanText` | „Inhaltsanalyse aus" |
| Kamera | `simulatedCameraCapture && !paused` | `caution` | `Camera` | „Simulierte Kamera aktiv" |
| Kamera | sonst | `neutral` | `CameraOff` | „Kamera aus" |
| Speicher | `storeReactionHistory` | `neutral` | `HardDrive` | „Speicherung: nur lokal" |
| Speicher | sonst | `neutral` | `HardDrive` | „Keine Speicherung" |

Der Kamera-Chip ist laut Codekommentar der wichtigste: Eine ausgeschaltete Kamera
wird **ausgesprochen**, nicht bloß impliziert. Rechts ein Link „Status ändern" nach
`/settings`. Vorangestellt: `<span class="sr-only">Aktueller Status der
Assistenzfunktionen:</span>`.

### 6.11 `Logo` — `src/components/Logo.tsx`

| Prop | Typ | Default |
| --- | --- | --- |
| `asLink` | `boolean` | `true` (Link nach `/`) |

Aufbau: `size-8`-Kachel `rounded-lg bg-assist text-assist-on` mit einem Inline-SVG
(Außenring `r=8` + Fokuspunkt `r=2.5`) als Linse, daneben „ContextLens" (`text-sm
font-bold`) und die permanente Unterzeile „Prototyp · simulierte Daten"
(`text-[0.6875rem] text-faint`). Bewusst aus Tokens gezeichnet statt als Bilddatei,
damit es dem Farbschema folgt. Zustände: `hover:opacity-80` nur als Link.

### 6.12 `ContextAssistantButton` — `src/features/context-assistant/ContextAssistantButton.tsx`

**Zweck:** Die „Kontext erklären"-Affordanz. Klein und leise gehalten – bis zum
Antippen ist von der Analyse nichts zu sehen.

| Prop | Typ | Default |
| --- | --- | --- |
| `postId` | `string` | erforderlich |
| `label` | `string` | `'Kontext erklären'` |
| `size` | `'default' \| 'inline'` | `'default'` |
| `onOpened` | `() => void` | – (Feeds protokollieren damit `recordView(postId, true)`) |

| Zustand | Ergebnis von `resolveAnalysis` | Darstellung |
| --- | --- | --- |
| **kein Eintrag** | `status: 'none'` | Komponente rendert `null` – keine tote Affordanz |
| **verfügbar** | `status: 'available'` | Button; Sheet mit `VARIANT_TITLE[variant]` als Titel und `AssistantCardBody` |
| **abgeschaltet** | `status: 'disabled'`, `reason` ∈ `paused`, `analysis-off`, `sarcasm-off`, `ragebait-off` | Sheet-Titel „Hinweis nicht verfügbar", `Panel variant="muted"` mit Erklärungstext aus `DISABLED_COPY` **und** Button „Zu den Einstellungen" |

Stil: `border-assist-line bg-assist-tint text-assist-strong hover:bg-assist-tint-2`
mit `Sparkles`-Icon; `inline` ist die kompakte Fassung (`text-xs`, `px-2 py-1`,
`size-3.5`-Icon) für Kommentare.

### 6.13 `AssistantCardBody` — `src/features/context-assistant/AssistantCardBody.tsx`

**Zweck:** Inhalt der Assistenzkarte. Wird im Feed innerhalb eines `Sheet` gerendert
und auf der Detailseite inline in einem `Panel variant="assist"`.

| Prop | Typ |
| --- | --- |
| `analysis` | `ContentAnalysis` |
| `variant` | `AssistantCardVariant` |

Feste Reihenfolge (`space-y-5`):

| # | Block | Bedingung | Bausteine |
| --- | --- | --- | --- |
| 1 | Überschrift | immer | Varianten-Icon in `size-10 rounded-xl bg-assist-tint`, `VARIANT_TITLE`, `Chip` im Varianten-Ton mit „Interpretation, keine Tatsache", `VARIANT_SUBTITLE` |
| 2 | Sicherheit | immer | `Panel variant="muted"` + `ConfidenceMeter` |
| 3 | Kurze Begründung | immer | `FieldLabel` + `analysis.explanation`; optional „Mögliche Absicht" mit `border-l-2 border-assist` |
| 4 | „Warum wird das so eingeschätzt?" | auf Klick | `Button` mit `aria-expanded`; öffnet `Panel variant="assist"` mit `analysis.indicators`; bei leerer Liste ein erklärender Satz; immer Fußnote „In diesem Prototyp sind diese Punkte vorab geschrieben." |
| 5 | Sichtbare/hörbare Signale | nur wenn `visibleFacialExpression` oder `toneOfVoice` vorhanden | `<dl>` mit `border-l-2 border-line` |
| 6 | Emotionalisierende Formulierungen | nur wenn `emotionalLanguage.present` | Liste aus `Chip tone="caution"` |
| 7 | Polarisierung | `mayShowPolarisation(settings)` **und** (`polarizationLevel !== 'low'` oder `possibleRagebait`) | Chip „Grad: …" (`alert` bei `high`, sonst `caution`), optional Chip „Könnte auf Reaktionen ausgerichtet sein", Sätze aus `POLARIZATION_SENTENCE` |
| 8 | Grenzen | **immer** | `Panel variant="muted"`, `analysis.limitations` |
| 9 | Andere Lesarten | erst nach „Andere Interpretation" | `analysis.alternativeReadings` mit `bg-info`-Punkten |
| 10 | Feedback | immer | Buttons „Nicht hilfreich" und „Andere Interpretation"; Bestätigung in `<p role="status">`; abschließend `SimulatedBadge` |

### 6.14 `VisualPostCard` — `src/features/feed/VisualPostCard.tsx`

**Zweck:** Beitrag im Visual Feed. Die Struktur folgt bewusst den Konventionen
einer Foto-Sharing-Oberfläche, damit Testpersonen das Format sofort
wiedererkennen und ihre Aufmerksamkeit der Assistenzschicht widmen statt einer
unbekannten UI. Kopiert wird nur die **Struktur** — keine Logos, keine
Markennamen, keine übernommene Ikonografie, erfundene Konten und Zahlen.

| Prop | Typ |
| --- | --- |
| `post` | `Post` |

Aufbau von oben nach unten:

1. `<header>`: Initialen-Avatar mit Verlaufsring aus `media.palette`
   (`aria-hidden`, keine erfundene Person abgebildet), Handle fett, Klarname
   darunter, rechts ein `MoreHorizontal`-Button mit `aria-label` und dem
   ausdrücklichen Zusatz „im Prototyp ohne Funktion".
2. `MediaPlaceholder` mit `variant="feed"` — randlos, Seitenverhältnis 4∶5,
   darin als Overlay unten links das `OwnReactionControl`.
3. **Aktionszeile**: Herz (`aria-pressed`, füllt sich, zählt hoch),
   Sprechblase als Link zur Detailseite, `Send` (ohne Funktion, so benannt),
   rechts abgesetzt `Bookmark` (`aria-pressed`). Alle Icon-Buttons tragen ein
   `aria-label`; Herz und Sprechblase zeigen ihre Zahl zusätzlich als Text.
4. **Bildunterschrift**: Handle fett, direkt gefolgt vom Beitragstext. Ab
   120 Zeichen `line-clamp-2` mit „… mehr anzeigen".
5. Link „Alle N Kommentare ansehen", darunter der Zeitstempel in
   `text-[0.6875rem] uppercase tracking-wide`.
6. **Assistenzstreifen** `border-t border-assist-line bg-assist-tint/50` mit
   `ContextAssistantButton` und Link zur Detailseite („Reaktionsverlauf", wenn
   eine Timeline existiert, sonst „Reaktionen") sowie – nur bei Beiträgen ohne
   Medium – dem inline `OwnReactionControl`.

Lokaler Zustand: `liked`, `saved`, `captionExpanded`. Bewusst nicht persistiert —
es sind Plattform-Kulissen, keine Forschungsdaten.

Nebenwirkung: `recordView(post.id, false)` genau einmal pro Mount (Ref-Guard).

**Randlos auf dem Telefon:** `border-y` plus `sm:rounded-[var(--radius-panel)]
sm:border-x`; die Feed-Seite hebt dafür das Seitenpadding mit `-mx-4 sm:mx-0`
auf.

### 6.15 `DiscussionPostCard` — `src/features/feed/DiscussionPostCard.tsx`

**Zweck:** Beitrag im Discussion Feed samt Kommentarbaum. Form an Forensoftware
angelehnt (Community-Label, Headline, Text, gerankte Kommentare), ohne eine
konkrete Seite nachzubauen.

| Prop | Typ | Default |
| --- | --- | --- |
| `post` | `Post` | erforderlich |
| `showAllComments` | `boolean` | `false` – im Feed nur die ersten 2 Kommentare |

| Zustand | Darstellung |
| --- | --- |
| Feed (`showAllComments=false`) | 2 Kommentare, darunter Link „n weitere Kommentare anzeigen" (mit korrekter Ein-/Mehrzahl) |
| Detailseite (`showAllComments=true`) | alle Kommentare, kein „weitere"-Link |
| Kommentar mit `hasAnalysis` | zusätzlich ein `ContextAssistantButton size="inline"` auf die Kommentar-ID |
| ohne Kommentare | Kommentarsektion entfällt vollständig |

Assistenzstreifen hier mit `border-y border-assist-line`, weil darunter noch die
Kommentare folgen. Zustimmungen mit `ArrowBigUp` statt Herz, `sr-only`
„Zustimmungen".

### 6.16 `MediaPlaceholder` — `src/features/feed/MediaPlaceholder.tsx`

**Zweck:** Platzhalter für Foto oder Video. Statt einer grauen Box ein beschriftetes
Element, das erzählt, was der Clip zeigen *würde*.

| Prop | Typ |
| --- | --- |
| `media` | `SimulatedMedia` |
| `onTimeChange` | `(seconds: number) => void` (optional) |
| `children` | Overlay-Inhalt, in der Praxis `OwnReactionControl` |
| `variant` | `'feed'` (randlos, 4∶5) · `'detail'` (gerahmt, 4∶5, ab `sm` 16∶9) |

| Element | Umsetzung |
| --- | --- |
| Hintergrund | `linear-gradient` aus `media.palette[0/1]` (Inline-Style aus den Daten) |
| Schraffur | `.sim-hatch`-Overlay, `aria-hidden` |
| Dauer-Chip | oben links, `Video`-Icon + Laufzeit `mm:ss` auf `bg-black/50` (nur Video) |
| Simulationsmarke | oben rechts, „SIMULIERTER PLATZHALTER" in Versalien auf `bg-black/50` |
| Beschreibung | `media.altText` als **sichtbarer Text**, mittig, weiß mit `text-shadow`, nicht als verstecktes Alt-Attribut |
| Overlay-Slot | unten links, `pointer-events-none` am Container und `pointer-events-auto` am Kind, damit ein leerer Slot nichts abfängt |
| `figcaption` | `sr-only`, wiederholt Simulationshinweis **und** Beschreibung |

| Zustand | Bedingung | Darstellung |
| --- | --- | --- |
| Bild | `kind === 'image'` | keine Wiedergabeleiste |
| Video | `kind === 'video' && duration > 0` | Steuerleiste **unter** dem Medium auf `bg-black/85`: Play/Pause (Icon + Wort), `<input type="range">` mit `sr-only`-Label „Wiedergabeposition im simulierten Video", Zeitanzeige `mm:ss / mm:ss` in `font-mono tabular-nums` |
| Wiedergabe | über `useSimulatedPlayback` | Timer mit 250 ms Takt; bei `prefers-reduced-motion` wird nicht automatisch vorgespult, das Scrubben bleibt möglich |

### 6.16a `StoriesRow` — `src/features/feed/StoriesRow.tsx`

**Zweck:** Horizontaler Kurzbeitrags-Streifen am Kopf des Visual Feed. Reine
Kulisse, damit der Feed auf den ersten Blick als vertraute Foto-Oberfläche
gelesen wird.

**Bewusst nicht interaktiv.** Buttons hier würden fünf funktionslose
Bedienelemente in den Tastaturpfad legen; ein Steuerelement, das nichts tut, ist
schlechter als keines. Die Liste ist `aria-hidden` und wird für
Screenreader-Nutzende durch **einen** erklärenden Satz ersetzt.

Aufbau: erster Eintrag „Dein Beitrag" als gestrichelter Ring, danach je Beitrag
ein Initialen-Kreis mit Verlaufsring aus `media.palette`. Horizontal scrollbar,
Scrollbalken ausgeblendet.

### 6.17 `FeedModeSwitch` — `src/features/feed/FeedModeSwitch.tsx`

**Zweck:** Wechsel zwischen den beiden simulierten Inhaltsansichten. Bewusst zwei
sichtbare Tabs statt eines Toggles, damit der zweite Modus auffindbar ist, ohne ihn
erst zu bedienen.

| Ziel | Label | Hinweis | Icon |
| --- | --- | --- | --- |
| `/feed/visual` | Visual Feed | Kurzvideos und Bilder | `Images` |
| `/feed/discussion` | Discussion Feed | Textbeiträge und Threads | `MessagesSquare` |

| Zustand | Darstellung |
| --- | --- |
| aktiv | `border-assist bg-assist-tint`, Icon und Label in `text-assist-strong`, zusätzlich das Wort **„aktiv"** als Text rechts |
| inaktiv | `border-line bg-surface`, Icon `text-muted`, Label `text-ink` |
| hover | `hover:bg-surface-2` |
| focus | globaler Ring |

Wrapper: `<nav aria-label="Ansicht wechseln">` mit `<ul>`, Tabs `flex-1` – auf jedem
Viewport zwei gleich breite Spalten.

### 6.18 `OwnReactionControl` — `src/features/reactions/OwnReactionControl.tsx`

**Zweck:** Die eigene Reaktion: ein leiser Chip plus Korrektur-Sheet. Erzwingt zwei
Regeln: (1) Schätzung und Selbstauskunft stehen immer als zwei getrennt beschriftete
Zeilen nebeneinander, eine Korrektur überschreibt die Schätzung nie; (2) die
Schätzung beschreibt Sichtbares (`EXPRESSION_LABEL`), nur die Selbstauskunft benutzt
Gefühlswörter (`SELF_REPORT_LABEL`).

| Prop | Werte | Default |
| --- | --- | --- |
| `postId` | `string` | erforderlich |
| `placement` | `'overlay'`, `'inline'` | `'inline'` |

| Zustand | Darstellung |
| --- | --- |
| **Funktion aus** (`!simulatedCameraCapture` oder `assistantPaused`) | rendert `null` – es gibt keinen Codepfad, der ohne diesen Schalter eine Schätzung erzeugt |
| **Schätzung, keine Angabe** | Chip „Geschätzt: {sichtbarer Ausdruck}" mit `ScanFace` und `Pencil` |
| **Eigene Angabe vorhanden** | Chip „Deine Angabe: {Reaktionswort}" |
| `placement="overlay"` | `bg-black/60 text-white rounded-full`, sitzt auf dem Medium |
| `placement="inline"` | `border-line bg-surface-2 text-muted hover:bg-surface-3` |

Sheet „Deine Reaktion":

| Block | Inhalt |
| --- | --- |
| Vergleich | `Panel variant="muted"` mit zwei `DefinitionRow`: „Automatisch geschätzter Ausdruck" (`tone="assist"`, inkl. „Sicherheit n %") und „Von dir angegebene Reaktion" (`tone="self"`, `text-info`; leer: „Noch keine Angabe gemacht" in `text-faint`) |
| Vorrang-Hinweis | erscheint nur, wenn eine Selbstauskunft existiert: „Deine Angabe hat Vorrang …" |
| Auswahl | 9 Buttons in `SELF_REPORT_ORDER` mit `aria-pressed`; aktiv = `border-info bg-info-tint text-info` **plus** vorangestelltes „✓ " |
| Freitext | nur bei `other`: beschriftetes `<input>` mit `maxLength={80}`, Speichern auf `blur`; das Sheet bleibt bei `other` offen |
| Zurücknehmen | nur bei vorhandener Angabe: `Button variant="danger"` „Meine Angabe entfernen" |
| Kamera-Hinweis | `Panel` mit `CameraOff`: „keine echte Kamera ausgewertet" |
| Weitergabe | `Chip tone="caution"` „Anonyme Weitergabe ist aktiv …" bzw. `Chip tone="neutral"` „… ist ausgeschaltet" |

### 6.19 `CameraPreview` — `src/features/reactions/CameraPreview.tsx`

**Zweck:** Optionale lokale Kamera-Vorschau (Stretch Goal). Strikt nur Anzeige: der
Stream hängt an einem `<video>` und sonst nirgends – kein Canvas, kein `drawImage`,
kein `MediaRecorder`, kein Upload; beim Beenden oder Unmount werden alle Tracks
gestoppt, damit die Kamera-Anzeige des Browsers ausgeht, wenn die UI „aus" sagt.

| Zustand | Darstellung |
| --- | --- |
| **aus** (Default) | `Chip tone="neutral"` + `CameraOff` „Kamera aus"; Platzhalterfläche „Die Vorschau ist aus. Du musst sie ausdrücklich starten."; `Button variant="assist"` „Vorschau starten" |
| **an** | `Chip tone="caution"` + `Camera` „Kamera läuft"; sichtbares `<video autoPlay muted playsInline aria-hidden>`; `Button` „Vorschau beenden" |
| **Fehler** | `<p role="status">` auf `bg-caution-tint text-caution` mit `CircleAlert`; ein einziger, nicht technischer Text (deckt Ablehnung, fehlendes Gerät und belegtes Gerät gleichermaßen ab) |
| **kein API-Support** | derselbe Fehlerkanal: „Dieser Browser stellt keine Kamera-Vorschau bereit." |

Wird nur auf `/settings` gerendert, und dort nur wenn `settings.liveCameraPreview`
gesetzt ist (was wiederum `simulatedCameraCapture` voraussetzt).

### 6.20 `CommunityReactions` — `src/features/analytics/CommunityReactions.tsx`

**Zweck:** Aggregierte Community-Reaktionen zu einem Beitrag. Der Quellenschalter ist
das Herzstück: Kamera-Schätzungen und aktive Selbstauskünfte sind zwei verschiedene
Behauptungen über zwei verschiedene Dinge und bekommen deshalb zwei Datensätze, zwei
Teilnehmerzahlen und einen Umschalter statt eines gestapelten Diagramms.

| Prop | Typ |
| --- | --- |
| `summary` | `CommunityReactionSummary` |

| Zustand | Darstellung |
| --- | --- |
| `source = 'estimated'` (Default) | Balken in `var(--cl-assist)`; Teilnehmerzahl `participantCount`; Erklärtext „Automatische Schätzungen: … Diese Werte können falsch sein" |
| `source = 'self-reported'` | Balken in `var(--cl-info)`; Zahl `selfReportedParticipantCount` „(von N insgesamt)"; Erklärtext „Aktive Selbstauskünfte: … Weniger Daten, aber von Menschen bestätigt" |
| Kategorie `unclear` | immer `var(--cl-border-strong)` – „nicht eindeutig" ist keine Reaktion und teilt sich nicht die Datenfarbe |

Umschalter: `role="radiogroup"` mit zwei `role="radio"`-Buttons, `aria-checked`,
aktiv = `border-assist bg-assist-tint text-assist-strong` plus `sr-only`
„(ausgewählt)".

Diagramm: horizontales `recharts`-`BarChart`, `isAnimationActive={false}`, jeder
Balken mit Prozent-`LabelList` rechts und Kategoriename an der Y-Achse. Der
Chart-Container ist `aria-hidden="true"`; direkt davor steht eine **`sr-only`-Tabelle**
mit `<caption>`, Spaltenköpfen „Reaktion" / „Anteil in Prozent" und `<th scope="row">`
je Zeile. Höhe wird aus der Datenmenge berechnet (`data.length * 38 + 10`).

Am Fuß: `FieldLabel` „Woher kommen diese Zahlen?" mit `summary.sourceExplanation`
und ein `Chip tone="caution"` mit `summary.representativeWarning`.

### 6.21 `ReactionTimeline` — `src/features/analytics/ReactionTimeline.tsx`

**Zweck:** Simulierter Reaktionsverlauf über die Länge eines Videos. Sitzt auf der
Detailseite unter der Wiedergabeleiste, damit die Bänder mit der Zeitachse
korrespondieren.

| Prop | Typ |
| --- | --- |
| `segments` | `ReactionTimelineSegment[]` |
| `durationSeconds` | `number` |
| `currentTime` | `number?` |

Farben pro Ausdruck (`SEGMENT_COLOR`, nie das einzige Signal):

| Ausdruck | Farbe |
| --- | --- |
| `smile` | `var(--cl-positive)` |
| `surprise` | `var(--cl-info)` |
| `tense` | `var(--cl-caution)` |
| `neutral` | `var(--cl-border-strong)` |
| `unclear` | `var(--cl-neutral)` |

| Zustand | Darstellung |
| --- | --- |
| Band | `role="img"` mit `aria-label`, das jeden Abschnitt als „mm:ss bis mm:ss Label" aufzählt; Segmentbreite proportional zur Dauer; Labeltext liegt sichtbar im Segment |
| aktives Segment | `ring-2 ring-inset ring-ink` **plus** ein `<p role="status">` „Bei mm:ss: geschätzter Ausdruck …, Sicherheit n %" |
| kein `currentTime` | kein Ring, kein Statussatz |
| Legende | immer: farbiges Quadrat (`aria-hidden`), Zeitspanne, Label, Ausdruck und Sicherheit als Text |

Kopfzeile mit `Timer`-Icon, Überschrift und `SimulatedBadge label="erfundener
Verlauf"`; Fuß mit `Chip tone="caution"` „Ein Ausdruck kann viele Ursachen haben.
Dieser Verlauf beweist nichts über dein Empfinden."

### 6.22 `AppShell` — `src/app/AppShell.tsx`

**Zweck:** Gemeinsames Chrome aller Bildschirme innerhalb der Demo. Das Chrome gehört
zur **Assistenzschicht**, nicht zur simulierten Plattform.

| Bereich | Umsetzung |
| --- | --- |
| Skip-Link | `<a href="#main" class="sr-only-focusable …">Direkt zum Inhalt springen</a>`, `z-50`, `bg-assist text-assist-on` – nur bei Fokus sichtbar |
| Header | `sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur`, innen `max-w-6xl` |
| Logo | links, `Logo` als Link nach `/` |
| Desktop-Nav | `hidden md:block`, `<nav aria-label="Hauptnavigation">`, aktiv = `bg-assist-tint text-assist-strong`, inaktiv = `text-muted hover:bg-surface-2 hover:text-ink` |
| Theme-Button | `aria-pressed={isDark}`, Icon `Sun`/`Moon` **plus** Text „Helles Design" / „Dunkles Design" |
| Statusleiste | `StatusBar` |
| Research-Banner | `ResearchBanner` (nur bei laufendem Szenario) |
| `<main id="main">` | `max-w-6xl px-4 pb-28 pt-4 md:pb-12` |
| Mobile-Nav | `fixed bottom-0 … md:hidden`, `bg-surface/98 backdrop-blur`; fünf gleich breite Einträge mit **sichtbarem Textlabel** unter dem Icon; aktiv zusätzlich durch einen Teal-Balken (`h-0.5 w-6 bg-assist`) markiert |
| Scroll-Reset | `window.scrollTo({ top: 0 })` bei jedem `location.pathname`-Wechsel |

Navigationsziele (identisch für Desktop und Mobile): `/feed/visual` (Feed),
`/overview` (Übersicht), `/privacy` (Datenschutz), `/settings` (Einstellungen),
`/research` (Research Mode).

### 6.23 `ResearchBanner` — `src/features/research-mode/ResearchBanner.tsx`

Schmaler Streifen in der `sim`-Familie (`border-t border-sim-line bg-sim-tint`,
Text `text-sim`) mit `FlaskConical`-Icon, Szenariotitel und Link „Aufgabe anzeigen".
Wird nur gerendert, wenn ein Szenario aktiv ist **und** die aktuelle Route nicht
`/research` ist.

---

## 7. Die 7 Assistenzkarten-Varianten

Quelle: `src/features/context-assistant/variantPresentation.ts`,
`src/lib/labels.ts`, `src/types/index.ts`.

| Variante | Icon (`lucide-react`) | Ton (`ChipTone`) | Titel (`VARIANT_TITLE`) | Untertitel (`VARIANT_SUBTITLE`) |
| --- | --- | --- | --- | --- |
| `sarcasm` | `MessageSquareQuote` | `caution` | Wahrscheinlich sarkastisch | Der Text ist vermutlich nicht wörtlich gemeint. |
| `irony` | `MessageCircleQuestion` | `caution` | Möglicherweise ironisch gemeint | Die Aussage könnte das Gegenteil des Gesagten meinen. |
| `emotional` | `HeartPulse` | `info` | Emotionaler Ton möglich | Die Formulierungen wirken emotional aufgeladen. |
| `exaggeration` | `Laugh` | `positive` | Möglicherweise humorvolle Übertreibung | Die Übertreibung wirkt als Witz gemeint, nicht als Tatsache. |
| `ragebait` | `Flame` | `alert` | Könnte auf Reaktionen ausgerichtet sein | Die Formulierung könnte gezielt Widerspruch und Empörung auslösen sollen. |
| `ambiguous` | `Scale` | `neutral` | Analyse nicht eindeutig | Es gibt mehrere plausible Lesarten dieses Beitrags. |
| `insufficient-context` | `ScanSearch` | `neutral` | Zu wenig Kontext für eine Einschätzung | Für eine belastbare Einschätzung fehlen Text, Ton oder Kontext. |

Die Farbe ist hier **bewusst redundant**: Jede Karte zeigt den Variantentitel als
Text und ein Icon mit eigener Silhouette. Der Ton ist nie der einzige Bedeutungsträger.

### Die Variante wird abgeleitet, nicht gespeichert

`deriveCardVariant(analysis)` in `src/features/simulation/mockEngine.ts` bestimmt die
Variante rein aus den Analysedaten. Sie steht nirgends neben der Analyse in den
Daten – dadurch **kann eine Überschrift ihren eigenen Daten nicht widersprechen**.

Die Reihenfolge der Regeln ist bedeutsam und wird in `mockEngine.test.ts` geprüft:

| Priorität | Bedingung | Ergebnis |
| --- | --- | --- |
| 1 | `indicators.length === 0` | `insufficient-context` |
| 2 | `possibleRagebait === true` | `ragebait` |
| 3 | `probableTone === 'sarcastic'` | `sarcasm` |
| 3 | `probableTone === 'ironic'` | `irony` |
| 4 | `probableTone === 'frustrated' \| 'aggressive'` | `emotional` |
| 5 | `probableTone === 'humorous'` | `exaggeration` |
| 6 | alles Übrige (`neutral`, `unclear`, Default) | `ambiguous` |

Die Sichtbarkeit einer Karte hängt zusätzlich von den Einstellungen ab
(`resolveAnalysis`): Bei `assistantPaused`, ausgeschalteter `contentAnalysis`,
abgewählten `sarcasmHints` (betrifft `sarcasm`/`irony`) oder abgewählten
`ragebaitHints` (betrifft `ragebait`) liefert die Funktion einen **benannten Grund**
statt `null` – die UI kann dadurch sagen, *welcher* Schalter den Hinweis
zurückhält, und direkt dorthin verlinken.

Analog leitet `deriveContentCategory()` die Kategorie für die persönliche Übersicht
ab (`humor`, `sarcasm`, `emotional`, `polarising`, `informational`) – ebenfalls
abgeleitet, nie gespeichert.

---

## 8. Barrierefreiheit als Systemregel

Diese Regeln sind nicht Empfehlungen, sondern im Code umgesetzt.

| Regel | Umsetzung | Fundstellen |
| --- | --- | --- |
| **Niemals nur Farbe** | Jeder Status trägt zusätzlich ein Icon **und** ein Wort. | `Toggle` („Aktiv"/„Inaktiv" + `Check`/`Minus`), `PrivacyPage` („aktiv"/„inaktiv"-Chips), `FeedModeSwitch` (Wort „aktiv"), `OwnReactionControl` („✓ " vor der aktiven Option), `StatusBar`, `ResearchModePage` („abgeschlossen"/„offen") |
| **Sichtbarer Fokus** | Globale `:focus-visible`-Regel: `outline: 3px solid var(--cl-focus); outline-offset: 2px`. Extra-Regel für `[tabindex='0']`. | `index.css` `@layer base` |
| **Echte Formularelemente unter gestylten Schaltern** | `Toggle` = echtes `<input type="checkbox" role="switch">`, Track/Knopf sind `aria-hidden`-Dekoration. Bewertungsskala im Research Mode = echte `<input type="radio" class="sr-only">` in `<label>`. Theme- und Hinweis-Optionen = echte Radios in `<fieldset>` mit `<legend>`. | `Toggle.tsx`, `ResearchModePage.tsx`, `SettingsPage.tsx` |
| **Icons immer mit Textlabel** | Jedes Icon trägt `aria-hidden="true"`; die Bedeutung steht im begleitenden Text. Auch die Mobile-Navigation zeigt Textlabels („Labels stay visible – icons alone are not enough"). | durchgängig; `AppShell.tsx` |
| **Reduzierte Bewegung** | `@media (prefers-reduced-motion: reduce)` setzt Animationen und Transitions auf `0.001ms` und `scroll-behavior: auto` – Bewegung wird entfernt, nicht bloß verkürzt. Zusätzlich spult `useSimulatedPlayback` dann nicht automatisch vor. | `index.css`, `useSimulatedPlayback.ts` |
| **Skalierbare Typografie** | Alles in `rem` ab `body { font-size: 1rem }`; `-webkit-text-size-adjust: 100%`. Keine `px`-Fixierung von Fließtext. | `index.css` |
| **Screenreader-Äquivalent für Diagramme** | Das Balkendiagramm ist `aria-hidden`; daneben steht eine vollständige `sr-only`-Tabelle mit `caption`, `scope="col"` und `scope="row"`. Timeline-Band und Confidence-Balken sind `role="img"` mit erschöpfendem `aria-label`. | `CommunityReactions.tsx`, `ReactionTimeline.tsx`, `ConfidenceMeter.tsx`, `OnboardingPage.tsx` (Fortschritt) |
| **Live-Rückmeldungen** | Bestätigungen laufen über `<p role="status">` mit `min-h-5`, damit kein Layoutsprung entsteht. | `AssistantCardBody`, `PrivacyPage`, `ResearchModePage`, `ReactionTimeline`, `CameraPreview` |
| **Skip-Link** | `.sr-only-focusable` blendet den Link erst bei Fokus ein (`:not(:focus):not(:focus-within)`). | `index.css`, `AppShell.tsx` |
| **Fokusmanagement im Dialog** | Fokus rein, Fokusfalle, Fokus zurück, Escape, Scroll-Lock. | `Sheet.tsx` |
| **Benannte Landmarks** | `<nav aria-label="Hauptnavigation">`, `<nav aria-label="Ansicht wechseln">`, `<section aria-labelledby="…">` auf allen längeren Seiten, `<section aria-label="Kommentare">`. | `AppShell`, `FeedModeSwitch`, Seiten |
| **Sprechende Löschen-Labels** | `aria-label={'Eintrag zu „…" löschen'}`, damit eine Liste gleichnamiger Buttons unterscheidbar bleibt. | `OverviewPage.tsx` |
| **Beschreibung statt verstecktem Alt-Text** | Die Medienbeschreibung ist sichtbarer Text – Screenreader-Nutzende bekommen dieselbe Information wie Sehende. | `MediaPlaceholder.tsx` |
| **Sinnvolle `sr-only`-Ergänzungen** | Zahlen in der Engagement-Zeile bekommen ihre Bedeutung („Gefällt-mir-Angaben", „Zustimmungen", „Kommentare"); die StatusBar wird mit einem Satz eingeleitet. | Post-Karten, `StatusBar` |
| **Sichtbare Ränder in beiden Schemata** | `* { border-color: var(--cl-border) }` als Basis, damit ein vergessener Rahmen nicht unsichtbar wird. | `index.css` |

---

## 9. Dark-Mode-Strategie

Drei Mechanismen greifen ineinander:

1. **Systemvorgabe** – `@media (prefers-color-scheme: dark)` überschreibt alle
   `--cl-*`-Werte, aber nur für `:root:not([data-theme='light'])`. Wer ausdrücklich
   „Hell" gewählt hat, bleibt hell, auch wenn das System dunkel ist.
2. **Ausdrückliche Wahl** – `[data-theme='dark']` setzt dieselben Werte noch einmal
   unabhängig vom Systemzustand. Ein eigener `[data-theme='light']`-Block ist nicht
   nötig, weil `:root` bereits die hellen Werte trägt und die Media-Query durch die
   `:not()`-Bedingung ausgeschaltet wird.
3. **Anwendung der Wahl** – `AppStateProvider` setzt bzw. entfernt das Attribut:
   bei `theme === 'system'` wird `data-theme` vom `<html>`-Element **entfernt**,
   sonst auf `'light'`/`'dark'` gesetzt.

| Aspekt | Umsetzung |
| --- | --- |
| Einstellung | `settings.theme: 'system' \| 'light' \| 'dark'`, Default `'system'`, persistiert in `localStorage` |
| Bedienung | Radiogruppe „Farbschema" auf `/settings` **und** ein Schnellschalter im Header (`aria-pressed`, Icon + Text) |
| Browser-Hinweis | `color-scheme: light` bzw. `dark` auf `:root` – Scrollbars und native Steuerelemente folgen mit |
| Umkehrung der Assistenzfarbe | Hell: dunkles Teal `#0d6e80` auf hellem Tint. Dunkel: helles Cyan `#5ed4e6` auf dunklem Tint `#0d2b33`; `assist-on` wird von Weiß zu `#062028` |
| Statusfamilien | Im Dunkelmodus pastellige Vordergründe auf sehr dunklen Tints (z. B. `alert` `#f2a0b0` auf `#33161e`) statt einfach invertierter Helligkeit |
| Schatten | `--cl-shadow` wird von `15 24 34` auf `0 0 0` gesetzt – im Dunkeln trennt der Rahmen, nicht der Schatten |
| Fokusfarbe | wechselt von `#0b4f5e` zu `#8fe3f2`, bleibt in beiden Schemata deutlich sichtbar |

Konsequenz für neue Komponenten: **Nie Rohfarben schreiben.** Wer `bg-surface`,
`text-ink`, `border-line`, `bg-assist-tint` benutzt, ist automatisch dark-mode-fest.
Die einzigen bewusst festen Farben im Prototyp sind die Medien-Farbverläufe aus
`src/data/posts.ts` und die schwarzen Overlay-Flächen (`bg-black/55`, `bg-black/60`)
auf den Medien-Platzhaltern, weil dort weiße Schrift in beiden Schemata gelesen
werden muss.
