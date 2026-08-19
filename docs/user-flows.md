# Nutzerflüsse

Alle Flüsse beziehen sich auf die tatsächlich implementierten Routen in
`src/app/App.tsx`.

## Navigationsübersicht

```
/  Landing
│
├─→ /how-it-works        (Erklärseite, Rücksprung möglich)
└─→ /onboarding          4 Infoschritte + 1 Einwilligungsschritt
     │
     └─→ App-Shell (Kopfzeile + StatusBar + Navigation)
          ├─ /feed/visual ⇄ /feed/discussion     Umschalter im Feed
          ├─ /post/:postId                        Detailansicht
          ├─ /overview                            Persönliche Übersicht
          ├─ /settings                            Einwilligung & Einstellungen
          ├─ /privacy                             Datenschutz-Dashboard
          └─ /research                            Research Mode
```

Die App-Shell zeigt dauerhaft: Inhaltsanalyse aktiv/aus, Kamerastatus,
Speicherstatus und – während eines Testszenarios – das Research-Mode-Banner.

---

## F-1: Erster Besuch

**Einstieg:** `/`

1. Landing Page erklärt Produkt, Zielgruppe und Grenzen. Sichtbar markiert:
   „Forschungsprototyp – alle Analysen sind simuliert", „Keine echte KI",
   „Keine Verbindung zu sozialen Netzwerken".
2. „Demo starten" → `/onboarding` (bei einer Wiederkehr direkt `/feed/visual`).
3. Onboarding-Schritte 1–4: Funktionsweise, Sarkasmuserklärung,
   Community-Reaktionen, Datenschutz.
4. Schritt 5 ist die **Einwilligung**: alle Funktionen einzeln schaltbar. Die
   Kameraerfassung ist aus, die anonyme Weitergabe ist gesperrt, solange keine
   Erfassung aktiv ist.
5. „Einstellungen übernehmen und starten" → `/feed/visual`.

**Erfolgskriterium:** Die Person kann nach dem Onboarding benennen, dass
Hinweise erst auf Antippen erscheinen und dass die Kamera aus ist.

**Abbruchrisiken:** Onboarding wird übersprungen (Link „Überspringen" ist
absichtlich vorhanden – dann setzt die Person die Standardwerte ein, Kamera
bleibt aus); Einwilligungsschritt wird als reine Infoseite gelesen.

---

## F-2: Kontext eines Beitrags verstehen

**Einstieg:** `/feed/visual` oder `/feed/discussion`

1. Beitrag lesen. Über dem Inhalt liegt **nichts** von der Analyse.
2. Im Assistenzstreifen unter dem Beitrag „Kontext erklären" antippen.
3. Es öffnet sich ein Sheet (mobil von unten, ab `sm` mittig) mit:
   Überschrift der Variante, Chip „Interpretation, keine Tatsache",
   Sicherheitsstufe, kurzer Begründung, möglicher Absicht.
4. Optional „Warum wird das so eingeschätzt?" → Indikatorliste.
5. Optional „Andere Interpretation" → alternative Lesarten.
6. Immer sichtbar: Block „Was diese Analyse nicht wissen kann".
7. Schließen über Button, Escape oder Klick auf den Hintergrund. Der Fokus
   kehrt zum auslösenden Button zurück.

**Erfolgskriterium:** Die Person beschreibt die Aussage als Vermutung, nicht als
Feststellung, und findet die Unsicherheitsangabe unaufgefordert.

**Abbruchrisiken:** „Kontext erklären" wird als Plattformfunktion (z. B.
Übersetzung) missverstanden; die Grenzen werden weggescrollt.

---

## F-3: Eigene Reaktion korrigieren

**Voraussetzung:** simulierte Reaktionserfassung aktiv (`/settings`).

1. Am Beitrag erscheint ein zurückhaltender Chip, z. B. „Geschätzt: sichtbares
   Lächeln" – auf dem Medienplatzhalter oder im Assistenzstreifen.
2. Chip antippen → Sheet „Deine Reaktion".
3. Oben stehen zwei getrennt beschriftete Zeilen:
   **Automatisch geschätzter Ausdruck** und **Von dir angegebene Reaktion**.
