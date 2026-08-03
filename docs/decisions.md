# Produktentscheidungen

Zentrale Entscheidungen für den ContextLens-Prototypen. Jede Entscheidung nennt
Kontext, Entscheidung, Begründung und Konsequenz. Neue Entscheidungen werden
unten angehängt, alte nicht gelöscht.

---

## E-001: Assistenzschicht statt Emotions-Tracker

**Kontext.** Die ursprüngliche Projektidee (siehe `README.md` im
Ausgangszustand und die Präsentation `Gruppe_4.pptx`) beschreibt eine im
Hintergrund laufende App, die dauerhaft per Frontkamera Emotionen erfasst, sie
mit dem Bildschirminhalt verknüpft und daraus einen personenbezogenen Datensatz
aufbaut, um „die Nutzererfahrung in anderen Apps zu verbessern".

**Entscheidung.** Der Prototyp setzt stattdessen eine **freiwillig
aktivierbare Assistenzschicht** um, die Inhalte erklärt. Dauerhafte
Hintergrunderfassung ist nicht Teil des Produkts.

**Begründung.** Eine permanent mitlaufende Emotionserfassung ist rechtlich
(biometrische Daten, DSGVO Art. 9; Beschränkungen für Emotionserkennung im
EU AI Act), ethisch und in der Nutzerakzeptanz kaum zu vertreten. Der eigentliche
Nutzen für die Zielgruppe liegt außerdem nicht in der Erfassung, sondern in der
**Erklärung** sozialer Signale.

**Konsequenz.** Alle Erfassungsfunktionen sind opt-in und standardmäßig aus.
Der Fokus der UI liegt auf der Assistenzkarte, nicht auf einem Emotions-Dashboard.

---

## E-002: Verkauf von Nutzerdaten und KI-Training verworfen

**Kontext.** Die Präsentation listet im Geschäftsmodell unter anderem
„Verkauf Nutzerdaten", „Trainingsdaten" und „KI-Modell trainieren" als
Erlösquellen bzw. Aktivitäten – gestützt auf die gesammelten Reaktionen.

**Entscheidung.** Verworfen. Der Prototyp kennt keinen Empfänger für Daten.
Es gibt kein Backend, keinen Upload und keine Trainingsdatensammlung.

**Begründung.** Das steht in direktem Widerspruch zum Vertrauensversprechen der
Anwendung. Ein Produkt, das erklärt „wir wissen nicht sicher, wie du dich
fühlst", und dieselben Daten anschließend verkauft, ist nicht glaubwürdig.
Für die Zielgruppe – Menschen, die ohnehin Unsicherheit im sozialen Umgang
erleben – wäre das besonders schädlich.

**Konsequenz.** Im Datenschutz-Dashboard wird ausdrücklich ausgewiesen, dass
nichts gesendet wird. Die Behauptung ist im Code überprüfbar (siehe
`docs/privacy-review.md`).

---

## E-003: Strikte Trennung von vier Aussageebenen

**Entscheidung.** Inhaltsanalyse, maschinelle Schätzung über die betrachtende
Person, deren aktive Selbstauskunft und aggregierte Community-Daten werden nie
zusammengeführt – weder im Datenmodell noch in der UI.

**Begründung.** Das ist die inhaltliche Kernidee. „Der Beitrag wirkt
sarkastisch" ist eine andere Art von Aussage als „bei dir ist ein Lächeln
sichtbar", und beides ist etwas anderes als „ich war genervt".

**Konsequenz.**
- Namenskonvention in `src/types/index.ts`: `...Analysis`, `estimated...`,
  `selfReported...`.
- `CommunityReactionSummary` hat zwei getrennte Verteilungen, die nirgends
  addiert oder gemittelt werden; die UI hat dafür einen Quellen-Umschalter.
- `OwnReactionControl` zeigt Schätzung und Selbstauskunft immer als zwei
  beschriftete Zeilen. Eine Korrektur überschreibt die Schätzung nicht.

---

## E-004: Ausdrucksbeschreibung statt Emotionsbehauptung

