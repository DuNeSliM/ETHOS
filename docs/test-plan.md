# Testplan

## 1. Testziele

1. Der Prototyp trägt eine moderierte Testsitzung ohne Abstürze und ohne
   Erklärungsbedarf durch die Moderation.
2. Die inhaltlichen Kernzusagen sind technisch abgesichert: Einwilligungs-Gating,
   Trennung von Schätzung und Selbstauskunft, abgeschwächte Formulierungen,
   Datenintegrität der Beispieldaten.
3. Änderungen an den Beispieldaten können die Konsistenz nicht unbemerkt
   zerstören.

## 2. Automatisierte Tests

Stand: **99 Tests in 5 Dateien, alle grün.** Ausführung: `npm test`.

| Bereich | Datei | Was geprüft wird | Tests |
|---|---|---|---|
| Mock-Engine | `src/features/simulation/mockEngine.test.ts` | Variantenableitung inkl. Rangfolge, Abdeckung aller 7 Varianten, Zuordnung je Beitrag, Einwilligungs-Gating für Analyse / Schätzung / Verlauf / Community, Determinismus, beabsichtigter Fehlfall bei `v-ragebait`, `segmentAt`-Grenzen, Kategoriezuordnung | 23 |
| Datenintegrität | `src/data/data.test.ts` | ≥ 8 Beiträge, ≥ 4 je Modus, eindeutige IDs, Analyse für jeden Beitrag, Mediendbeschreibungen vorhanden, Videodauern gesetzt, `hasAnalysis` stimmt mit den Daten überein, jede Analyse nennt Grenzen und Alternativen, **jede Erklärung ist sprachlich abgeschwächt**, **keine verbotenen Absolutformulierungen**, nur `v-lowcontext` ohne Indikatoren, Community-Verteilungen ergeben je 100 %, nur bekannte Reaktionsschlüssel, Selbstauskünfte ≤ Gesamtteilnehmende, kein `unclear` bei Selbstauskünften, Warnhinweise vorhanden, Verläufe lückenlos und passend zur Laufzeit, Verlauf `v-emotional` entspricht der Auftragsvorgabe | 22 |
| Context Assistant | `src/features/context-assistant/ContextAssistant.test.tsx` | nichts sichtbar vor dem Öffnen, Dialog mit korrektem Namen, Unsicherheit und Grenzen sichtbar, „Interpretation, keine Tatsache", Indikatoren hinter „Warum …?" inkl. `aria-expanded`, alternative Lesarten, Feedback-Bestätigung, Ragebait als Möglichkeit, ehrliches „zu wenig Kontext", benannte Einstellung bei zurückgehaltenem Hinweis, kein Affordance ohne Daten, Fokusfalle/Escape/Fokusrückgabe, Öffnen nur per Tastatur | 13 |
| Eigene Reaktion | `src/features/reactions/OwnReactionControl.test.tsx` | nichts ohne Einwilligung, nichts im pausierten Zustand, Ausdrucksbeschreibung statt Emotionswort, zwei getrennte Zeilen, Korrektur ohne Verlust der Schätzung, Entfernen der eigenen Angabe, alle neun Optionen, Hinweis „keine echte Kamera" | 8 |
| Smoke / End-to-End | `src/app/smoke.test.tsx` | Einwilligungs-Standardwerte, Landing, Onboarding bis zum Einwilligungsschritt, beide Feeds, Feed-Umschalter, StatusBar, Detailseite mit Reihenfolge, Community-Quellenumschalter inkl. Zahlenwechsel, Repräsentativitätswarnung, Verlauf mit/ohne Einwilligung, Datenschutz-Dashboard, Löschbestätigung, Schalterkopplung in den Einstellungen, Pausieren, drei Szenarien, Szenario bis zur gespeicherten Bewertung, Leerzustand der Übersicht, Einzellöschung, unbekannte Route | 26 |
| Telefon und Erweiterung | `src/app/smoke.test.tsx` (zwei eigene Blöcke) | Einrichtung endet auf dem Startbildschirm statt im Feed; Plattform und ContextLens sind zwei getrennte App-Symbole; Kulissensymbole sind keine Bedienelemente; das Widget nennt den Zustand der Erweiterung; über der fremden App sind Plattform-Chrome **und** Assistenzknopf gleichzeitig sichtbar; Pausieren über das Overlay-Panel verändert die Statusleiste; ein Bedienelement ohne Funktion meldet sich per `role="status"`; „pausiert" und „Analyse aus" werden nicht vermischt | 7 |

