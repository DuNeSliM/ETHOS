# Architektur

Stand: 20.08.2026 · Drei-App-Smartphone mit Instagram-, Reddit- und ETHOS-Bereich.

## Technischer Rahmen

| Baustein | Version | Zweck |
|---|---:|---|
| React / React DOM | 18.3 | UI und Zustand |
| TypeScript | 5.7, strict | Typverträge |
| Vite | 6.4 | Entwicklung und Build |
| Tailwind CSS | 4.x | Token-basierte Styles |
| React Router | 7.18.2 | deklaratives Routing und Legacy-Redirects |
| Recharts | 3.10.1 | persönliche Visualisierungen |
| React Is | 18.3.1 | passendes Recharts-Peer für React 18 |
| Vitest / Testing Library | 3.2 / 16.x | Komponenten-, Daten- und Smoke-Tests |

Harte Grenzen: kein Backend, keine Datenbank, keine Anmeldung, keine Social-Media-API, keine Netzwerktelemetrie, keine echte Inhalts- oder Emotionserkennung. Die optionale Webcam dient ausschließlich als lokale Vorschau.

## Schichten und Shells

```text
DeviceLayout
├── PhoneHomePage                       /phone
├── SocialAppShell (Instagram)          /instagram/*
│   └── VisualFeed / native comments / ETHOS detail
├── RedditAppShell                      /reddit/*
│   └── DiscussionFeed / native post / ETHOS detail
└── AppShell (ETHOS)                    /ethos/*
    ├── Overview
    ├── Settings
    ├── Privacy
    └── Research
```

Instagram und Reddit besitzen jeweils eigenes Chrome und eine sichtbare inoffizielle Mock-Kennzeichnung. Über beiden liegen `PluginStatusStrip`, `PluginOverlay`, Kontext-Erklärung, Community-Auswertung und optionale Selbstauskunft. `AppShell` ist das Chrome der eigenständigen ETHOS-App. Jede Shell enthält einen zugänglichen Home-Weg nach `/phone`.

`DeviceLayout` besitzt zusätzlich rein lokalen Präsentationszustand. Im Desktopmodus blendet `phoneFullscreen` die erklärende `DeviceCaption` aus und wechselt den Telefonrahmen auf größere, viewportbegrenzte Maße. Es wird bewusst keine Browser-Fullscreen-API und keine Berechtigung benötigt; der Beenden-Schalter bleibt außerhalb des transformierten Geräts erreichbar.

## Routen

Kanonisch:

| Bereich | Routen |
|---|---|
| Gerät | `/phone` |
| Instagram | `/instagram`, `/instagram/post/:postId` (Kommentare), `/instagram/post/:postId/ethos` (Analyse) |
| Reddit | `/reddit`, `/reddit/post/:postId` (Post/Kommentare), `/reddit/post/:postId/ethos` (Analyse) |
| ETHOS | `/ethos/overview`, `/ethos/settings`, `/ethos/privacy`, `/ethos/research` |

Normale Kommentar-Controls verlinken ausschließlich auf die native Plattformroute. Nur der klar abgesetzte ETHOS-Streifen verlinkt auf die `/ethos`-Detailroute mit Inhaltsanalyse, Reaktionsverlauf und Community-Verteilung. Kompatibilitäts-Redirects erhalten `/feed`, `/feed/visual`, `/feed/discussion`, `/post/:postId`, `/overview`, `/settings`, `/privacy` und `/research`. Der Legacy-Detailredirect liest `post.platform` und wählt die native Ansicht der richtigen Social App.

## Datenvertrag

`src/types/index.ts` trennt vier epistemisch verschiedene Quellen:

- `ContentAnalysis`: handgeschriebene Aussage über den Beitrag.
- `estimatedExpression`: simulierte Vermutung über sichtbaren Ausdruck.
- `selfReportedReaction`: aktive Angabe der Person selbst.
- `CommunityReactionData`: aggregierte, simulierte Gruppenwerte mit getrennten Quellen.

Diese Felder dürfen nie verschmolzen werden. Zusätzlich:

```ts
type SocialPlatform = 'instagram' | 'reddit';

type PostEngagement = {
  postId: string;
  platform: SocialPlatform;
  liked: boolean; // Like auf Instagram, Upvote auf Reddit
  saved: boolean;
  updatedAt: number;
};
```

Jeder `Post` besitzt `platform`; `getPostsForPlatform()` übernimmt die Filterung. Historische Feed-Modi und der UI-Umschalter sind entfernt.

## Zustand und Speicherung

`AppStateProvider` ist die einzige Schreibstelle für:

