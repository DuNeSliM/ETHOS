# Akzeptanzkriterien

Status: **ERFÜLLT** = im Code umgesetzt und (wo möglich) durch einen
automatisierten Test abgesichert · **TEILWEISE** = umgesetzt, aber mit
Einschränkung · **OFFEN** = nicht umgesetzt.

Stand: alle 89 automatisierten Tests grün, `npm run build` erfolgreich.

## A. Kriterien aus dem Auftrag (Abschnitt 15)

| # | Kriterium | Status | Nachweis |
|---|---|---|---|
| 1 | Anwendung lokal startbar | ERFÜLLT | `npm install && npm run dev` |
| 2 | Visual Feed und Discussion Feed verfügbar | ERFÜLLT | `/feed/visual`, `/feed/discussion`; Smoke-Test |
| 3 | Mindestens acht Beispielposts | ERFÜLLT | 9 Posts; `data.test.ts` prüft `>= 8` |
| 4 | Context Assistant pro Post öffenbar | ERFÜLLT | `ContextAssistantButton`; Test |
| 5 | Sarkasmus-, Emotions- und Polarisierungshinweise simuliert | ERFÜLLT | 7 Varianten, Test deckt alle ab |
| 6 | Analyseunsicherheit sichtbar | ERFÜLLT | `ConfidenceMeter`, 3 Stufen, Wort + Zahl + Balken |
| 7 | Eigene Reaktionen simulierbar und korrigierbar | ERFÜLLT | `OwnReactionControl`; Test |
| 8 | Schätzung und Selbstauskunft getrennt | ERFÜLLT | Zwei `DefinitionRow`; Test prüft Nebeneinander |
| 9 | Community-Reaktionen dargestellt | ERFÜLLT | `CommunityReactions` mit Quellen-Umschalter |
| 10 | Reaktionsverlauf sichtbar | ERFÜLLT | `ReactionTimeline`, 3 Videos |
| 11 | Datenschutzeinstellungen funktionieren | ERFÜLLT | `/settings`, Gating in `mockEngine`; Tests |
| 12 | Alle lokalen Daten löschbar | ERFÜLLT | Einzeln, gesamt und Demo-Reset |
| 13 | Research Mode mit drei Szenarien | ERFÜLLT | `scenarios.ts`; End-to-End-Test |
| 14 | Mobil und Desktop nutzbar | TEILWEISE | Responsiv umgesetzt; manuelle Geräteprüfung offen |
| 15 | `npm run build` erfolgreich | ERFÜLLT | Verifiziert |
| 16 | Keine echte KI / externe API nötig | ERFÜLLT | Sweep ohne Treffer, siehe `privacy-review.md` |
| 17 | Simulierte Daten deutlich gekennzeichnet | ERFÜLLT | `SimulatedBadge`, StatusBar, Platzhaltertexte |
| 18 | KI-Prompts dokumentierbar | ERFÜLLT | `AGENTS.md`, `docs/prompt-documentation/` |

## B. Feeds

**GEGEBEN** ich bin im Visual Feed
**WENN** ich die Seite öffne
**DANN** sehe ich mindestens vier Beiträge, jeder mit erfundenem Konto,
Platzhaltermedium mit Beschreibung und einem Assistenzstreifen. — ERFÜLLT

**GEGEBEN** ich bin in einem Feed
**WENN** ich den Umschalter betätige
**DANN** wechsle ich in die andere Ansicht, und die aktive Ansicht ist nicht nur
farblich, sondern durch das Wort „aktiv" markiert. — ERFÜLLT

**GEGEBEN** ich bin im Discussion Feed
**WENN** ein Kommentar eine eigene Analyse hat
**DANN** trägt genau dieser Kommentar einen kompakten Assistenzbutton. — ERFÜLLT
(`data.test.ts` prüft die Übereinstimmung von `hasAnalysis` und den Daten)

## C. Context Assistant

**GEGEBEN** ein Beitrag mit Analyse
**WENN** ich nichts antippe
**DANN** ist über dem Inhalt keine Emotionsanzeige zu sehen. — ERFÜLLT

**GEGEBEN** ich öffne die Assistenzkarte
**DANN** enthält sie Ton, Begründung, Sicherheitsstufe, Grenzen und die
Kennzeichnung als Interpretation. — ERFÜLLT

**GEGEBEN** eine Karte ist geöffnet
**WENN** ich „Warum wird das so eingeschätzt?" betätige
**DANN** erscheinen die Indikatoren, und `aria-expanded` wechselt. — ERFÜLLT

**GEGEBEN** eine Karte ist geöffnet
**WENN** ich „Nicht hilfreich" oder „Andere Interpretation" betätige
**DANN** erhalte ich eine per `role="status"` angekündigte Bestätigung. — ERFÜLLT

**GEGEBEN** ein Beitrag ohne ausreichenden Kontext
**DANN** gibt die Karte ausdrücklich keine Einschätzung ab. — ERFÜLLT
(`v-lowcontext`)

**GEGEBEN** ich habe Sarkasmushinweise abgeschaltet
**WENN** ich an einem sarkastischen Beitrag die Karte öffne
**DANN** wird mir genau diese Einstellung genannt und verlinkt. — ERFÜLLT

## D. Unsicherheit

**GEGEBEN** eine beliebige Karte
**DANN** ist die Sicherheit als Wort, als „x von 3" und als Balken angegeben,
nie nur farblich. — ERFÜLLT

