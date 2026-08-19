# Accessibility-Review

**Methode.** Manuelles Code-Audit gegen WCAG 2.1 AA, ergänzt um rechnerisch
ermittelte Kontrastwerte für alle Farbtoken in beiden Farbschemata. Seit der
Umstellung auf die Telefonansicht gehören dazu auch die überschriebenen Tokens
des Plattform-Skins.

**Ausdrücklich nicht durchgeführt:**

- kein automatisierter Scan (axe, Lighthouse, pa11y)
- kein Test mit echten Screenreadern (NVDA, JAWS, VoiceOver)
- kein Test mit Nutzenden aus der Zielgruppe

Diese drei Punkte bleiben offen und sind vor einem echten Einsatz nachzuholen.
Das Ergebnis unten ist eine Code-Prüfung, kein Konformitätsnachweis.

---

## 1. Kontrastwerte

Berechnet nach WCAG-Formel. Grenzwerte: **4,5:1** für Fließtext, **3:1** für
große Schrift und für Bedienelement-Umrisse.

### Hellmodus

| Paar | Ratio | Bewertung |
|---|---|---|
| `ink` auf `surface` | 17,80 | AA |
| `ink` auf `canvas` | 16,43 | AA |
| `muted` auf `surface` | 6,39 | AA |
| `muted` auf `surface-2` | 5,64 | AA |
| `faint` auf `surface` | **5,18** | AA *(vorher 3,91 — korrigiert)* |
| `faint` auf `canvas` | **4,78** | AA *(vorher 3,61 — korrigiert)* |
| `assist` auf `surface` | 5,90 | AA |
| `assist-strong` auf `assist-tint` | 7,89 | AA |
| weiß auf `assist` (Buttons) | 5,90 | AA |
| `caution` auf `caution-tint` | 5,66 | AA |
| `alert` auf `alert-tint` | 6,32 | AA |
| `info` auf `info-tint` | 5,78 | AA |
| `positive` auf `positive-tint` | 5,69 | AA |
| `sim` auf `sim-tint` | 6,44 | AA |
| `neutral-ink` auf `neutral-tint` | 6,69 | AA |
| `line-strong` auf `surface` (Formularrahmen) | **3,48** | AA (UI) *(vorher 1,84 — korrigiert)* |
| `line` auf `surface` (Trennlinien) | 1,38 | dekorativ, siehe A-04 |

### Dunkelmodus

| Paar | Ratio | Bewertung |
|---|---|---|
| `ink` auf `surface` | 14,86 | AA |
| `muted` auf `surface` | 7,93 | AA |
| `faint` auf `surface` | 5,52 | AA |
| `assist` auf `surface` | 9,94 | AA |
| `assist-strong` auf `assist-tint` | 10,56 | AA |
| `assist-on` auf `assist` | 9,67 | AA |
| `caution` auf `caution-tint` | 8,75 | AA |
| `alert` auf `alert-tint` | 8,19 | AA |
| `info` auf `info-tint` | 8,10 | AA |
| `positive` auf `positive-tint` | 8,68 | AA |
| `sim` auf `sim-tint` | 8,54 | AA |
| `neutral-ink` auf `neutral-tint` | 7,50 | AA |
| `line-strong` auf `surface` | **4,09** | AA (UI) *(vorher 2,18 — korrigiert)* |

### Reaktionsverlauf-Bänder

Die Beschriftung auf den farbigen Bändern verwendet `text-inverse`, das mit dem
Farbschema kippt (weiß im Hell-, fast schwarz im Dunkelmodus).

| Band | Hell | Dunkel |
|---|---|---|
| `smile` (positive) | 6,45 | 10,74 |
| `surprise` (info) | 6,70 | 9,74 |
| `tense` (caution) | 6,33 | 11,02 |
| `neutral` | 7,58 | 9,37 |
| `unclear` | 7,58 | 9,37 |

Ursprünglich nutzte das `unclear`-Band ein helles Grau (1,84:1 hell / 2,43:1
dunkel) und dazu `mix-blend-luminosity` — beides unlesbar. Korrigiert: `unclear`
verwendet nun dieselbe Grundfarbe wie `neutral` und wird durch eine
**diagonale Schraffur** unterschieden statt durch Helligkeit. Das ist auch für
Menschen mit Farbfehlsichtigkeit die bessere Lösung.

