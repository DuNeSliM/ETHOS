# Datenschutz-Review

**Methode.** Manuelles Code-Audit des gesamten `src/`-Verzeichnisses, ergänzt um
gezielte Suchläufe (ripgrep) nach Netzwerk-, Kamera- und Speicher-APIs. Kein
Penetrationstest, keine Laufzeitanalyse mit Netzwerk-Mitschnitt.

**Prüfgegenstand.** Stimmen die Aussagen, die die Oberfläche gegenüber
Testpersonen macht, mit dem Code überein?

---

## 1. Verifizierte Aussagen

### 1.1 „Es verlässt nichts diesen Browser"

Gesucht wurde im gesamten `src/` nach:
`fetch(`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`, `http://`, `https://`.

**Ergebnis: null Treffer.** Der einzige Treffer für `MediaRecorder` und
`drawImage` liegt in einem *Kommentar* in `CameraPreview.tsx`, der ausdrücklich
festhält, dass diese APIs nicht verwendet werden.

**Bewertung:** Die Aussage ist zutreffend. Der Prototyp kann strukturell keine
Daten senden — es existiert kein Code dafür. Auch der Datenexport läuft über
`URL.createObjectURL` auf einen Blob (`src/lib/storage.ts`, `downloadFile`) und
damit rein lokal.

### 1.2 „Es werden keine Bilder erzeugt, gespeichert oder übertragen"

Gesucht nach `canvas`, `drawImage`, `toDataURL`, `getImageData`,
`createImageBitmap`, `MediaRecorder`.

**Ergebnis: null Treffer im ausführbaren Code.**

`getUserMedia` erscheint genau einmal (`CameraPreview.tsx:44`). Der Stream wird
ausschließlich an `videoRef.current.srcObject` gehängt (Zeile 50). Es gibt
keinen Pfad, auf dem ein Einzelbild ausgelesen würde.

**Freigabe der Kamera:** `stop()` beendet alle Tracks und setzt `srcObject` auf
`null`; `useEffect(() => stop, [stop])` ruft das beim Unmount auf. Die
Kamera-Leuchte des Geräts erlischt also, wenn die UI „Kamera aus" anzeigt.

**Bewertung:** Zutreffend. Die Vorschau ist tatsächlich reine Anzeige.

### 1.3 „Alles bleibt lokal im localStorage"

`localStorage` wird ausschließlich in `src/lib/storage.ts` angesprochen
(Zeilen 49, 60, 69) — kein anderer Produktionscode greift direkt darauf zu.
Alle Schlüssel sind unter `contextlens.v1.` namespaced und in
`ALL_STORAGE_KEYS` aufgeführt, wodurch `clearAll()` nachweislich alles erfasst,
was die App anlegt, und nichts Fremdes löscht.

**Bewertung:** Zutreffend und gut auditierbar.

### 1.4 Einwilligungs-Standardwerte

`DEFAULT_SETTINGS` in `src/app/AppStateProvider.tsx`:

| Einstellung | Standard | Bewertung |
|---|---|---|
| `simulatedCameraCapture` | `false` | korrekt — Auftragsvorgabe erfüllt |
| `liveCameraPreview` | `false` | korrekt |
| `shareAnonymousReaction` | `false` | korrekt |
| `contentAnalysis` | `true` | vertretbar, siehe Befund D-03 |
| `showCommunityReactions` | `true` | vertretbar |
| `storeReactionHistory` | `true` | siehe Befund D-04 |

Abgesichert durch Tests in `smoke.test.tsx` und `mockEngine.test.ts`.

### 1.5 Kopplung der Kameraschalter

`updateSetting` erzwingt: Wird `simulatedCameraCapture` abgeschaltet, werden
`liveCameraPreview` und `shareAnonymousReaction` mit abgeschaltet. Damit kann
kein Zustand entstehen, in dem eine Vorschau läuft, obwohl die Erfassung
laut UI aus ist. Durch Test abgesichert.

### 1.6 Löschen löscht wirklich

- Einzelner Eintrag (`deleteHistoryEntry`) entfernt zusätzlich den zugehörigen
  Reaktionsdatensatz — sonst bliebe die Schätzung nach dem „Löschen" bestehen.