## 3. Manuelle Testfälle

Status durchgängig **OFFEN** — vor jedem Meilenstein durchzugehen.

| ID | Vorbedingung | Schritte | Erwartet |
|---|---|---|---|
| M-01 | Neuer Browser | `/` öffnen, Onboarding komplett durchlaufen | 5 Schritte, Kameraschalter aus, Weitergabe gesperrt |
| M-02 | — | Visual Feed öffnen | 5 Beiträge, Medienplatzhalter mit Beschreibung, keine Analyse über dem Inhalt |
| M-03 | — | Discussion Feed öffnen | 4 Beiträge; bei `d-irony` und `d-polarising` je ein Kommentar mit eigenem Assistenzbutton |
| M-04 | — | `v-sarcasm` → „Kontext erklären" | Variante „Wahrscheinlich sarkastisch", Sicherheit mittel |
| M-05 | — | `d-irony` → Karte | Variante „Möglicherweise ironisch gemeint", Sicherheit **niedrig** |
| M-06 | — | `v-emotional` → Karte | Variante „Emotionaler Ton möglich", sichtbarer Ausdruck + Tonfall |
| M-07 | — | `v-humor` → Karte | Variante „Möglicherweise humorvolle Übertreibung" |
| M-08 | — | `v-ragebait` → Karte | Variante „Könnte auf Reaktionen ausgerichtet sein", Grad hoch, Hinweis „kein Nachweis einer Absicht" |
| M-09 | — | `d-aggressive-headline` → Karte | Variante „Analyse nicht eindeutig" |
| M-10 | — | `v-lowcontext` → Karte | Variante „Zu wenig Kontext", keine Indikatoren |
| M-11 | Karte offen | „Warum wird das so eingeschätzt?" | Indikatoren erscheinen, Button-Text wechselt |
| M-12 | Karte offen | „Andere Interpretation" | Alternative Lesarten + Bestätigungstext |
| M-13 | Erfassung aus | Beitrag ansehen | Kein Reaktions-Chip, StatusBar zeigt „Kamera aus" |
| M-14 | Erfassung an | `v-ragebait` ansehen | Chip „Geschätzt: sichtbares Lächeln" |
| M-15 | wie M-14 | Chip öffnen, „genervt" wählen | Chip zeigt „Deine Angabe: genervt"; beim erneuten Öffnen sind **beide** Werte sichtbar |
| M-16 | wie M-15 | „Meine Angabe entfernen" | Nur die eigene Angabe verschwindet |
| M-17 | Erfassung an | „andere Reaktion" wählen, Text eingeben | Freitext erscheint und wird übernommen |
| M-18 | — | `/post/v-ragebait` → Quellen umschalten | Diagramm **und** Teilnehmerzahl (3.178 ↔ 742) ändern sich |
| M-19 | — | `/post/v-lowcontext` | n = 23, gesonderter Warnhinweis zu kleiner Gruppe |
| M-20 | Erfassung an | `/post/v-emotional`, Video abspielen | Aktiver Verlaufsabschnitt wandert mit; Statuszeile nennt Zeit und Ausdruck |
| M-21 | Erfassung an | Scrubber auf 00:20 ziehen | Abschnitt „genervt" ist hervorgehoben |
| M-22 | Erfassung aus | `/post/v-emotional` | Erklärung, warum kein Verlauf vorliegt |
| M-23 | — | Einstellungen: Sarkasmushinweise aus, dann `v-sarcasm` → Karte | Genau diese Einstellung wird benannt und verlinkt |
| M-24 | — | „Alles pausieren" | StatusBar zeigt „Assistent pausiert"; keine Hinweise mehr |
| M-25 | — | Kameraerfassung an → Vorschau an → Vorschau starten | Browser fragt um Erlaubnis; Bild erscheint; Kameraleuchte an |
| M-26 | wie M-25 | Erfassung abschalten | Vorschau **und** Weitergabe schalten sich mit ab, Kameraleuchte erlischt |
| M-27 | wie M-25 | Kamerazugriff ablehnen | Verständliche Fehlermeldung, App bleibt bedienbar |
| M-28 | Einträge vorhanden | `/overview` | Zählungen, Kategorien, Vergleich Schätzung/Selbstauskunft, keine Bewertung der Person |
| M-29 | wie M-28 | Einzelnen Eintrag löschen | Eintrag und zugehörige Reaktion verschwinden |
| M-30 | wie M-28 | „Alle Daten löschen" bestätigen | Übersicht zeigt Leerzustand; Einstellungen bleiben |
| M-31 | — | `/privacy` → „Demo zurücksetzen" | Einstellungen auf Standard, Kamera wieder aus, Onboarding erscheint erneut |
| M-32 | — | JSON-Export | Datei wird geladen, enthält Hinweis auf simulierte Werte |
| M-33 | Ergebnisse vorhanden | CSV-Export, in Tabellenkalkulation öffnen | Spalten korrekt; Freitext mit Komma/Anführungszeichen bleibt intakt |
| M-34 | — | Szenario 1 vollständig durchlaufen | Aufgabe, Banner beim Verlassen, Bewertung, Speicherung |
| M-35 | — | Szenario 2 durchlaufen | Community-Umschalter wird gefunden |
| M-36 | — | Szenario 3 durchlaufen | Korrektur und Datenschutzoptionen werden gefunden |
| M-37 | Bewertung offen | Speichern ohne vollständige Antworten | Button deaktiviert, Erklärung sichtbar |
| M-38 | — | Unbekannte Route `/nope` | Wiederherstellungsseite |
| M-39 | — | Unbekannte Beitrags-ID `/post/xyz` | Inline-Hinweis **innerhalb** der Shell, keine zweite Navigation |
| M-40 | — | Hell-/Dunkelmodus umschalten | Alle Texte lesbar, Verlaufsbeschriftungen kippen mit |
| M-41 | — | Nur Tastatur, ganze App durchlaufen | Alles erreichbar, Fokus immer sichtbar |
| M-42 | — | Browser-Zoom 200 % | Kein horizontales Scrollen des Seitenkörpers |
| M-43 | — | Fensterbreite 320 px | Untere Navigation lesbar, keine Überlappungen |
| M-44 | — | Betriebssystem auf „Bewegung reduzieren" | Keine Animationen |
| M-45 | — | Seite neu laden | Einstellungen und Verlauf bleiben erhalten |
| M-46 | Desktop ≥ 1280 px | `/phone` öffnen | Gerät mittig, Beschriftung links daneben, Statusleiste mit Uhrzeit und Teal-Pille |
| M-47 | Desktop | Im Feed nach unten scrollen | Nur die Telefonfläche scrollt; Kopfzeile bleibt oben, Tab-Leiste unten **im Rahmen** – nichts klebt am Fensterrand |
| M-48 | Desktop | „Kontext erklären" öffnen | Das Sheet liegt innerhalb des Telefons, verdunkelt nur dessen Fläche und ist bis zum Schließen bedienbar |
| M-49 | Fensterbreite < 1024 px | Dieselben Wege gehen | Kein Rahmen, Ansicht bildschirmfüllend, identische Funktionen |
| M-50 | — | Startbildschirm: Kulissensymbole antippen und mit Tab ansteuern | Keine Reaktion, kein Fokusstopp – sie sind keine Bedienelemente |
| M-51 | — | In der simulierten App „Suche" antippen | Meldung „gibt es in diesem Prototyp nicht", App bleibt bedienbar |
| M-52 | — | Schwebenden Knopf öffnen, „Assistenzschicht aktiv" ausschalten | Leiste zeigt „Assistent pausiert", Knopf wird grau, Teal-Pille im Geräte-Chrome verschwindet |
| M-53 | wie M-52 | Über das Panel zur Übersicht wechseln und zurück | Wechsel zwischen den beiden Apps ist erkennbar (Farbwelt, Kopfzeile, Tab-Leiste) |
| M-54 | — | Startbildschirm → ContextLens-Symbol, danach Logo in der Kopfzeile antippen | Führt in die ContextLens-App und wieder zurück auf den Startbildschirm |