- Einstellungen und Onboarding-Zustand,
- Verlauf und `ViewerReaction`,
- `PostEngagement`,
- Research-Ergebnisse und Assistenz-Feedback.

Likes/Upvotes und Speichern verwenden in beiden Social Apps dieselben Actions. `storeReactionHistory=false` entfernt Verlauf, Reaktionen und Engagements aus `localStorage`, lässt den React-Zustand aber für die laufende Sitzung intakt. Export, Einzellöschung, Gesamtlöschung und Demo-Reset berücksichtigen Engagements.

Die Präfixe `contextlens.v1.*` bleiben absichtlich unverändert. Das ist interne Rückwärtskompatibilität, keine sichtbare Marke. `snapshotAll()` liest nur diese bekannten Schlüssel; `clearAll()` löscht keine fremden Browserdaten.

## Analytik ohne Quellenvermischung

`DEMO_PROFILE` ist ein deterministischer, explizit fiktiver Datensatz. `buildSessionAnalytics()` wird separat aus Engagements und aktiven Selbstauskünften abgeleitet. Verlauf steuert keine Likes, automatische Ausdrucksschätzungen steuern keine Emotionsstatistik. Die UI wählt genau eine `AnalyticsSource`:

```text
Simuliertes Profil ──┐
                    ├── PersonalAnalyticsCharts (jeweils nur eine Quelle)
Diese Sitzung ──────┘
```

Die drei Diagramme besitzen immer eine Textalternative:

- Donut + Liste für gelikte Inhaltskategorien,
- 100-%-Stapel + Tabelle für Selbstauskünfte je Kategorie,
- direkt beschriftete Balken für Instagram/Reddit.

Animationen sind deaktiviert. Tokens liefern Hell-/Dunkelwerte; Farbe wird durch Text, Reihenfolge, Icons und Tabellen redundant kodiert.

## Verzeichnisgrenzen

```text
src/app/          Routing, Shell, globaler Zustand
src/data/         statische Mock-Daten und Demo-Profil
src/features/     Domänenkomponenten und reine Analytik-Ableitung
src/lib/          Identität, Labels, Speicherung, Hilfen
src/pages/        Seitendekomposition
src/types/        importfreier gemeinsamer Vertrag
src/test/         jsdom-Setup und Renderer
```

## Build, Tests und Abhängigkeiten

`npm run typecheck` nutzt `tsc -b --noEmit`; dadurch entstehen keine JavaScript-Duplikate neben TypeScript-Dateien. Vite trennt React und Recharts in Vendor-Chunks. React Router läuft im deklarativen v7-Modus mit `BrowserRouter`/`Routes`; die früheren v6-Future-Flags sind in v7 Standard und wurden entfernt. `scrollTo` und Diagrammdimensionen werden in jsdom realistisch genug gemockt, und Research-Mode-Benachrichtigungen erfolgen nicht mehr in einem fremden Render-Zyklus.

Aktueller Stand: 133/133 Tests, Typprüfung und Produktionsbuild erfolgreich. Nach der Migration auf React Router 7.18.2 meldet `npm audit` null bekannte Schwachstellen.

## Erweiterungsrezepte

### Beitrag ergänzen

1. `Post` mit kanonischem `platform` in `src/data/posts.ts` hinzufügen.
2. Analyse, Community-Daten und optional Verlauf/Schätzung unter derselben ID ergänzen.
3. Datenintegritäts- und Plattformtests ausführen.

Reddit-Medien mit `media.src` rendert `RedditPostMedia` nativ. Bilder erhalten `altText`; Videos verwenden Browser-Controls, kein Autoplay, keine Stummschaltung und einen minimalen Seek nach dem Laden der Metadaten, damit der erste Frame im pausierten Zustand dekodiert wird. Instagram-Medien bleiben im simulierten Player, weil nur dieser die feste ETHOS-Zeitachse antreibt.

Das Doom-Video ist 4:3 kodiert und wird deshalb in einem 4:3-Element über die volle Kartenbreite gerendert. So entsteht keine durch ein 16:9-Zielformat verursachte seitliche Letterbox. Textlose Medienposts lassen den optionalen Body-Block vollständig weg.

### Neue persönliche Statistik

1. Quelle im `PersonalAnalyticsSnapshot` typisieren.
2. Demo-Wert und Session-Ableitung getrennt ergänzen.
3. Grafik mit semantischer Alternative und leerem Zustand bauen.
4. Sicherstellen, dass keine automatische Schätzung als Selbstauskunft gezählt wird.

## Bewusste Vereinfachungen

Ein React-Context, keine i18n-Schicht, keine Playwright-Suite, keine globale Error Boundary und kein viewportgenaues View-Tracking. Siehe `known-limitations.md`.