### Plattform-Skin (simulierte Foto-App)

Innerhalb von `.platform-skin` gelten eigene Flächen- und Textfarben (siehe
`docs/design-system.md`, 3.1a). Berechnet gegen die jeweilige eigene Fläche
(`#ffffff` hell, `#000000` dunkel):

| Token | Hell | Dunkel |
|---|---|---|
| `--cl-text` | 21,00 | 20,20 |
| `--cl-text-muted` | 7,59 | 10,00 |
| `--cl-text-faint` | 5,33 | 8,10 |
| `--cl-border-strong` | 4,54 | 5,98 |

Der Sekundärgrauton, den diese App-Gattung üblicherweise verwendet (`#8e8e8e`,
3,0:1), wurde bewusst **nicht** übernommen. Die Nachahmung endet dort, wo sie
Lesbarkeit kosten würde.

Die Assist-Tokens bleiben im Skin unverändert; die dort ausgewiesenen Werte
gelten also auch innerhalb der simulierten App, mit einer Ausnahme:
`text-assist-strong` auf `bg-assist-tint` in der Assistenzleiste – dieses Paar
stammt vollständig aus der Assist-Familie und ist oben bereits ausgewiesen.

---

## 2. Befunde

| ID | Datei | Schwere | WCAG | Befund | Status |
|---|---|---|---|---|---|
| A-01 | `components/Toggle.tsx` | **hoch** | 2.5.5 / 2.4.7 | Das echte `<input>` war 24 px breit, der sichtbare Schalter 44 px. Klicks auf die rechte Hälfte gingen ins Leere, und der Fokusring umschloss nur ein Drittel des Elements. Betrifft jeden Einwilligungsschalter. | **behoben** (`h-6 w-11`) |
| A-02 | `styles/index.css` | mittel | 1.4.3 / 1.4.11 | `faint` und `border-strong` unter den Grenzwerten. | **behoben** |
| A-03 | `features/analytics/ReactionTimeline.tsx` | mittel | 1.4.3 / 1.4.1 | `unclear`-Band unlesbar und nur farblich von `neutral` unterschieden. | **behoben** (Schraffur) |
| A-04 | `styles/index.css` | niedrig | 1.4.11 | `--cl-line` erreicht nur 1,38:1. | Bewusst so: reine Dekoration zwischen Flächen; jede funktionale Begrenzung nutzt `line-strong`. Keine Änderung. |
| A-05 | `app/AppShell.tsx` | niedrig | 2.4.8 | Der Feed-Eintrag der Navigation war im Discussion Feed und in der Detailansicht nicht als aktiv markiert. | **behoben** (Präfix-Abgleich + `aria-current="page"`) |
| A-06 | `pages/PostDetailPage.tsx` | niedrig | 1.3.1 | Bei unbekannter Beitrags-ID wurde die Vollbild-404-Seite **innerhalb** des `<main>` gerendert — doppeltes Logo, doppelte Navigation. | **behoben** (Inline-Panel) |
| A-07 | `components/Sheet.tsx` | niedrig | — | Der Fokus-Filter nutzt `offsetParent !== null`. In jsdom ist das immer `null`, die Tests prüfen daher einen anderen Zweig als der Browser. | Kein Nutzerproblem. In `known-limitations.md` vermerkt. |
| A-08 | `features/feed/MediaPlaceholder.tsx` | niedrig | 1.4.3 | Die Farbverläufe der Platzhalter stammen aus den Daten und reagieren nicht auf den Dunkelmodus. Der Text darauf liegt jedoch auf `bg-black/55`. | Akzeptiert. |
| A-09 | — | offen | 4.1.2 | Kein Test mit echtem Screenreader. | **offen** |
| A-10 | `features/social-app/PlatformTabBar.tsx` | niedrig | 2.5.3 / 3.2.4 | Vier der fünf Einträge der simulierten Tab-Leiste haben keine Funktion. Ein stiller Nicht-Effekt wäre für Screenreader- und Tastaturnutzende nicht erklärbar. | Gelöst: zugänglicher Name „Suche (im Prototyp ohne Funktion)" – sichtbarer Text steht am Anfang des Namens (2.5.3 erfüllt) –, beim Auslösen eine Meldung in einer `role="status"`-Region. |
| A-11 | `pages/PhoneHomePage.tsx` | niedrig | 1.3.1 | Neun Symbole des Startbildschirms sind Kulisse. | Gelöst wie beim Stories-Streifen: `aria-hidden`, nicht fokussierbar, dazu ein `sr-only`-Satz, der die Kulisse benennt. Nur die drei benutzbaren Ziele liegen im Tastaturpfad. |
| A-12 | `features/social-app/PlatformWordmark.tsx` | niedrig | 1.4.1 | Die Wortmarke ist Text mit `bg-clip-text` und `text-transparent`; in `forced-colors`-Modi würde sie verschwinden. | Gelöst: `forced-colors:bg-none forced-colors:text-ink`. |
| A-13 | `features/plugin/PluginOverlay.tsx` | niedrig | 1.4.1 / 1.3.1 | Die Assistenzleiste kürzt drei Statusangaben in eine Zeile. | Gelöst: jede Angabe ist ein eigenes Element mit unverändertem Wortlaut, darunter steht derselbe Zustand als ausformulierter `sr-only`-Satz. Der Zustand des schwebenden Knopfes wird zusätzlich über Beschriftung und Rahmen getragen, nicht nur über die Farbe. |