4. Eine der neun Reaktionen wählen (`amüsiert` … `andere Reaktion`). Bei
   „andere Reaktion" erscheint ein Freitextfeld.
5. Das Sheet schließt sich, der Chip zeigt nun „Deine Angabe: …".
6. Erneutes Öffnen zeigt weiterhin **beide** Werte plus den Hinweis, dass die
   eigene Angabe Vorrang hat.
7. „Meine Angabe entfernen" setzt nur die Selbstauskunft zurück.

**Erfolgskriterium:** Die Person erkennt nach der Korrektur noch, welcher Wert
geschätzt und welcher selbst angegeben war.

**Abbruchrisiken:** Der Chip wird übersehen (er ist absichtlich dezent); die
Korrektur wird als „Fehler melden" statt als eigene Aussage verstanden.

---

## F-4: Community-Reaktionen einordnen

**Einstieg:** `/post/:postId` (aus dem Feed über „Reaktionen ansehen")

1. Detailansicht zeigt in fester Reihenfolge: Inhalt → Inhaltsanalyse →
   Reaktionsverlauf (falls Video und Erfassung aktiv) → Community-Reaktionen.
2. Im Community-Block ist zunächst „Automatische Schätzungen" gewählt.
3. Umschalten auf „Aktive Selbstauskünfte" ändert Diagramm **und**
   Teilnehmerzahl (z. B. 3.178 → 742) und die Erläuterung darüber.
4. Darunter: Erklärung der Datenherkunft und die Repräsentativitätswarnung.

**Erfolgskriterium:** Die Person benennt, dass die beiden Zahlenreihen aus
unterschiedlichen Quellen stammen und nicht zusammengezählt werden dürfen.

**Abbruchrisiken:** Der Umschalter wird als Filter statt als Quellenwechsel
gelesen; die Prozentwerte werden als repräsentativ verstanden.

---

## F-5: Datenschutzoptionen finden und Daten löschen

**Einstieg:** beliebig – die StatusBar ist auf jedem Screen sichtbar.

1. Über StatusBar → „Status ändern" oder Navigation → „Datenschutz".
2. `/privacy` zeigt: Aussage zur lokalen Verarbeitung, Zustandsliste aller
   Funktionen (aktiv/inaktiv mit Icon **und** Wort), Liste dessen, was simuliert
   ist, aktuelle Datenmenge.
3. Aktionen: JSON-Export, „Alle Daten löschen", „Demo zurücksetzen".
4. Beide Löschaktionen verlangen eine Bestätigung und erklären den Unterschied
   (Daten löschen behält Einstellungen; Demo-Reset setzt auch die Einwilligung
   zurück, wodurch die Kamera wieder aus ist).

**Alternativer Weg:** `/overview` → „Alle Daten löschen", oder pro Eintrag
„Löschen" (entfernt auch die zugehörige Reaktion).

**Erfolgskriterium:** Die Person findet ohne Hilfe eine Löschfunktion und kann
sagen, wo die Daten liegen.

---

## F-6: Research-Mode-Szenario durchlaufen

**Einstieg:** `/research`

1. Übersicht mit drei Szenarien und Status (offen/abgeschlossen).
2. „Starten" → Aufgabenansicht mit Ziel und nummerierten Schritten.
3. Über den Start-Button verlässt die Person die Seite und arbeitet in der App.
   Ein Banner am oberen Rand zeigt durchgehend „Research Mode: Aufgabe läuft"
   und führt zurück.
4. „Aufgabe erledigt – jetzt bewerten" → Bewertungsformular mit vier Fragen
   (1–5, Skalenenden ausgeschrieben) und optionalem Freitext.
5. Speichern ist erst möglich, wenn alle vier Fragen beantwortet sind.
6. Ergebnis landet in der Tabelle auf der Übersicht; Export als JSON oder CSV.

**Erfolgskriterium:** Alle drei Szenarien sind ohne Moderationshilfe
durchführbar; die Ergebnisse liegen exportierbar vor.

**Abbruchrisiken:** Die Person findet den Rückweg über das Banner nicht;
Szenario 3 setzt voraus, dass die Erfassung eingeschaltet wird – der erste
Aufgabenschritt sagt das ausdrücklich.