- `deleteAllData()` leert State **und** entfernt die Schlüssel.
- Wird `storeReactionHistory` abgeschaltet, werden vorhandene Schlüssel aktiv
  entfernt, nicht nur weitere Schreibvorgänge unterlassen
  (`AppStateProvider.tsx`, Persistenz-Effekt).

**Bewertung:** Korrekt umgesetzt.

---

## 2. Befunde

| ID | Datei | Schwere | Befund | Empfehlung |
|---|---|---|---|---|
| D-01 | `PostDetailPage.tsx` | mittel | Der Leerzustand der Community-Anzeige nannte pauschal die Nutzereinstellung als Grund, auch wenn tatsächlich der Assistent pausiert war oder schlicht keine Daten existieren. Eine falsche Aussage über die eigenen Einstellungen der Testperson. | **behoben** — die drei Fälle werden jetzt unterschieden |
| D-02 | `styles/index.css` | mittel | `--cl-text-faint` (3,91:1) und `--cl-border-strong` (1,84:1) verfehlten die Kontrastanforderungen. Betrifft u. a. Datenschutzhinweise in kleiner Schrift. | **behoben** — neue Werte, siehe `accessibility-review.md` |
| D-03 | `AppStateProvider.tsx` | niedrig | `contentAnalysis` ist standardmäßig `true`. Für ein echtes Produkt wäre ein Opt-in sauberer. | Für den Prototyp vertretbar: das Onboarding zeigt den Schalter vor dem ersten Feed-Besuch, und die Analyse betrifft nur Inhalte, nicht die Person. In `decisions.md` dokumentiert. |
| D-04 | `AppStateProvider.tsx` | niedrig | `storeReactionHistory` ist standardmäßig `true`, bevor überhaupt etwas erfasst werden kann. | Unkritisch, da ohne aktive Erfassung nur Aufrufzeitpunkte gespeichert werden. Sollte im Debriefing erwähnt werden. |
| D-05 | `CameraPreview.tsx` | niedrig | Bricht `getUserMedia` ab, wird eine Sammelmeldung gezeigt (Ablehnung, kein Gerät, Gerät belegt). | Bewusst so: Die Rohfehlermeldung des Browsers kann Gerätenamen enthalten. Beibehalten. |
| D-06 | `ResearchModePage.tsx` | niedrig | Der Freitext der Bewertung wird unverändert exportiert. Testpersonen könnten dort personenbezogene Angaben hinterlassen. | Vor der Auswertung sichten. Im Testleitfaden vermerkt (`test-plan.md`). |

Keine Befunde der Schwere **hoch**.

---

## 3. Wortlaut-Prüfung

Geprüft wurden `src/lib/labels.ts`, `src/data/analyses.ts`, `src/data/community.ts`
sowie alle Seiten- und Komponententexte.

**Positiv:**