**GEGEBEN** eine beliebige Analyse
**DANN** nennt sie mindestens eine Sache, die sie nicht wissen kann, und
mindestens eine alternative Lesart. — ERFÜLLT (durch Test erzwungen)

**GEGEBEN** eine beliebige Erklärung
**DANN** enthält sie eine sprachliche Abschwächung und keine der verbotenen
Absolutformulierungen. — ERFÜLLT (durch Test erzwungen)

## E. Eigene Reaktion

**GEGEBEN** Standardeinstellungen
**DANN** ist die simulierte Kameraerfassung aus und es existiert keine
Schätzung. — ERFÜLLT (Test prüft `estimateViewerExpression` → `null`)

**GEGEBEN** Erfassung aktiv
**WENN** ich meine Reaktion korrigiere
**DANN** bleibt die ursprüngliche Schätzung sichtbar. — ERFÜLLT

**GEGEBEN** ich habe eine Angabe gemacht
**WENN** ich „Meine Angabe entfernen" wähle
**DANN** verschwindet nur meine Angabe. — ERFÜLLT

**GEGEBEN** die Erfassung ist aktiv
**DANN** stehen genau neun Reaktionsoptionen zur Wahl. — ERFÜLLT

## F. Community

**GEGEBEN** ein Beitrag mit Community-Daten
**DANN** sind Kamera-Schätzungen und Selbstauskünfte über einen Umschalter
getrennt, mit je eigener Teilnehmerzahl. — ERFÜLLT

**GEGEBEN** eine beliebige Community-Ansicht
**DANN** ist ein Repräsentativitätshinweis und eine Quellenerklärung sichtbar.
— ERFÜLLT

**GEGEBEN** ein Diagramm
**DANN** existiert eine Tabellenentsprechung für Screenreader. — ERFÜLLT

## G. Reaktionsverlauf

**GEGEBEN** ein Video und aktive Erfassung
**DANN** zeigt der Verlauf lückenlose Abschnitte über die volle Laufzeit.
— ERFÜLLT (durch Test erzwungen)

**GEGEBEN** der Verlauf ist sichtbar
**WENN** ich den Scrubber bewege
**DANN** wird der aktuelle Abschnitt hervorgehoben und per `role="status"`
benannt. — ERFÜLLT

**GEGEBEN** ein Video ohne aktive Erfassung
**DANN** wird erklärt, warum kein Verlauf vorliegt. — ERFÜLLT

## H. Datenschutz und Einwilligung

**GEGEBEN** Standardeinstellungen
**DANN** sind Kameraerfassung, Kamera-Vorschau und anonyme Weitergabe aus.
— ERFÜLLT (Test)

**GEGEBEN** die Erfassung ist aktiv mit Vorschau und Weitergabe
**WENN** ich die Erfassung abschalte
**DANN** werden Vorschau und Weitergabe mit abgeschaltet. — ERFÜLLT (Test)

**GEGEBEN** ich schalte „Reaktionsverlauf lokal speichern" ab
**DANN** werden die vorhandenen Schlüssel aktiv entfernt. — ERFÜLLT

**GEGEBEN** ich betätige „Alle Daten löschen"
**DANN** werde ich zuerst um Bestätigung gebeten. — ERFÜLLT

**GEGEBEN** die Anwendung läuft
**DANN** findet kein Netzwerkzugriff statt. — ERFÜLLT (Sweep ohne Treffer)

## I. Research Mode

**GEGEBEN** `/research`
**DANN** stehen genau drei Szenarien bereit. — ERFÜLLT

**GEGEBEN** ein laufendes Szenario
**WENN** ich die Seite verlasse
**DANN** bleibt ein Banner mit Rückweg sichtbar. — ERFÜLLT

**GEGEBEN** das Bewertungsformular
**DANN** ist Speichern erst nach vier Antworten möglich, und jede Skala hat
ausgeschriebene Endpunkte. — ERFÜLLT (Test)

**GEGEBEN** gespeicherte Ergebnisse
**DANN** sind JSON- und CSV-Export verfügbar, Freitext ist CSV-sicher maskiert.
— ERFÜLLT

## J. Barrierefreiheit

| Kriterium | Status | Anmerkung |
|---|---|---|
| Semantisches HTML, Überschriftenhierarchie | ERFÜLLT | |
| Vollständige Tastaturbedienung | ERFÜLLT | Test öffnet Karte per Tab + Enter |
| Sichtbarer Fokus | ERFÜLLT | globaler `:focus-visible`-Ring |
| Dialog: Fokus hinein, gefangen, Escape, Rückgabe | ERFÜLLT | Test |
| Keine reine Farbkodierung | ERFÜLLT | Icon + Wort bei jedem Status |
| Diagramm-Alternative für Screenreader | ERFÜLLT | `sr-only`-Tabelle |
| `prefers-reduced-motion` | ERFÜLLT | globale Regel + Playback-Verhalten |
| Skalierbare Schrift (rem) | ERFÜLLT | |
| Kontraste AA | TEILWEISE | rechnerisch geprüft, siehe `accessibility-review.md` |
| Screenreader-Test mit echten Nutzenden | OFFEN | nicht durchgeführt |
| Automatisierter A11y-Scan (axe/Lighthouse) | OFFEN | nicht eingerichtet |

## K. Build und Tests

| Kriterium | Status |
|---|---|
| `npm run build` erfolgreich | ERFÜLLT |
| `npm test` grün (89 Tests) | ERFÜLLT |
| TypeScript strict ohne Fehler | ERFÜLLT |
| Playwright-E2E-Smoke-Test | OFFEN (optionales Stretch Goal) |
