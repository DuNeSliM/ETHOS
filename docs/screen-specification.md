# ETHOS – Screen-Spezifikation

Stand: 20.08.2026. Der Prototyp ist telefonorientiert und bleibt unterhalb des Desktop-Geräterahmens bildschirmfüllend nutzbar.

## Globales Gerätegerüst

`DeviceLayout` zeichnet ab `lg` ein 24,5-rem-Telefon mit eigener Scrollfläche, Statusleiste und Home-Indikator. Der Desktop-Schalter `Handy-Vollbild` blendet die seitliche Demo-Erklärung aus, zentriert das Telefon und vergrößert es auf bis zu 28,5 rem Breite beziehungsweise 94 dVh Höhe. Unterhalb von `lg` ist der Browser selbst die Gerätefläche; der Schalter bleibt dort verborgen. App-interne Layouts bleiben einspaltig, weil CSS-Breakpoints sich sonst am Desktopfenster statt an der Telefonbreite orientieren würden.

```text
┌─────────────────────────────┐
│ 09:41        ETHOS aktiv    │
│ ┌─────────────────────────┐ │
│ │ aktive App / Scrollraum │ │
│ └─────────────────────────┘ │
│            ━━━━━            │
└─────────────────────────────┘
```

## Routentabelle

| Route | Screen | Shell |
|---|---|---|
| `/` | Landing | außerhalb Gerät |
| `/how-it-works` | Funktionsweise | außerhalb Gerät |
| `/onboarding` | Einrichtung/Einwilligung | Gerät |
| `/phone` | Telefon-Home | Gerät |
| `/instagram` | Instagram-Feed | `SocialAppShell` |
| `/instagram/post/:postId` | Instagram-Kommentare | `SocialAppShell` |
| `/instagram/post/:postId/ethos` | ETHOS-Auswertung eines Instagram-Posts | `SocialAppShell` |
| `/reddit` | Reddit-Home | `RedditAppShell` |
| `/reddit/post/:postId` | Reddit-Post mit allen Kommentaren | `RedditAppShell` |
| `/reddit/post/:postId/ethos` | ETHOS-Auswertung eines Reddit-Posts | `RedditAppShell` |
| `/ethos/overview` | Statistiken | `AppShell` |
| `/ethos/settings` | Einstellungen | `AppShell` |
| `/ethos/privacy` | Datenschutz | `AppShell` |
| `/ethos/research` | Research Mode | `AppShell` |
| alte Pfade | Redirect | passende Shell |
| `*` | Wiederherstellungsseite | außerhalb Gerät |

## Telefon-Home – `/phone`

Das ETHOS-Widget nennt Aktiv-/Pause-, Kamera- und Speicherstatus. Darunter stehen drei eindeutig beschriftete, anklickbare Apps mit generischen Lucide-Symbolen:

```text
┌───────────────────────────┐
│ ETHOS-Widget              │
│ Kontext · Kamera · Lokal  │
├───────────────────────────┤
│ [Bild]    [Forum]  [ETHOS]│
│ Instagram Reddit   ETHOS  │
│                           │
│ dekorative Kulisse        │
└───────────────────────────┘
```

Nur die drei Apps, Widget-Aktionen und der Ausgang aus der Demo sind interaktiv. Dekorative Symbole besitzen keine Buttons/Links und bleiben außerhalb der Tastaturreihenfolge.

## Instagram – `/instagram`

Kopfzeile: Home, Wortmarke „Instagram“, sichtbares `inoffizieller Mock`, dekorative/erklärte Plattformaktionen. Unmittelbar danach:

- sichtbarer Hinweis: erfundene Accounts, Inhalte und Statistiken; keine Verbindung zu Instagram,
- ETHOS-Statusstreifen und optionales Research-Banner,
- Stories-Kulisse,
- fünf randlose visuelle Postkarten,
- Instagram-Tab-Leiste mit funktionsfähigem Home und als Mock erklärten übrigen Zielen,
- schwebende ETHOS-Steuerung und optionales lokales Selbstbild.

Postkarte: Autor, Medium, Like/Kommentar/Teilen/Speichern, Like-Zahl, Caption, Zeit; getrennt durch einen ETHOS-Streifen mit `Kontext erklären`, sichtbarer häufigster Selbstauskunft und `ETHOS-Auswertung`. Like und Speichern sind echte lokale Zustände. Kommentar-Symbol und „Alle Kommentare ansehen“ öffnen `/instagram/post/:id`: eine vertraute Kommentaransicht mit Original-Caption, erfundenen Kommentaren und einem nur für die aktuelle Ansicht funktionierenden Eingabefeld. Dort erscheinen keine ETHOS-Analyseblöcke. Offizielle Logos und Assets werden nicht verwendet.

## Reddit – `/reddit`

Eigene Shell statt Feed-Umschalter:

```text
┌───────────────────────────┐
│ Home  Reddit · Mock       │
│ ETHOS aktiv               │
│ inoffizieller Mock-Hinweis│
│ Dein Start-Feed           │
│ ┌ r/community · user ───┐ │
│ │ Titel und Text         │ │
│ │ ↑ 1.234  Kommentare  🔖│ │
│ │ ETHOS-Hilfen           │ │
│ │ Kommentarvorschau      │ │
│ └───────────────────────┘ │
│ Home Popular + Chat Inbox │
└───────────────────────────┘
```