- Alle Inhaltseinschätzungen sind abgeschwächt. Ein automatisierter Test
  (`data.test.ts`, „keeps every explanation hedged") erzwingt, dass jede
  Erklärung mindestens eine Abschwächung enthält, und ein zweiter Test verbietet
  Formulierungen wie „ist definitiv" oder „die KI kennt".
- Maschinelle Schätzungen über die betrachtende Person verwenden ausschließlich
  Ausdrucksbeschreibungen (`EXPRESSION_LABEL`), Emotionswörter sind der
  Selbstauskunft vorbehalten (`SELF_REPORT_LABEL`). Zwei getrennte Vokabulare.
- Die Ragebait-Karte stellt ausdrücklich klar, dass die *Formulierung* bewertet
  wird und nicht die Sachfrage — genau das Missverständnis, das dieses Label
  sonst erzeugt.
- Die persönliche Übersicht enthält keine Bewertung der Person. Eine Abweichung
  zwischen Schätzung und Selbstauskunft wird ausdrücklich nicht als „Fehler" der
  Testperson dargestellt.
- Jede Analyse nennt ihre Grenzen; das ist per Test erzwungen.

**Angepasst im Verlauf des Reviews:**

| Ursprünglich | Problem | Neu |
|---|---|---|
| „Der Beitrag ist stark zuspitzend formuliert." (`d-polarising`) | Feststellung statt Vermutung | „Der Beitrag **wirkt** stark zuspitzend formuliert. … Ob das so gemeint ist oder nur scharf klingt, **kann die Analyse nicht entscheiden**." |
| „Überschrift und Inhalt passen nicht zusammen. …" (`d-aggressive-headline`) | keine Abschwächung, obwohl die Karte „nicht eindeutig" heißt | Ergänzt um „Welcher Teil die eigentliche Aussage ist, **ist nicht eindeutig**." |

**Keine Fundstellen** für die im Auftrag verbotenen Formulierungen
(„Die Person ist wütend", „definitiv Ragebait", „macht dich glücklich",
„Die KI kennt deine Emotion").

---

## 4. Bewertung des Einwilligungsflusses

Der Fluss ist mehrstufig und wiederholt zugänglich:

1. Landing Page benennt vorab, was das Produkt **nicht** ist.
2. Onboarding-Schritt 4 erklärt Datenschutz, bevor eine Entscheidung ansteht.
3. Onboarding-Schritt 5 ist die eigentliche Einwilligung, mit separaten
   Schaltern und der Kameraerfassung optisch abgesetzt in einem eigenen Block.
4. Die StatusBar zeigt auf **jedem** Screen dauerhaft Analyse- und Kamerastatus.
5. `/settings` und `/privacy` sind jederzeit über die Hauptnavigation erreichbar.

**Positiv hervorzuheben:** Ein abgeschalteter Zustand wird ausgesprochen
(„Kamera aus"), nicht nur durch Abwesenheit signalisiert. Wird ein Hinweis
wegen einer Einstellung zurückgehalten, nennt die App die konkrete Einstellung
und verlinkt sie.

**Schwäche:** Das Onboarding lässt sich überspringen. Das ist beabsichtigt (die
Standardwerte sind verteidigbar), sollte in der Auswertung aber berücksichtigt
werden, wenn eine Testperson die Einwilligung nie gesehen hat.

---

## 5. Was eine echte Produktversion zusätzlich bräuchte

*Nicht im Prototyp umgesetzt — hier nur zur Einordnung.*

- **Rechtsgrundlage.** Gesichtsbezogene Emotionserkennung verarbeitet
  biometrische Daten. Nach DSGVO Art. 9 sind das besondere Kategorien
  personenbezogener Daten; erforderlich wäre eine ausdrückliche, informierte und
  jederzeit widerrufbare Einwilligung (Art. 9 Abs. 2 lit. a).
- **EU AI Act.** Emotionserkennung ist reguliert; am Arbeitsplatz und in
  Bildungseinrichtungen ist sie weitgehend verboten, in anderen Kontexten
  bestehen Transparenzpflichten. Ein reales Produkt müsste seine Einordnung
  begründen.
- **Wissenschaftliche Grundlage.** Der Schluss von Gesichtsausdruck auf
  Emotion ist fachlich umstritten; Ausdrücke variieren stark zwischen Personen
  und Kulturen. Die im Prototyp gewählte Formulierung („sichtbarer Ausdruck",
  nicht „Emotion") ist deshalb keine Kosmetik, sondern inhaltlich notwendig.
- **Datenminimierung.** Eine reale Umsetzung müsste Auswertung ausschließlich
  on-device durchführen und dürfte keine Rohbilder speichern.
- **DSFA.** Eine Datenschutz-Folgenabschätzung wäre voraussichtlich
  verpflichtend.
- **Aggregation.** Community-Werte bräuchten eine Mindestgruppengröße und
  Schutz gegen Rückschlüsse auf Einzelpersonen.
- **Barrierefreiheitserklärung** und ein Meldeweg für Fehleinschätzungen.

---

## 6. Gesamtbewertung

Der Prototyp hält seine Datenschutzversprechen **nachweisbar** ein: Es existiert
kein Code für Netzwerkzugriff, keiner für Bildauswertung, und die Speicherung
ist auf eine auditierbare Datei begrenzt. Die kritischen Standardwerte stimmen,
die Kopplung der Kameraschalter verhindert widersprüchliche Zustände, und
Löschen löscht tatsächlich.

Die Wortwahl ist durchgängig zurückhaltend; zwei zu bestimmte Formulierungen
wurden im Review korrigiert und sind nun durch automatisierte Tests abgesichert.

**Für den Einsatz in moderierten Nutzertests freigegeben.** Zwei Auflagen: Die
Freitexte der Bewertung sind vor der Auswertung zu sichten (D-06), und im
Debriefing ist offenzulegen, dass die Schätzung bei einem Beitrag absichtlich
falsch ist (siehe `decisions.md`, E-007).
