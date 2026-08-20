# ETHOS – Designsystem

Stand: 20.08.2026. Quelle der Token-Wahrheit ist `src/styles/index.css`; Icons stammen aus `lucide-react`, Diagramme aus Recharts 3.

## Visuelle Welten

| Welt | Kennzeichen | Eigentum |
|---|---|---|
| Gerät | dunkler Rahmen, OS-Status, Wallpaper, Home-Indikator | Demo-Kulisse |
| Instagram | Foto-Feed, Haarlinien, randlose Medien, Plattformakzente | inoffizieller Mock |
| Reddit | Forumshell, Karten, Community-/Vote-Terminologie, Reddit-Skin | inoffizieller Mock |
| ETHOS | Teal-Familie, Linse, Assistenzstreifen, ruhige Panels | Assistenz |

ETHOS sieht über beiden Social Apps gleich aus. Host-Skins überschreiben Oberflächen-/Texttokens, nicht `--cl-assist-*` oder `--cl-sim-*`. Der sichtbare Mock-Hinweis trennt reale Plattformnamen von einer behaupteten Integration.

## Grundprinzipien

- **Auf Anfrage:** Analysen bleiben hinter `Kontext erklären`.
- **Keine Diagnose:** Ausdrucksschätzungen beschreiben sichtbare Signale, nicht Gefühle.
- **Quelle vor Zahl:** Demo-Profil, Sitzung, Selbstauskunft und automatische Schätzung sind sichtbar benannt.
- **Nicht nur Farbe:** Status enthält Icon und Wort; Diagramme enthalten Label, Muster/Reihenfolge und semantische Daten.
- **Mobile zuerst:** einspaltige Panels im Telefon; keine `sm:grid-cols-*` innerhalb app-interner Screens.
- **Ehrliche Attrappe:** Plattformaktionen funktionieren oder melden ausdrücklich, dass sie im Mock fehlen.

## Tokenfamilien

| Familie | Tailwind-Nutzung | Zweck |
|---|---|---|
| Surface/Text | `bg-surface`, `bg-surface-2`, `text-ink`, `text-muted`, `text-faint` | allgemeine Oberfläche |
| Border | `border-line`, `border-line-strong` | Struktur und Fokusabgrenzung |
| Assist | `bg-assist`, `bg-assist-tint`, `text-assist-strong`, `border-assist-line` | ETHOS |
| Simulation | `bg-sim-tint`, `text-sim-strong`, Schraffur | nicht gemessene Werte |
| Status | `alert`, `unclear`, `self` | Warnung, Unsicherheit, Selbstauskunft |
| Plattform | `accent`, `like`, `.platform-gradient`, `.reddit-skin` | Host-App-Konventionen |
| Charts | `--cl-chart-*` | zugängliche Hell-/Dunkelpalette |

Alle Text-/Flächenpaare des Basissystems bleiben auf WCAG-AA-Niveau. Das helle Plattform-Akzentblau wird nicht für kleinen Fließtext genutzt. Rohfarben bleiben auf gezeichnete Medien und kontrastierende Medienoverlays begrenzt.

## Typografie und Geometrie

- Systemschriftstack für UI; klare Gewichtshierarchie statt vieler Größen.
- Mindesttext normalerweise 0,75 rem, Fließtext 0,875–1 rem.
- Panels verwenden `--radius-panel`, Bedienelemente mindestens gerundete 44-px-Ziele, soweit die kompakte Host-Konvention es zulässt.
- `panel-shadow` nur dort, wo Tiefe Fokus/Überlagerung erklärt; Dark Mode trennt primär per Rand.

## Komponenten

