# ETHOS

**Lokaler UX-Forschungsprototyp für eine freiwillige Kontext- und Emotionshilfe in sozialen Medien.**

Die Demo simuliert ein Smartphone mit drei klar getrennten Apps:

- **Instagram** – inoffizieller Foto-Feed-Mock mit fünf erfundenen Beiträgen.
- **Reddit** – inoffizieller Feed-Mock mit sechs erfundenen Text-, Bild- und Video-Posts samt Kommentaren.
- **ETHOS** – Assistenz-, Statistik-, Datenschutz-, Einstellungs- und Research-App.

ETHOS liegt zusätzlich als erkennbare Assistenzschicht über beiden Social-App-Mocks. Ein Beitrag kann auf mögliche Kontexte wie Sarkasmus, Ironie oder Zuspitzung geprüft werden; die häufigste freiwillige Community-Selbstauskunft wird direkt benannt. Das soll besonders Menschen unterstützen, denen das Einordnen sozialer Signale schwerfällt, ohne Gefühle als objektive Tatsachen auszugeben.

> **Wichtig:** Der Prototyp enthält keine KI zur Laufzeit. Alle Inhaltsanalysen, automatischen Ausdrucksschätzungen, Community-Werte und das Demo-Profil sind deterministische Beispieldaten. Instagram und Reddit sind inoffizielle Attrappen ohne Verbindung zu den Plattformen. Es gibt kein Backend, keine Anmeldung, keine Plattform-API und keine echte Emotionserkennung.

## Schnellstart

```bash
npm install
npm run dev
```

Voraussetzung ist Node.js 20 oder neuer. Der Entwicklungsserver läuft standardmäßig unter `http://localhost:5173`.

| Befehl | Zweck |
|---|---|
| `npm run dev` | Entwicklungsserver |
| `npm run build` | Typprüfung und Produktionsbuild |
| `npm run preview` | Produktionsbuild lokal öffnen |
| `npm run typecheck` | TypeScript ohne Ausgabe prüfen |
| `npm test` | vollständige Suite: 133 Tests |
| `npm run test:watch` | Tests im Watch-Modus |

## Produktlogik

Vier Aussageebenen bleiben technisch und sprachlich getrennt:

1. **Inhaltsanalyse** – etwa „wahrscheinlich sarkastisch“.
2. **Automatische Ausdrucksschätzung** – beschreibt nur ein sichtbares Signal; sie ist simuliert, optional und standardmäßig aus.
3. **Aktive Selbstauskunft** – was eine Person selbst angibt. Sie ersetzt keine frühere Schätzung, sondern wird separat gespeichert.
4. **Community-Reaktionen** – freiwillige Selbstauskünfte und automatische Schätzungen werden getrennt ausgewiesen.

Der sichtbare Community-Knopf formuliert beispielsweise `Am häufigsten: 🙄 genervt · 34 %`. Unter 50 Prozent wird bewusst nicht von einer Mehrheit gesprochen. Im Detail bleiben Verteilung, Quelle, Stichprobengröße und Repräsentativitätswarnung sichtbar.

## Die drei Apps

| App | Inhalt | ETHOS-Präsenz |
|---|---|---|
| Instagram | fünf visuelle Posts, Stories-Kulisse, Likes, Speichern und eine eigene Instagram-Kommentarsektion | Statusstreifen, Kontext-Erklärung, Community-Auswertung, Selbstauskunft und getrennte ETHOS-Auswertung |
| Reddit | sechs Posts mit Text, lokalem Bild/Meme und nativ bedienbarem Video, `r/`-Communities, Upvotes, Speichern und Kommentar-Threads | dieselben ETHOS-Funktionen in einer Reddit-spezifischen Shell und getrennte ETHOS-Auswertung |
| ETHOS | Statistik-Übersicht, Einstellungen, Datenschutz-Dashboard und drei Research-Szenarien | eigenständige App mit Home-Steuerung zum Telefon |

Alle drei App-Symbole auf `/phone` sind bedienbar. Dekorative Telefon-Icons liegen nicht im Tastaturpfad. Jede App besitzt eine zugängliche Home-Steuerung zurück zu `/phone`.

Auf Desktopbreite schaltet `Handy-Vollbild` in einen fokussierten Präsentationsmodus: Die seitliche Demo-Erklärung verschwindet und das vergrößerte Telefon steht mittig. Auf kleinen Bildschirmen füllt die App ohnehin den Browser und benötigt diesen Schalter nicht.

## Statistikquellen

Die ETHOS-Übersicht bietet zwei Quellen, die niemals zusammengeführt werden:

