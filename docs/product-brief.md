# Product Brief – ContextLens

## 1. Problem

Soziale Medien transportieren einen großen Teil ihrer Bedeutung nicht im
Wortlaut, sondern in Signalen daneben: Ironie, Sarkasmus, Tonfall, Mimik,
Zuspitzung, Empörungsabsicht. Wer diese Signale schlechter liest, versteht
Beiträge systematisch anders als gemeint – und merkt das oft nicht.

Besonders betroffen sind Menschen, denen die Interpretation sozialer Signale
schwerfällt, etwa autistische Personen. Aber das Problem ist nicht auf eine
Gruppe beschränkt: Ironie im Textformat ist ohne Tonfall für alle unsicher, und
gezielt emotionalisierende Beiträge wirken auch auf geübte Leserinnen und Leser.

**Wichtig für die Positionierung:** ContextLens ist kein Hilfsmittel, das ein
Defizit ausgleicht. Es ist eine Erklärfunktion, die jede Person einschalten
kann. Die Zielgruppe profitiert am stärksten, wird aber nicht als „zu
reparieren" adressiert.

## 2. Vision

ContextLens ist eine freiwillig aktivierbare Assistenzschicht über einem
Social-Media-Feed. Sie erklärt auf Anfrage, was in einem Beitrag mitschwingen
könnte, macht die Unsicherheit dieser Einschätzung sichtbar und zeigt, wie
unterschiedlich derselbe Beitrag auf andere Menschen wirkt. Sie behauptet nie,
Gedanken oder Gefühle zu kennen – weder die des Autors noch die der
betrachtenden Person. Sie nimmt die Deutung nicht ab, sondern macht sie
verhandelbar.

## 3. Die vier Ebenen

Die strikte Trennung dieser vier Aussagetypen ist die Kernidee des Produkts.

| # | Ebene | Aussagetyp | Beispiel |
|---|---|---|---|
| 1 | **Inhaltsanalyse** | über den Beitrag | „Wahrscheinlich sarkastisch" |
| 2 | **Geschätzte eigene Reaktion** | über sichtbares Verhalten der betrachtenden Person | „Sichtbares Lächeln" |
| 3 | **Aktive Selbstauskunft** | von der Person selbst | „genervt" |
| 4 | **Community-Reaktionen** | aggregiert, freiwillig, anonym | „34 % genervt (Selbstauskunft)" |

Regeln, die daraus folgen:

- Ebene 2 benutzt **nie** Emotionswörter, sondern Ausdrucksbeschreibungen.
- Ebene 3 hat Vorrang vor Ebene 2, **löscht sie aber nicht**. Beide bleiben
  nebeneinander sichtbar.
- In Ebene 4 werden Kamera-Schätzungen und Selbstauskünfte nie addiert oder
  gemittelt, sondern über einen Umschalter getrennt dargestellt.
- Jede Aussage der Ebenen 1 und 2 ist sprachlich abgeschwächt und nennt ihre
  Grenzen.

## 4. MVP-Umfang

### Enthalten

- Zwei simulierte Inhaltsansichten: **Visual Feed** (5 Beiträge) und
  **Discussion Feed** (4 Beiträge mit Kommentar-Threads) – zusammen 9 Beiträge.
- **Context Assistant** pro Beitrag und für ausgewählte Kommentare, mit sieben
  Darstellungsvarianten: Sarkasmus, Ironie, emotionaler Ton, Übertreibung,
  möglicher Ragebait, nicht eindeutig, unzureichender Kontext.