## 4. Durchführung der Nutzertests

**Ablauf einer Sitzung (ca. 40 Minuten)**

1. **Begrüßung und Einwilligung (5 min).** Zweck erklären, Freiwilligkeit
   betonen, Abbruch jederzeit möglich. Ausdrücklich sagen: Es wird die Software
   getestet, nicht die Person. Aufzeichnung nur mit Zustimmung.
2. **Vorwissen (3 min).** Nutzung sozialer Medien, Erfahrungen mit
   missverstandener Ironie.
3. **Freies Erkunden (5 min).** Ohne Aufgabe. Beobachten: Was wird zuerst
   angetippt? Wird „Kontext erklären" von selbst gefunden?
4. **Szenarien 1–3 (je ~7 min).** Über den Research Mode. Laut denken lassen.
   Die Moderation hilft erst, wenn die Person länger als zwei Minuten feststeckt
   — und notiert, dass geholfen wurde.
5. **Bewertung nach jedem Szenario.** Vier Fragen, jeweils 1–5:
   - War der Hinweis verständlich? (1 = gar nicht … 5 = sehr)
   - War der Hinweis hilfreich?
   - War die Darstellung störend? (**Achtung: hier ist 1 der gute Wert**)
   - Würdest du dieser Funktion vertrauen?
   Plus optionaler Freitext.