Nach den Korrekturen sind keine Befunde der Schwere hoch oder mittel offen.

---

## 3. Was der Code richtig macht

Geprüft und bestätigt:

**Semantik und Struktur**
- Echte Landmarks: `<header>`, `<main id="main">`, `<nav aria-label>`,
  `<article>`, `<section aria-labelledby>`, `<figure>/<figcaption>`.
- Genau eine `<h1>` pro Seite, Überschriften ohne Sprünge.
- Listen sind Listen, Tabellen haben `<caption>`, `<thead>` und `scope`.
- Beschreibungspaare nutzen `<dl>/<dt>/<dd>` — dadurch ist die Zuordnung
  „geschätzt" versus „von dir angegeben" auch für Screenreader eindeutig.

**Tastatur**
- Skip-Link als erstes fokussierbares Element (`.sr-only-focusable`).
- Globaler `:focus-visible`-Ring mit 3 px und Offset.
- Alle Bedienelemente sind native `<button>`, `<a>`, `<input>`, `<textarea>` —
  keine klickbaren `<div>`.
- Der Video-Scrubber ist ein `<input type="range">` und damit mit den Pfeiltasten
  bedienbar.
- Getestet: Assistenzkarte lässt sich per Tab + Enter öffnen.

**Dialoge** (`Sheet.tsx`)
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, optional
  `aria-describedby`.
- Fokus wandert beim Öffnen hinein, Tab zykliert innerhalb, Escape schließt,
  Fokus kehrt zum auslösenden Element zurück. Durch Test abgesichert.
- Hintergrund-Scrollen wird gesperrt und beim Schließen wiederhergestellt.

**Nicht nur Farbe**
Jeder Status trägt zusätzlich Text und/oder ein Icon:
- Sicherheitsstufe: Wort + „x von 3" + Balken
- Ein/Aus-Schalter: Häkchen bzw. Minus im Knopf **und** das Wort „Aktiv"/„Inaktiv"
- Datenschutz-Zustandsliste: Icon + Wort „aktiv"/„inaktiv"
- Aktiver Feed-Tab: das Wort „aktiv"
- Mobile Navigation: Beschriftung immer sichtbar, plus Balkenmarkierung
- Ausgewählte Reaktion: Häkchen im Button, zusätzlich `aria-pressed`
- Reaktionsverlauf: Beschriftung im Band, ausgeschriebene Legende, Schraffur

**Diagramme**
Das Recharts-Diagramm ist per `aria-hidden` aus dem Baum genommen; daneben steht
eine `sr-only`-Tabelle mit denselben Werten inklusive `<caption>`, die die
Datenquelle benennt. Balken sind zusätzlich direkt beschriftet, sodass kein
Hover nötig ist.

**Bewegung**
`prefers-reduced-motion: reduce` deaktiviert Animationen und Transitions global.
Zusätzlich verhält sich der simulierte Player entsprechend zurückhaltend.