| Komponente | Varianten/Zustände |
|---|---|
| `Logo` | ETHOS-Linse, mit/ohne Link nach `/phone` |
| `DeviceLayout` | rahmenlos mobil; Telefonrahmen ab `lg`; normaler und fokussierter Handy-Vollbild-Modus |
| `SocialAppShell` | Instagram-Chrome und -Skin |
| `RedditAppShell` | Forumshell und Reddit-Skin |
| `AppShell` | ETHOS-Header, Status und Navigation |
| `PluginStatusStrip` / `PluginOverlay` | aktiv, pausiert, Inhaltsanalyse aus; Hostname im Erklärungstext |
| `VisualPostCard` | Like, gespeichert, Follow, Caption offen, Medien-/Timeline-Zustand |
| `InstagramCommentsPage` | Original-Caption, Kommentar-Liste, lokaler Eingabezustand |
| `DiscussionPostCard` | Upvote, gespeichert, Feed-/Detailkommentare, Text-/Medienzustand |
| `RedditPostMedia` | beschriebenes Bild oder natives pausiertes 4:3-Video mit voller Kartenbreite, Controls und Ton |
| `ContextAssistantButton` | sieben abgeleitete Kartenvarianten, gesperrt/pausiert |
| `CommunityReactionButton` | häufigste Selbstauskunft sichtbar; Sheet, kleine Stichprobe, quellengetrennt |
| `OwnReactionControl` | Estimate, aktive Selbstauskunft, Korrektur, Löschen |
| `PersonalAnalyticsCharts` | Demo/Sitzung; Daten- und Leerzustände; Grafik plus Semantik |
| `Toggle`, `Button`, `Panel`, `Chip`, `Sheet` | geteilte Zustands- und A11y-Verträge |

Der entfernte `FeedModeSwitch` ist kein Bestandteil mehr: Instagram und Reddit sind eigenständige Apps.

## Kontextkarten

Die Kartenvariante wird aus Analysefeldern abgeleitet und nie als unabhängige Wahrheit gespeichert:

| Variante | Leitidee |
|---|---|
| `sarcasm` | wahrscheinlicher Sarkasmus |
| `irony` | mögliche Ironie |
| `emotional` | emotionaler Ton des Inhalts |
| `exaggeration` | Übertreibung |
| `ragebait` | mögliche Empörungsorientierung |
| `unclear` | mehrere plausible Lesarten |
| `low-context` | zu wenig Kontext |

Jede Karte enthält Simulations-/Interpretationshinweis, Konfidenz in Wort und Skala, Begründung, alternative Lesarten und Grenzen.

## Persönliche Visualisierungen

### Donut

Die Segmentfarbe ist redundant zu Icon, stabiler Kategorie-Reihenfolge, Tooltip und Liste. Mitteltext nennt die Like-Gesamtzahl.

### Emotionslandschaft

Jede Kategorie ist ein eigener 100-%-Balken. Reaktionslabels stehen in stabiler Reihenfolge; die Tabelle nennt absolute Werte. Nur `selfReportedReaction` wird verwendet.

### Plattformbalken

Instagram und Reddit stehen als direkte Textlabels neben/über Balken und Wert. Die Vergleichsaussage ist ohne Farbe lesbar.

Recharts-Animationen sind deaktiviert. Das Layout erhält feste Mindesthöhen und im Test gemockte Dimensionen, sodass weder Browser noch jsdom Warnungen erzeugen.

## Zustände und Sprache

- `Simuliert` markiert jedes nicht gemessene Ergebnis.
- `Am häufigsten` ist die Standardformulierung; „Mehrheit“ wird bei Pluralitäten vermieden.
- Kleine Stichproben erhalten eine eigene Warnung.
- Pausiert, ausgeschaltet, fehlende Einwilligung und fehlende Daten sind verschiedene Leerzustände.
- Automatische Ausdrucksschätzung, aktive Selbstauskunft und Community-Selbstauskunft besitzen verschiedene Labels und Definitionen.

## Dark Mode und Reduced Motion

`:root`, System-Media-Query und `[data-theme='dark']` liefern dieselben semantischen Tokenfamilien. Plattform-Skins besitzen eigene Dark-Overrides. Neue Komponenten verwenden Tokens statt Rohfarben.

`prefers-reduced-motion: reduce` verkürzt Übergänge/Animationen global; Diagramme animieren unabhängig davon nicht. Das simulierte Video und Meme-Szenen folgen der bestehenden Reduced-Motion-Regel.

## Accessibility-Vertrag

- sichtbare Fokusindikatoren und logische DOM-Reihenfolge,
- keine dekorativen Telefon-Icons im Tastaturpfad,
- `aria-current` für Navigation, `aria-pressed` für persistente Aktionen,
- getrennte Namen und Ziele für Host-Kommentare und `ETHOS-Auswertung`,
- benannte Charts und darunter Listen/Tabellen,
- Fokusfalle/Escape/Fokusrückgabe in `Sheet`,
- Live-Status für nicht implementierte Mock-Aktionen und Research-Wechsel,
- lesbares Layout bei 320 px und 200-%-Zoom.