6. **Abschlussgespräch (7 min).** Vertrauen, Bedenken zur Kamera, ob die
   Trennung von Inhaltsanalyse und eigener Reaktion verstanden wurde.
7. **Debriefing — verpflichtend.** Offenlegen:
   - Alle Analysen waren vorab geschrieben, es war keine KI beteiligt.
   - Bei einem Beitrag war die Schätzung **absichtlich falsch**
     (`v-ragebait`, „sichtbares Lächeln"), um die Korrekturfunktion zu prüfen.
   - Alle Community-Zahlen sind erfunden.
   - Es wurde nichts übertragen; die lokalen Daten können gemeinsam gelöscht
     werden.

**Beobachtungsschwerpunkte**

- Wird „Kontext erklären" ohne Hinweis gefunden?
- Wird die Sicherheitsangabe wahrgenommen oder überlesen?
- Wird die Schätzung als Aussage über Gefühle gelesen?
- Wird der Quellenumschalter der Community-Ansicht bemerkt?
- Wird die Korrekturfunktion gefunden — und getraut sich die Person zu
  widersprechen?
- Werden Pausieren und Löschen ohne Hilfe gefunden?

**Ergebnissicherung**

- Nach jeder Sitzung im Research Mode **JSON und CSV exportieren** und mit
  Sitzungskennung ablegen (keine Klarnamen).
- Freitexte vor der Auswertung auf personenbezogene Angaben sichten
  (siehe `privacy-review.md`, D-06).
- Anschließend „Alle Daten löschen" ausführen, damit die nächste Testperson
  unbelastet startet.

## 5. Regressionsstrategie

Vor jedem Meilenstein verbindlich:

```bash
npm test        # muss 89/89 grün sein
npm run build   # muss fehlerfrei durchlaufen
```

Beides schlägt bereits fehl, wenn Beispieldaten inkonsistent werden oder eine
Formulierung zu bestimmt wird — die Wortlautregeln sind als Test kodiert.

Nicht automatisiert und daher manuell zu prüfen: tatsächliche Kameranutzung
(M-25 bis M-27), Screenreader-Verhalten, Zoom, echte Geräte, Farbwirkung im
Dunkelmodus und die Exportdateien in einer Tabellenkalkulation.