**Entscheidung.** Maschinelle Schätzungen über die betrachtende Person
beschreiben ausschließlich **sichtbares Verhalten** („Sichtbares Lächeln",
„Angespannter Gesichtsausdruck"). Emotionswörter („amüsiert", „genervt") sind
der Selbstauskunft vorbehalten.

**Begründung.** Aus einem Gesichtsausdruck folgt kein innerer Zustand. Die
Trennung macht diese Grenze im Wortlaut sichtbar, statt sie nur in einem
Kleingedruckten zu erwähnen.

**Konsequenz.** Zwei getrennte Vokabulare in `src/lib/labels.ts`:
`EXPRESSION_LABEL` und `SELF_REPORT_LABEL`. Der Reaktionsverlauf trägt beides:
das Alltagswort als Label und die Ausdrucksbeschreibung als Datenfeld.

---

## E-005: Kartenvariante wird abgeleitet, nicht gespeichert

**Entscheidung.** Die sieben Darstellungsvarianten der Assistenzkarte werden in
`deriveCardVariant()` aus der Analyse berechnet, statt pro Beitrag hinterlegt zu
werden.

**Begründung.** So kann eine Überschrift nie im Widerspruch zu den Daten
stehen, die sie zusammenfasst. Beim Redigieren der Beispieldaten kann keine
Inkonsistenz entstehen.

**Konsequenz.** Feste Rangfolge (kein Indikator → Ragebait → Sarkasmus/Ironie →
emotional → Humor → uneindeutig), abgesichert durch Tests.

---

## E-006: Hinweise nur auf Anfrage (Standard)

**Entscheidung.** Standardmäßig ist über einem Beitrag **nichts** von der
Analyse zu sehen. Erst „Kontext erklären" öffnet die Karte. Optional lässt sich
ein dezenter Marker aktivieren (`hintVisibility: 'subtle-auto'`).

**Begründung.** Der Auftrag verbietet dauerhafte große Emotionsanzeigen über dem
Inhalt. Außerdem ist „Wie aufdringlich ist das?" eine der zu untersuchenden
Forschungsfragen – dafür braucht es beide Zustände.

---

## E-007: Ein Beispiel schätzt absichtlich falsch

**Entscheidung.** Für `v-ragebait` liefert die Mock-Engine „sichtbares Lächeln",
obwohl die meisten Menschen den Beitrag als ärgerlich beschreiben.

**Begründung.** Der Auftrag verlangt ein Szenario mit falscher oder unklarer
Analyse. Ohne einen echten Fehlfall lässt sich nicht beobachten, ob Testpersonen
die Korrekturfunktion finden und ob sie einer Schätzung widersprechen.

**Konsequenz.** Research-Mode-Szenario 3 baut darauf auf. Im Debriefing muss
offengelegt werden, dass dieser Fehler beabsichtigt war.

---

## E-008: Generische Demo-Plattform statt Plattform-Klon

**Entscheidung.** Der Feed heißt „Visual Feed" bzw. „Discussion Feed" und
verwendet erfundene Konten, Communities und Zahlen. Keine Logos, Namen oder
Layouts bestehender Plattformen.

**Begründung.** Markenrechtlich sauber, und für die Forschungsfrage irrelevant –
untersucht wird die Assistenzschicht, nicht die Plattform.

---

## E-009: Simulierte Medien als beschriebene Platzhalter

**Entscheidung.** Statt Beispielbildern oder -videos werden Platzhalter mit
einer **Textbeschreibung** dessen gezeigt, was zu sehen wäre.

**Begründung.** Erstens gibt es keine lizenzfreien Videos, die genau die
benötigten Mimiken zeigen. Zweitens macht die Beschreibung unmissverständlich,
dass nichts analysiert wurde. Drittens erhalten Screenreader-Nutzende dieselbe
Information wie sehende Personen.

**Konsequenz.** Die Beschreibung ist sichtbarer Inhalt, nicht nur `alt`-Text.

---

## E-010: Ehrliches „keine Einschätzung"

**Entscheidung.** Ein Beitrag (`v-lowcontext`) erzeugt bewusst gar keine
Einschätzung, sondern die Variante „Zu wenig Kontext".

**Begründung.** Ein System, das immer eine Antwort hat, verleitet zu
Übervertrauen. Zurückhaltung ist selbst eine testbare Produkteigenschaft.

---

## E-011: Deutsch als einzige Sprache, ohne i18n-Schicht

**Entscheidung.** Die Oberfläche ist ausschließlich deutsch. Alle Texte liegen
zentral in `src/lib/labels.ts` bzw. in den Komponenten, ohne
Übersetzungsbibliothek.

**Begründung.** Die Nutzertests finden auf Deutsch statt. Eine i18n-Schicht wäre
Aufwand ohne Nutzen für die Fragestellung. Die zentrale Label-Datei erlaubt
trotzdem ein Wortlaut-Audit an einer Stelle.

**Konsequenz.** Eine spätere Internationalisierung erfordert Nacharbeit.

---

## E-012: Ein React-Context statt State-Bibliothek

**Entscheidung.** Der gesamte Zustand liegt in `AppStateProvider`.

**Begründung.** Der Datenumfang ist klein. Wichtiger: Wenn genau eine Datei alle
Schreibvorgänge besitzt, lässt sich die Datenschutzaussage „mehr wird nicht
gespeichert" tatsächlich prüfen.

**Konsequenz.** Breitere Re-Renders als nötig. Für diese Anwendungsgröße
irrelevant.

---

## E-013: Rollen der Subagents und Integration im Hauptchat

**Entscheidung.** Die Implementierung (Agent 4 Feed/UI, Agent 5 Simulation/
Analytics) wurde im Hauptchat ausgeführt, um Konsistenz über gemeinsame Dateien
zu sichern. Dokumentation und Review wurden an Subagents vergeben.

**Begründung.** Parallel schreibende Agents in `src/` hätten sich bei
Design-Tokens, Typen und der Mock-Engine gegenseitig überschrieben.

**Konsequenz.** Vier von fünf Subagents brachen wegen eines Sitzungslimits ab;
deren Dokumente wurden im Hauptchat fertiggestellt. Siehe `AGENTS.md`.

---

## E-014: Die Demo läuft auf einem simulierten Telefon

**Kontext.** Bis dahin lief der Prototyp als normale Website: eine Kopfzeile mit
ContextLens-Logo, darunter der Feed. Damit war die zentrale Produktaussage – die
Assistenz liegt **über einer fremden App** – nur behauptet, nicht sichtbar. Eine
Testperson konnte den Feed für einen Teil von ContextLens halten, und für die
Vorführung sah alles nach „Demo" statt nach Produkt aus.

**Entscheidung.** Die gesamte Demo läuft in einem simulierten Telefon
(`features/device/`): Geräterahmen, Betriebssystem-Statusleiste,
Startbildschirm mit App-Symbolen, darauf zwei getrennte Apps – die simulierte
Plattform und ContextLens.

**Begründung.** Das Verhältnis der drei Beteiligten (Gerät, Plattform,
Assistenzschicht) wird dadurch ohne Erklärtext erfahrbar. Für die Nutzertests
ist das entscheidend: Die Frage „Wem gehört dieser Hinweis?" ist eine der
Forschungsfragen und lässt sich nur beantworten, wenn die Grenze sichtbar ist.

**Konsequenz.**
- Ab `lg` (1024 px) wird der Rahmen gezeichnet, darunter läuft die Ansicht
  bildschirmfüllend – auf einem echten Telefon ist der Browser bereits das Gerät.
- Die Bildschirmfläche ist der Scrollcontainer, nicht das Fenster. `AppShell`
  und `SocialAppShell` scrollen deshalb über `lib/viewport.ts` und nicht über
  `window.scrollTo`.
- `position: fixed` löst innerhalb des Rahmens gegen den Telefonbildschirm auf.
  Das erzwingt die `transform`-Regel in `.device-screen` (siehe
  `docs/design-system.md`).
- Das Layout ist ab sofort ausschließlich telefonorientiert. Mehrspaltige
  Desktop-Layouts wurden entfernt, nicht nur ausgeblendet. Zur verbleibenden
  Grenze siehe `docs/known-limitations.md`.

---

## E-015: Eine erfundene Plattform statt einer nachgebauten Marke

**Kontext.** Der Wiedererkennungswert einer Foto-Sharing-Oberfläche ist für die
Demo wertvoll: Wer den Feed sofort einordnen kann, richtet seine Aufmerksamkeit
auf die Assistenzschicht statt auf eine unbekannte Bedienlogik.

**Entscheidung.** Übernommen werden **Konventionen der Gattung** – Wortmarke mit
Farbverlauf, Stories-Streifen, randlose 4∶5-Medien, Aktionszeile, Tab-Leiste.
Nicht übernommen wird irgendetwas Markenspezifisches. Die Plattform heißt
`Momento` (`features/social-app/platform.ts`), Konten, Zahlen und Beiträge sind
erfunden, der Farbverlauf ist eine eigene Rampe.

**Begründung.** Der Erkennungsgewinn stammt aus der Struktur, nicht aus dem
Logo. Ein nachgebautes Markenzeichen brächte rechtliche Fragen und würde
außerdem suggerieren, es gäbe eine Kooperation oder eine echte Integration.

**Konsequenz.** Jede Feed-Ansicht trägt einen sichtbaren Hinweis, dass es sich
um eine erfundene App handelt. Der Name liegt in einer Konstante und ist für
eine andere Studienrahmung an einer Stelle austauschbar.

---

## E-016: Die Assistenzschicht bekommt eine eigene, dauerhaft sichtbare Präsenz

**Kontext.** Wenn ContextLens nur noch aus Elementen innerhalb der Beiträge
besteht, verschwimmt es mit der Plattform – genau das Missverständnis, das E-014
auflösen soll.

**Entscheidung.** Über der Plattform liegen zwei Elemente, die eindeutig zur
Assistenzschicht gehören: eine schmale Statusleiste unter der App-Kopfzeile und
ein schwebender Knopf („ContextLens öffnen"), der ein Panel mit Status,
Hauptschalter und Verweisen in die ContextLens-App öffnet.

**Begründung.** Der Knopf allein beantwortet die Frage „Läuft die Kamera
gerade?" nicht, denn dafür müsste man ihn erst öffnen. Die Statusleiste allein
bietet keinen Weg in die Verwaltung. Zusammen decken sie beides ab, und beide
tragen die Assist-Farbfamilie, während die Plattform schwarz auf weiß bleibt.

**Konsequenz.** Das Panel ist ausschließlich eine Abkürzung. Jede Funktion
darin ist auch über die ContextLens-App erreichbar; wer den Knopf nie findet,
verliert keine Funktion.