- **Unsicherheitsanzeige** in drei Stufen, immer als Wort, Stufenzahl und Balken.
- **Begründung auf Anfrage** („Warum wird das so eingeschätzt?"), Rückmeldung
  („Nicht hilfreich", „Andere Interpretation") und alternative Lesarten.
- **Simulierte eigene Reaktionserfassung** (opt-in), mit Korrekturmöglichkeit
  über neun Reaktionsoptionen plus Freitext.
- **Optionale lokale Kamera-Vorschau** – reine Anzeige, keine Auswertung.
- **Community-Reaktionen** mit getrennten Quellen, Teilnehmerzahl,
  Repräsentativitätshinweis und Erklärung der Datenherkunft.
- **Reaktionsverlauf** über die Laufzeit von drei Videos, synchron zum Scrubber.
- **Persönliche Übersicht** mit Zählungen, Einzel- und Gesamtlöschung.
- **Datenschutz-Dashboard** mit Zustandsanzeige, JSON-Export, Löschen und
  vollständigem Demo-Reset.
- **Research Mode** mit drei geführten Szenarien, je vier Bewertungsfragen
  (1–5) plus Freitext, lokaler Speicherung und JSON-/CSV-Export.
- Hell-/Dunkelmodus, Tastaturbedienung, responsive Layouts.

### Ausdrücklich nicht enthalten

- Echte KI, echtes Sprachmodell, echte Emotions- oder Mimikerkennung
- Integration in Instagram, TikTok, Reddit, YouTube oder andere Plattformen
- Backend, Datenbank, Benutzerkonten, Authentifizierung
- Übertragung von Daten an irgendeinen Empfänger
- Creator-Analytics, Premium-Funktionen, Monetarisierung
- Moderation, Meldefunktionen, Faktenprüfung

## 5. Zu untersuchende Forschungsfragen

1. Verstehen Nutzende, was die Assistenzfunktion tut?
2. Erkennen sie den Unterschied zwischen Inhaltsanalyse und eigener Reaktion?
3. Sind die Hinweise zu Sarkasmus und Emotionen hilfreich?
4. Sind die Hinweise zu aufdringlich oder störend?
5. Verstehen Nutzende die Unsicherheit der Analyse?
6. Ist die Community-Reaktionsübersicht verständlich?
7. Vertrauen Nutzende einer solchen Funktion?
8. Ist die Kameranutzung ausreichend transparent?
9. Finden Nutzende die Korrektur-, Pausen- und Löschfunktionen?
10. Hilft die Funktion bei der Einordnung von Ragebait und emotionalisierenden
    Beiträgen?

Der Research Mode adressiert die Fragen 1, 2, 3, 4, 5, 6, 7, 9 direkt; Frage 8
und 10 werden über die Szenarien 2 und 3 sowie das Debriefing beobachtet.

## 6. Risiken und mögliche Missverständnisse

| Risiko | Beschreibung | Gegenmaßnahme im Prototyp |
|---|---|---|
| **Übervertrauen** | Testpersonen halten eine erfundene Einschätzung für ein Messergebnis. | „Simuliert"-Kennzeichnung, Unsicherheitsstufe, Grenzen-Block auf jeder Karte, ein Beitrag ohne Einschätzung |
| **Schätzung als Gefühlsaussage gelesen** | „Sichtbares Lächeln" wird als „du bist froh" verstanden. | Getrennte Vokabulare, Hinweistext in der Reaktionskarte, Selbstauskunft mit Vorrang |
| **Prozente als Wahrheit** | Community-Werte werden als repräsentativ gelesen. | Repräsentativitätswarnung bei jedem Datensatz, getrennte Quellen, Teilnehmerzahl, ein Beitrag mit sehr kleiner Gruppe (n = 23) |
| **Ragebait-Label als Sachurteil** | „Könnte auf Reaktionen ausgerichtet sein" wird als „das Thema ist Unsinn" verstanden. | Ausdrücklicher Satz auf der Karte, dass die Formulierung bewertet wird, nicht die Sachfrage |
| **Normalisierung von Kameraerfassung** | Der Prototyp macht Emotionserkennung salonfähig, obwohl sie wissenschaftlich umstritten und regulatorisch beschränkt ist. | Standardmäßig aus, jederzeit pausierbar, Grenzen benannt; siehe `docs/privacy-review.md` |
| **Neuer sozialer Druck** | Nutzende richten ihre Reaktion nach der Community-Verteilung aus. | Community-Daten sind abschaltbar und im Feed nicht sichtbar, sondern erst in der Detailansicht |
| **Fehlanreiz Datenverwertung** | Die ursprüngliche Idee sah Datenverkauf und Modelltraining vor. | Verworfen, siehe E-002 in `docs/decisions.md` |
| **Zielgruppen-Stigmatisierung** | Das Produkt wird als „App für Menschen mit Defizit" wahrgenommen. | Neutrale Ansprache, Nutzen für alle formuliert |

## 7. Bewusst verworfene Ideen

Aus der ursprünglichen Idee (`README`) und der Präsentation `Gruppe_4.pptx`
wurden folgende Punkte geprüft und **nicht** übernommen:

| Idee aus der Vorlage | Bewertung | Begründung |
|---|---|---|
| Dauerhaft im Hintergrund laufende Emotionserfassung | verworfen | Unverhältnismäßig; rechtlich und ethisch nicht tragfähig (siehe E-001) |
| „Happiness Optimization" / Nutzererlebnis in anderen Apps optimieren | verworfen | Optimierung auf Stimmung ist ein Manipulationsziel, kein Assistenzziel |
| Verkauf von Nutzerdaten als Erlösquelle | verworfen | Widerspricht dem Vertrauensversprechen vollständig (siehe E-002) |
| Sammeln von Reaktionen als KI-Trainingsdaten | verworfen | Gleiche Begründung; im Prototyp existiert kein Empfänger |
| Screen Detection / Auswertung des gesamten Bildschirminhalts | verworfen | Massiver Eingriff; für den Nutzen nicht erforderlich |
| Creator-Analytics und Premium-Version für Creator | zurückgestellt | Plausibles Geschäftsmodell, aber nicht Teil der Forschungsfrage |
| Anonymes, aggregiertes Feedback | **übernommen** | Als Ebene 4 umgesetzt, aber freiwillig und quellengetrennt |
| Erkennung von Reaktionen „stiller" Nutzender | **umgedeutet** | Nicht als Creator-Werkzeug, sondern als Einordnungshilfe für Lesende |
| Barrierefreiheit als Nutzenversprechen | **übernommen** | Zentrale Anforderung, siehe `docs/accessibility-review.md` |

**Hinweis zur Quelle.** Die Folien 11–21 von `Gruppe_4.pptx` behandeln eine
andere Aufgabe (Change-Management-Fallstudie zu einem Chemieunternehmen, inkl.
Personas und Stakeholder-Matrix) und haben keinen Bezug zu diesem Produkt. Sie
wurden bewusst nicht ausgewertet. Produktrelevant ist im Wesentlichen Folie 10
(Business Model Canvas).

## 8. Erfolgskriterium des Prototyps

Der Prototyp ist erfolgreich, wenn er eine moderierte Testsitzung trägt, ohne
dass die Moderation Funktionen erklären oder Abstürze überspielen muss – und
wenn danach belastbare Aussagen zu den zehn Forschungsfragen vorliegen. Er ist
**nicht** daran zu messen, wie gut die Analysen sind: sie sind geschrieben,
nicht berechnet.
