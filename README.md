# ContextLens

**UX-Forschungsprototyp für eine freiwillige Assistenzschicht in sozialen Medien.**

Die Demo läuft auf einem **simulierten Telefon**: Startbildschirm, darauf eine
erfundene Foto-App und ContextLens als Erweiterung, die über ihr liegt.

ContextLens erklärt auf Anfrage, was in einem Beitrag mitschwingen könnte:
Sarkasmus, Ironie, emotionale Untertöne, Tonfall, mögliche Absichten und stark
zuspitzende oder auf Empörung ausgerichtete Formulierungen. Es richtet sich vor
allem an Menschen, denen das Deuten solcher Signale schwerfällt – ohne sie als
defizitär anzusprechen.

> ⚠️ **Dieser Prototyp enthält keine KI.**
> Alle Analyseergebnisse, Reaktionsschätzungen und Community-Zahlen sind
> handgeschriebene Beispieldaten in `src/data/`. Es gibt kein Backend, keine
> Datenbank, keine Anmeldung, keine Verbindung zu sozialen Netzwerken und keine
> echte Emotionserkennung. Nichts verlässt den Browser.

## Schnellstart

```bash
npm install
npm run dev      # http://localhost:5173
```

| Befehl | Zweck |
|---|---|
| `npm run dev` | Entwicklungsserver |
| `npm run build` | Produktionsbuild (`tsc -b && vite build`) |
| `npm run preview` | Produktionsbuild lokal ansehen |
| `npm test` | Testsuite (99 Tests) |
| `npm run test:watch` | Tests im Watch-Modus |

Voraussetzung: Node.js 20 oder neuer.

## Die Idee in einem Satz

Das System unterscheidet strikt zwischen **vier Aussageebenen** und vermischt
sie nie:

1. **Analyse des Inhalts** – „Wahrscheinlich sarkastisch"
2. **Geschätzte Reaktion der betrachtenden Person** – „Sichtbares Lächeln"
   (beschreibt Sichtbares, nie ein Gefühl; optional und standardmäßig aus)
3. **Aktive Selbstauskunft** – „genervt" (hat Vorrang, ersetzt die Schätzung
   aber nicht)
4. **Community-Reaktionen** – anonym, freiwillig, mit getrennter Ausweisung von
   Kamera-Schätzungen und Selbstauskünften

Formulierungen bleiben durchgehend abgeschwächt („wahrscheinlich",
„möglicherweise", „Analyse nicht eindeutig"). Jede Karte nennt, was sie **nicht**
wissen kann. Diese Sprachregeln sind als automatisierte Tests kodiert.

## Die drei Ebenen der Demo

| Ebene | Was es ist |
|---|---|
| **Gerät** | Ein simuliertes Telefon mit Startbildschirm. Ab 1024 px wird der Rahmen gezeichnet, darunter läuft dieselbe Ansicht bildschirmfüllend – auf einem echten Telefon ist der Browser bereits das Gerät. |
| **Plattform** | `Momento`, eine erfundene Foto-App. Übernommen sind die Konventionen der Gattung, nichts Markenspezifisches. Konten, Zahlen und Beiträge sind erfunden. |
| **Assistenzschicht** | ContextLens. Über der fremden App als schmale Statusleiste und schwebender Knopf; daneben als eigene App für Übersicht, Datenschutz, Einstellungen und Research Mode. |

Dass die Assistenz **nicht** zur Plattform gehört, ist die zentrale Aussage des
Prototyps – deshalb ist sie sichtbar gebaut statt nur behauptet.

## Rundgang durch die Demo

1. **Startseite** → „Demo starten"
2. **Einrichtung**, 4 Infoschritte + 1 Einwilligungsschritt. Die Kameraerfassung
   ist aus und bleibt es, bis sie ausdrücklich eingeschaltet wird.
3. **Startbildschirm des Telefons.** Das Widget zeigt, was die Erweiterung
   gerade tut. Zwei Symbole führen weiter: die Foto-App und ContextLens.
4. **Visual Feed** – an einem Beitrag „Kontext erklären" antippen.
   Empfehlung: der Beitrag über die Zugverspätung (Sarkasmus, Sicherheit mittel)
   und der kurze Clip ohne Kontext (die App gibt bewusst keine Einschätzung ab).
5. **Discussion Feed** – hier fehlen Tonfall und Mimik; der Beitrag zum Fahrplan
   zeigt Ironie mit **niedriger** Sicherheit.
6. **Schwebender ContextLens-Knopf** – Hauptschalter und Wege in die
   ContextLens-App. Einmal pausieren und wieder einschalten zeigt sofort, was
   zur Assistenz gehört und was zur Plattform.
7. **Einstellungen** – „Simulierte eigene Reaktionserfassung" einschalten.
   An den Beiträgen erscheint nun ein dezenter Chip.
8. **Detailansicht** eines Videos – Reaktionsverlauf und Community-Reaktionen.
   Den Umschalter zwischen „Automatische Schätzungen" und „Aktive
   Selbstauskünfte" ausprobieren: Diagramm **und** Teilnehmerzahl ändern sich.
