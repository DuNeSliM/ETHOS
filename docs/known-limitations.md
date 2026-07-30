# Bekannte Einschränkungen

## 1. Grundsätzlich

- **Keine KI.** Es ist kein Modell beteiligt — weder lokal noch entfernt. Jede
  Einschätzung steht wortwörtlich in `src/data/analyses.ts`. Der Prototyp kann
  daher nichts über die Qualität einer echten Analyse aussagen.
- **Keine Emotionserkennung.** Auch bei aktivierter Kamera-Vorschau wird kein
  Bild ausgewertet. Die „Schätzungen" sind feste Werte aus einer Tabelle in
  `mockEngine.ts`.
- **Keine Plattformintegration.** Kein Bezug zu Instagram, TikTok, Reddit oder
  YouTube. Alle Beiträge, Konten, Communities, Likes und Kommentarzahlen sind
  erfunden.
- **Community-Daten sind erfunden** und beruhen auf keiner Erhebung. Sie sind so
  gewählt, dass sich Schätzung und Selbstauskunft sichtbar unterscheiden — genau
  das ist der zu testende Effekt, nicht ein gemessener.
- **Feste Analyse pro Beitrag.** Dieselbe Karte erscheint immer. Das ist für
  reproduzierbare Testsitzungen gewollt, macht die Demo aber vorhersagbar,
  sobald jemand sie zweimal sieht.
- **Nur Deutsch.** Keine i18n-Schicht; die Texte liegen fest in
  `src/lib/labels.ts` und in den Komponenten.

## 2. Technisch

| Einschränkung | Auswirkung |
|---|---|
| Kein Code-Splitting je Route | Nur Vendor-Chunks getrennt; das Diagramm-Bundle (≈ 375 kB, 104 kB gzip) wird bei Bedarf ohnehin geladen |
| Ein einziger React-Context | Zustandsänderungen rendern breiter als nötig; bei dieser Größe ohne spürbare Wirkung |
| Kein E2E-Test | Playwright war optionales Stretch Goal und ist nicht umgesetzt. Die Smoke-Tests laufen in jsdom, nicht in einem echten Browser |
| Kein automatisierter A11y-Scan | axe/Lighthouse nicht eingerichtet; das Review in `accessibility-review.md` ist ein manuelles Code-Audit |
| Kein Error Boundary | Ein unerwarteter Fehler führt zu einer leeren Seite statt zu einer Wiederherstellungsansicht |
| Fokusfilter im `Sheet` | Nutzt `offsetParent !== null`; in jsdom immer `null`, die Tests prüfen daher einen anderen Zweig als der Browser. Kein Nutzerproblem, aber die Testaussage ist schwächer als sie wirkt |
| Simulierter Video-Player | Ein `setInterval`-Zähler, kein `<video>`-Element. Kein Ton, kein Buffering, keine echten Frames |
| `localStorage` | Daten hängen an Browser **und** Gerät. Ein Wechsel des Browsers oder ein privates Fenster verliert alles. Im privaten Modus kann das Schreiben fehlschlagen — die App läuft dann nur im Speicher weiter |
| Medienfarben schemafest | Die Farbverläufe der Platzhalter kommen aus den Daten und reagieren nicht auf den Dunkelmodus |
| `Button variant="primary"` | Definiert, aber derzeit nirgends verwendet |

## 3. Inhaltlich

- **9 Beispielbeiträge** (5 visuell, 4 Diskussion). Genug, um alle sieben
  Kartenvarianten zu zeigen, aber kein realistischer Feed-Umfang. Nach wenigen
  Minuten ist das Ende erreicht.
- **Reaktionsverläufe für drei Videos** (`v-emotional`, `v-ragebait`, `v-humor`).
  Die übrigen Beiträge haben keinen Verlauf.
- **Analysen für zwei Kommentare** (`d-irony-c2`, `d-pol-c3`); alle anderen
  Kommentare haben bewusst keine.
- **Nur ein Beitrag ohne Einschätzung** (`v-lowcontext`). Ob Nutzende
  Zurückhaltung akzeptieren, lässt sich damit nur an einem einzigen Fall
  beobachten.
- **Keine Beiträge zu wirklich belastenden Themen.** Das ist bewusst so:
  Testpersonen sollen die Funktion bewerten, nicht mit schwierigen Inhalten
  konfrontiert werden.

## 4. Risiken für die Nutzertests

- **Übervertrauen trotz Kennzeichnung.** Auch mit „Simuliert"-Markierung könnten
  Testpersonen die Einschätzungen für Messergebnisse halten. Das Debriefing ist
  deshalb verpflichtend.
- **Der beabsichtigte Fehlfall muss offengelegt werden.** Bei `v-ragebait`
  liefert die Engine absichtlich „sichtbares Lächeln". Wer das nicht erfährt,
  könnte an der eigenen Wahrnehmung zweifeln.
- **Reihenfolgeeffekte.** Wer Szenario 1 zuerst macht, kennt die Assistenzkarte
  in Szenario 2 bereits. Für belastbare Aussagen müsste die Reihenfolge über die
  Teilnehmenden variiert werden — der Research Mode erzwingt keine Reihenfolge,
  protokolliert sie aber auch nicht.
- **Kleine Stichprobe.** Ein Studienprojekt erreicht typischerweise eine
  einstellige Zahl an Testpersonen. Die 1–5-Bewertungen sind qualitative
  Indizien, keine Statistik.
- **Selbstauskunft ist nicht neutral.** Wer zuerst eine Schätzung sieht, wird bei
  der eigenen Angabe davon beeinflusst (Ankereffekt). Der Prototyp kann das
  nicht ausschließen; im Idealfall wird bei einigen Testpersonen die Reaktion
  erst erfragt und die Schätzung danach gezeigt.
- **Freitexte können Personenbezug enthalten** und sind vor der Auswertung zu
  sichten.

## 5. Was einer echten Produktversion fehlen würde

- Rechtsgrundlage und Datenschutz-Folgenabschätzung für biometrische Daten
  (Details in `docs/privacy-review.md`)
- On-device-Modell, dessen Unsicherheit tatsächlich berechnet statt geschrieben
  wird — inklusive Kalibrierung, damit „Sicherheit mittel" etwas bedeutet
- Umgang mit Sprachen, Dialekten, Kulturen und individuellen Ausdrucksweisen
- Echte Aggregation mit Mindestgruppengröße und Schutz gegen Rückschlüsse auf
  Einzelpersonen
- Ein Meldeweg für systematische Fehleinschätzungen und ein Prozess, der auf
  diese Meldungen reagiert
- Barrierefreiheitserklärung und geprüfte Konformität
- Technische Integration in reale Plattformen, die ihre Inhalte nicht ohne
  Weiteres für Zusatzschichten öffnen — das ist die größte ungelöste Frage des
  gesamten Konzepts
