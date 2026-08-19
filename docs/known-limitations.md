# Bekannte Einschränkungen

## 1. Grundsätzlich

- **Keine KI.** Es ist kein Modell beteiligt — weder lokal noch entfernt. Jede
  Einschätzung steht wortwörtlich in `src/data/analyses.ts`. Der Prototyp kann
  daher nichts über die Qualität einer echten Analyse aussagen.
- **Keine Emotionserkennung.** Auch bei laufendem Selbstbild wird kein Bild
  ausgewertet. Die „Schätzungen" sind feste Werte aus einer Tabelle in
  `mockEngine.ts` und ändern sich nicht, egal was vor der Kamera passiert. Der
  gestrichelte Rahmen im Selbstbild ist eine Attrappe: statisch, ohne
  Gesichtssuche.
- **Das Kamerabild ist der einzige echte Sensor.** Wo eine Testperson vor einem
  Gerät ohne Webcam sitzt oder den Zugriff ablehnt, zeigt die Kachel „Kamera
  nicht verfügbar"; alles andere funktioniert unverändert. Umgekehrt kann eine
  laufende Kamera den Eindruck erwecken, die Schätzungen kämen von ihr — das ist
  der Effekt, den die Kachel und ihr Panel ausdrücklich benennen müssen.
- **Keine Plattformintegration.** Kein Bezug zu Instagram, TikTok, Reddit oder
  YouTube. Alle Beiträge, Konten, Communities, Likes und Kommentarzahlen sind
  erfunden.
- **Keine echten Fotos oder Videos.** Die Bilder der Beiträge sind gezeichnete
  SVG-Szenen (`features/feed/PostScene.tsx`). Sie sehen nach Inhalt aus, sind
  aber unverwechselbar keine Aufnahmen. Wer echtes Material zeigen will, legt es
  nach `public/media/` und setzt `media.src` — der Rechtehinweis dort ist zu
  beachten, fremde Memes sind in aller Regel geschützt.
- **Die simulierte App „Momento" ist eine Attrappe.** Übernommen sind die
  Konventionen der Gattung (Stories, randlose Medien, Tab-Leiste) **und seit
  E-019 auch die Farbwelt der Vorlage** — Verlaufsrampe, Akzentblau, Like-Rot.
  Nicht übernommen sind Name und Logo. Das ist eine Entscheidung für den
  Hochschulkontext; außerhalb davon wäre sie neu zu prüfen. Von ihren Bedienelementen funktionieren nur der Ansichtswechsel,
  „Gefällt mir", „Speichern" und die Wege in einen Beitrag; Suche, Erstellen,
  Reels, Profil, Aktivität und Direktnachrichten melden beim Antippen, dass es
  sie im Prototyp nicht gibt.
- **Das Telefon ist ein Bild, kein Gerät.** Der Rahmen simuliert weder ein
  Betriebssystem noch eine echte Installation. Es gibt keinen App-Store, keine
  Berechtigungsdialoge des Systems und keinen Wechsel zwischen Apps außer über
  den Startbildschirm.
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
| Breakpoints im Geräterahmen | Tailwind-Breakpoints beziehen sich auf das **Browserfenster**, nicht auf die Telefonbreite. Innerhalb des Rahmens gilt auf einem großen Monitor also `sm:`/`md:`. Deshalb wurde jedes mehrspaltige Layout entfernt statt nur ausgeblendet; wer neue Seiten ergänzt, darf `sm:grid-cols-*` nicht wieder einführen (Container Queries wären die saubere Lösung, sind aber nicht umgesetzt) |
| Geräterahmen erst ab 1024 px | Zwischen etwa 640 px und 1024 px läuft die App ohne Rahmen über die volle Fensterbreite. Das ist nutzbar, sieht aber weder nach Telefon noch nach Desktop-Anwendung aus |
| Uhrzeit im Geräte-Chrome | Zeigt die echte Systemzeit und aktualisiert sich alle 30 Sekunden; sie ist Kulisse und für Aufzeichnungen von Testsitzungen nicht fixierbar |

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