9. **Research Mode** – drei geführte Testszenarien mit Bewertung und Export.

Ein Hinweis für Vorführungen: Bei einem Beitrag schätzt das System absichtlich
falsch („sichtbares Lächeln" bei einem Beitrag, der die meisten Menschen ärgert).
Das ist kein Fehler, sondern der Prüffall für die Korrekturfunktion.

## Projektstruktur

```
src/
  app/           ContextLens-App-Chrome, Routing, globaler Zustand
  components/    Geteilte UI-Bausteine
  data/          Handgeschriebene Beispieldaten
  features/
    analytics/          Community-Diagramm, Reaktionsverlauf
    context-assistant/  Assistenzbutton und -karte
    device/             Simuliertes Telefon: Rahmen und OS-Statusleiste
    feed/               Beitragskarten, Medienplatzhalter, Stories
    plugin/             Präsenz der Assistenz über der fremden App
    reactions/          Eigene Reaktion, Kamera-Vorschau
    research-mode/      Szenarien und Sitzungszustand
    simulation/         Mock-Engine
    social-app/         Chrome der simulierten Plattform
  hooks/  lib/  pages/  styles/  test/  types/
docs/            Dokumentation (siehe unten)
```

## Dokumentation

| Dokument | Inhalt |
|---|---|
| [`docs/product-brief.md`](docs/product-brief.md) | Problem, Vision, MVP-Abgrenzung, Forschungsfragen, Risiken, verworfene Ideen |
| [`docs/user-flows.md`](docs/user-flows.md) | Kernnutzerflüsse mit Erfolgskriterien |
| [`docs/acceptance-criteria.md`](docs/acceptance-criteria.md) | Akzeptanzkriterien mit Erfüllungsstatus |
| [`docs/architecture.md`](docs/architecture.md) | Struktur, Datenmodell, Mock-Engine, State, Speicherung |
| [`docs/design-system.md`](docs/design-system.md) | Tokens, Komponenten, Zustände, Dark Mode |
| [`docs/screen-specification.md`](docs/screen-specification.md) | Spezifikation je Screen inkl. Wireframes |
| [`docs/privacy-review.md`](docs/privacy-review.md) | Datenschutz-Audit mit Code-Belegen |
| [`docs/accessibility-review.md`](docs/accessibility-review.md) | WCAG-Audit mit berechneten Kontrastwerten |
| [`docs/test-plan.md`](docs/test-plan.md) | Automatisierte und manuelle Tests, Ablauf der Nutzertests |
| [`docs/known-limitations.md`](docs/known-limitations.md) | Bekannte Grenzen und Risiken |
| [`docs/decisions.md`](docs/decisions.md) | Produktentscheidungen mit Begründung |
| [`docs/progress.md`](docs/progress.md) | Fortschritt und offene Punkte |
| [`AGENTS.md`](AGENTS.md) | **KI-Einsatz und alle verwendeten Prompts** |
| [`docs/prompt-documentation/`](docs/prompt-documentation/) | Prompt-Register und Export-Checkliste |
| [`docs/original-idea.md`](docs/original-idea.md) | Die ursprüngliche Projektidee. Bewusst unverändert erhalten – der Prototyp weicht davon ab, siehe `decisions.md` (E-001, E-002) |

## Datenschutz

Nachweisbar im Code (Belege in `docs/privacy-review.md`):

- **Kein Netzwerkzugriff.** Keine Treffer für `fetch`, `XMLHttpRequest`,
  `WebSocket`, `sendBeacon` oder externe URLs im gesamten Quellcode.
- **Keine Bildauswertung.** Kein `canvas`, `drawImage`, `toDataURL`,
  `getImageData` oder `MediaRecorder`. Die optionale Kamera-Vorschau hängt den
  Stream ausschließlich an ein `<video>`-Element und stoppt alle Tracks beim
  Abschalten.
- **Nur `localStorage`,** angesprochen an genau einer Stelle
  (`src/lib/storage.ts`), mit versionierten Schlüsseln und einer Löschfunktion,
  die ausschließlich eigene Schlüssel entfernt.
- **Kameraerfassung, Kamera-Vorschau und anonyme Weitergabe sind standardmäßig
  aus** und durch Tests dagegen abgesichert.

## Grenzen

Dies ist ein Konzeptprototyp für Nutzertests, kein Produkt. Die Analysen sind
geschrieben, nicht berechnet; die Community-Zahlen sind erfunden; es gibt neun
Beispielbeiträge. Die simulierte Foto-App ist eine Attrappe: Suche, Erstellen,
Reels, Profil und Direktnachrichten sagen beim Antippen, dass es sie im
Prototyp nicht gibt. Vollständige Liste in
[`docs/known-limitations.md`](docs/known-limitations.md).

---

*Studienarbeit. Der KI-Einsatz bei der Entwicklung ist in `AGENTS.md`
dokumentiert.*