Sechs Beiträge erscheinen in fester Reihenfolge und sind innerhalb der Gerätefläche scrollbar: der bisherige Heimwerken-Textpost zuerst, der native Video-Post aus `r/marvel` zweitens, das Bild-Meme aus `r/de` drittens, danach die übrigen Textposts. Der Doom-Post enthält keinen zusätzlichen Demo-Erklärabsatz. Sein 4:3-Video füllt die Kartenbreite ohne seitliche Letterbox-Ränder, zeigt im pausierten Ausgangszustand den ersten Frame und bietet Browser-Controls mit Ton; das Bild besitzt eine Textalternative. Upvote und Speichern sind persistent; Kommentare und native Details bleiben Reddit-spezifisch. Mock-Navigation ohne Implementierung meldet ihren Status statt still zu bleiben.

## Getrennte Social- und ETHOS-Details

Die normale Detailroute folgt `post.platform` und gehört vollständig zur Host-App: Instagram zeigt Kommentare, Reddit den vollständigen Post und Thread. Die zusätzliche `/ethos`-Route enthält Postinhalt, Kontextanalyse, Community-Quellenansicht, optionalen Ausdrucksverlauf und Selbstauskunft. Sie ist ausschließlich über den optisch getrennten ETHOS-Streifen erreichbar. Bei falscher Plattform/ID erscheint ein Inline-Panel innerhalb der bestehenden Shell statt doppeltem Chrome.

Der Community-Knopf ist sichtbar beschriftet, z. B. `Am häufigsten: 🙄 genervt · 34 %`. Das Sheet erklärt:

- freiwillige simulierte Selbstauskünfte als Quelle des Knopfs,
- vollständige Reaktionsverteilung,
- Teilnehmerzahl und Nicht-Repräsentativität,
- Sonderwarnung bei kleinem n,
- getrennte Ansicht automatischer Schätzungen und Selbstauskünfte.

Pausieren oder Abschalten von Community-Reaktionen erzeugt einen benannten Grund statt irreführender Zahlen.

## ETHOS-Shell

Header mit ETHOS-Logo/Home-Steuerung und Theme-Aktion, darunter StatusBar und optional Research-Banner. Die untere Navigation führt zu Apps, Übersicht, Datenschutz, Einstellungen und Research; `aria-current` markiert genau das aktive Ziel.

## Statistiken – `/ethos/overview`

Oben steht eine als Tabs bedienbare Quellenauswahl:

- **Simuliertes Profil** (Default, ausdrücklich fiktiv),
- **Diese Sitzung** (nur Browserinteraktionen).

Keine Zahl wird zwischen Quellen addiert. Drei einspaltige, mobile Panels:

1. **Welche Inhalte wurden gelikt?** Donut mit Icons, Segmentlabels und Werteliste.
2. **Emotionslandschaft nach Kategorie.** 100-%-Stapel aus aktiven Selbstauskünften; Legende und semantische Tabelle.
3. **Instagram oder Reddit?** direkt beschriftete Fortschrittsbalken mit absoluten Werten.

Die Zusammenfassung steht in gestapelten Definitionszeilen, nicht in einem Desktop-Raster. Für fehlende Likes oder Selbstauskünfte erscheinen konkrete Leerzustände. Der historische Verlauf ist eine getrennte Sektion und ermöglicht Einzellöschung.

## Einstellungen – `/ethos/settings`

Gruppen: Alles pausieren; Beitragsanalyse; eigene Reaktion/Kamera; Community; Darstellung. `Verlauf und Interaktionen lokal speichern` nennt Likes, Upvotes, gespeicherte Beiträge und memory-only-Verhalten bei Opt-out. Abhängige Kamera-/Weitergabeschalter werden nachvollziehbar deaktiviert. Reset setzt sichere Defaults.

## Datenschutz – `/ethos/privacy`

Lokale Verarbeitung, jeder aktive Zustand, vollständige Liste simulierten Inhalts und gespeicherte Mengen. JSON-Export enthält aktuelle In-Memory-Daten und gespeicherte Metadaten; deshalb bleiben Interaktionen auch bei ausgeschalteter Persistenz exportierbar. Bestätigte Gesamtlöschung und Demo-Reset nennen Likes/Upvotes/Speicherungen ausdrücklich.

## Research – `/ethos/research`

Drei Szenariokarten, Aufgabenmodus, anwendungsweites Banner, vier Pflichtskalen, optionaler Freitext und JSON/CSV-Export. Zustandsbenachrichtigung erfolgt nach dem State-Update und verursacht keine renderzeitige Aktualisierung einer fremden Komponente.

## Landing, Onboarding und Fehler

Landing und Erklärseite verwenden ETHOS als sichtbare Marke und nennen die reine Simulation. Onboarding umfasst vier Informationen und eine Einwilligungsseite; Abschluss führt zu `/phone`. 404 bietet Wege zur Startseite und zu den Apps. Alte Links werden vor der 404 kanonisch umgeleitet.

## Zugänglichkeit aller Screens

- Semantische Überschriften/Landmarks und benannte Navigationen.
- Home-Steuerungen mit Text oder Screenreader-Namen.
- Fokusfalle, Escape und Fokusrückgabe in Sheets.
- Status nie nur durch Farbe; Diagramme immer mit Textalternative.
- Keine Statistik-Animation; globale Reduced-Motion-Regel.
- tokenbasierter Hell-/Dunkelmodus.
- Touchziele, 320-px-Layout und 200-%-Zoom ohne horizontale Pflichtscrollfläche.