- **Simuliertes Profil** ist der Standard und zeigt sofort ein explizit fiktives, deterministisches Datenprofil.
- **Diese Sitzung** wird ausschließlich aus lokalen Likes/Upvotes, gespeicherten Beiträgen und aktiven Selbstauskünften aufgebaut. Automatische Ausdrucksschätzungen werden nicht als tatsächliche Emotionen gezählt.

Die Darstellung umfasst ein Donutdiagramm nach Inhaltskategorie, eine 100-%-gestapelte Emotionslandschaft und direkt beschriftete Instagram-/Reddit-Balken. Jede Grafik besitzt zusätzlich lesbare Werte beziehungsweise eine semantische Liste oder Tabelle, Icons und stabile Textlabels. Animationen sind deaktiviert; Hell- und Dunkelmodus werden unterstützt.

## Routing

Kanonische Routen:

```text
/phone
/instagram
/instagram/post/:postId
/instagram/post/:postId/ethos
/reddit
/reddit/post/:postId
/reddit/post/:postId/ethos
/ethos/overview
/ethos/settings
/ethos/privacy
/ethos/research
```

Historische Links wie `/feed/visual`, `/feed/discussion`, `/post/:postId`, `/overview`, `/settings`, `/privacy` und `/research` bleiben als Weiterleitungen erhalten.

## Lokale Daten und Datenschutz

- Verlauf, Selbstauskünfte, Likes/Upvotes, gespeicherte Beiträge, Research-Antworten und Einstellungen bleiben lokal.
- Wird „Verlauf und Interaktionen lokal speichern“ deaktiviert, werden Verlauf, Reaktionen und Interaktionen aus `localStorage` entfernt; während der geöffneten Sitzung funktionieren sie im Arbeitsspeicher weiter.
- Export, Einzellöschung, „Alle Daten löschen“ und Demo-Reset berücksichtigen die Interaktionen.
- Die alten `contextlens.v1.*`-Schlüssel bleiben absichtlich erhalten, damit bestehende Studiendaten nicht durch die Umbenennung unauffindbar werden.
- Die optionale Kamera-Vorschau zeigt nur einen lokalen Videostream. Sie analysiert, speichert oder sendet keine Bilder und stoppt ihre Tracks beim Abschalten.

## Projektstruktur

```text
src/
  app/           Routing, ETHOS-Shell und globaler Zustand
  components/    geteilte UI-Bausteine
  data/          Posts, Analysen, Community-Werte und Demo-Profil
  features/
    analytics/          Community- und persönliche Statistiken
    context-assistant/  Kontext-Erklärung
    device/             Smartphone-Rahmen und Statusleiste
    feed/               Instagram- und Reddit-Postkarten
    plugin/             ETHOS-Schicht über Social Apps
    reactions/          Selbstauskunft und Kamera-Vorschau
    research-mode/      geführte Szenarien
    simulation/         deterministische Mock-Engine
    social-app/         Instagram- und Reddit-Shells
  lib/ pages/ styles/ test/ types/
docs/            Produkt-, Technik-, Prüf- und Prompt-Dokumentation
```

## Dokumentation

Die zentralen Dokumente sind:

- [`docs/product-brief.md`](docs/product-brief.md)
- [`docs/architecture.md`](docs/architecture.md)
- [`docs/user-flows.md`](docs/user-flows.md)
- [`docs/screen-specification.md`](docs/screen-specification.md)
- [`docs/privacy-review.md`](docs/privacy-review.md)
- [`docs/accessibility-review.md`](docs/accessibility-review.md)
- [`docs/test-plan.md`](docs/test-plan.md)
- [`docs/known-limitations.md`](docs/known-limitations.md)
- [`docs/decisions.md`](docs/decisions.md)
- [`docs/prompt-documentation/prompt-catalog.md`](docs/prompt-documentation/prompt-catalog.md) – kanonischer Prompt-Katalog P-001 bis P-013
- [`AGENTS.md`](AGENTS.md) – KI-Einsatz und historische Rollenverteilung

## Verifikation und bewusste Grenzen

Der Stand vom 20.08.2026 besteht `npm run typecheck`, 133/133 Tests und `npm run build`. Nach der separat geprüften Migration auf React Router 7.18.2 meldet `npm audit` keine bekannte Schwachstelle.

Playwright-Tests, eine globale Error Boundary und viewportgenaues View-Tracking sind sinnvolle nächste Schritte, aber nicht Teil dieser risikoarmen Erweiterung. Weitere Grenzen stehen in [`docs/known-limitations.md`](docs/known-limitations.md).

---

*Studienarbeit. Alle zur Entwicklung eingesetzten Prompt-Inhalte und verfügbaren historischen Zusammenfassungen stehen unter `docs/prompt-documentation/`.*