**Text**
Durchgängig `rem`, `-webkit-text-size-adjust: 100%`, keine festen Pixelhöhen an
Textcontainern. Zoom auf 200 % sollte funktionieren (manuell zu bestätigen).

**Statusmeldungen**
Rückmeldungen zu „Nicht hilfreich", Exporten, Löschvorgängen und der aktuelle
Abschnitt im Reaktionsverlauf nutzen `role="status"` und werden damit
angekündigt.

**Sprache**
`<html lang="de">`. Die Texte sind in einfachem Deutsch gehalten, kurze Sätze,
Fachbegriffe werden erklärt. Das ist für die Zielgruppe besonders relevant.

---

## 4. Tastatur-Durchgang je Screen

| Screen | Ergebnis |
|---|---|
| Landing | Tab-Reihenfolge folgt der Leserichtung; beide Hauptaktionen erreichbar |
| Onboarding | Fortschritt wird als Text angesagt; „Zurück" ist im ersten Schritt korrekt deaktiviert |
| Startbildschirm | Drei Ziele im Tastaturpfad (simulierte App, ContextLens, Ausstiegslink) plus die zwei Widget-Knöpfe; die neun Kulissensymbole werden übersprungen |
| Geräterahmen | Bringt selbst kein Bedienelement mit; Gehäuse, Tasten und Home-Indikator sind `aria-hidden`. Die Statusleiste trägt nur einen `sr-only`-Text zum Zustand der Erweiterung |
| Simulierte App | Kopfzeile → Ansichtswechsel → Assistenzleiste (inkl. „Pausieren") → Feed → schwebender Knopf → Tab-Leiste. Die vier funktionslosen Tabs sind erreichbar und sagen beim Auslösen, dass es sie nicht gibt |
| Assistenz-Panel | Wie jedes `Sheet`: Fokus hinein, Fokusfalle, Escape, Fokusrückgabe. Enthält Hauptschalter und vier Verweise in die ContextLens-App |
| Visual Feed | Pro Beitrag: Abspielen → Scrubber → „Kontext erklären" → Detail-Link; Reaktions-Chip nur bei aktiver Erfassung |
| Discussion Feed | Beitrag, dann Kommentare; kompakte Assistenzbuttons an Kommentaren erreichbar |
| Post-Detail | Feste Reihenfolge Inhalt → Analyse → Verlauf → Community; Quellen-Umschalter als `role="radiogroup"` |
| Assistenzkarte | Fokusfalle geprüft, Escape geprüft, Fokusrückgabe geprüft |
| Reaktions-Sheet | Neun Reaktionsbuttons mit `aria-pressed`, Freitext nur bei „andere Reaktion" |
| Einstellungen | Alle Schalter als `role="switch"`; gesperrte Schalter sind `disabled` **und** nennen den Grund im Text |
| Datenschutz | Löschaktionen mit Zwischenbestätigung, Abbrechen erreichbar |
| Research Mode | Bewertungsskala über `sr-only`-Radios — mit Pfeiltasten bedienbar; Speichern bleibt deaktiviert, bis alle vier Fragen beantwortet sind, mit Erklärung im Text |

---

## 5. Priorisierte offene Punkte

1. **Screenreader-Test durchführen** (NVDA unter Windows, VoiceOver unter iOS).
   Besonders zu prüfen: die `<dl>`-Paare, die `sr-only`-Diagrammtabelle und die
   Ansage beim Verschieben des Video-Scrubbers.
2. **Automatisierten Scan einrichten** (`vitest-axe` oder Playwright + axe), um
   Regressionen zu verhindern.
3. **Test mit Personen aus der Zielgruppe.** Verständlichkeit der Sprache ist
   für dieses Produkt eine Kernanforderung und lässt sich nicht am Code prüfen.
4. **Zoom auf 200 % und 320 px Breite** manuell durchgehen, insbesondere die
   Ergebnistabelle im Research Mode (scrollt horizontal in einem eigenen
   Container).
5. **`aria-live` beim Quellenwechsel** der Community-Ansicht erwägen: Der
   Diagrammwechsel wird derzeit nicht angesagt, die Teilnehmerzahl daneben
   ändert sich jedoch sichtbar.
