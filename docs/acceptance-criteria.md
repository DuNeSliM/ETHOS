# Akzeptanzkriterien

Stand: 20.08.2026. Status bezieht sich auf Code und 133 grüne Tests; manuelle visuelle/assistive Prüfungen bleiben als solche markiert.

| ID | Kriterium | Status | Nachweis |
|---|---|---|---|
| A-01 | Telefon zeigt Instagram, Reddit und ETHOS als drei funktionierende Ziele | ERFÜLLT | `PhoneHomePage`, Smoke-Test |
| A-02 | Dekorative Icons sind nicht fokussierbar | ERFÜLLT | semantische Struktur, Smoke-Test |
| A-03 | Jede App besitzt Home nach `/phone` | ERFÜLLT | drei Shells |
| A-04 | Instagram/Reddit nennen sichtbar inoffiziellen Mock und erfundene Daten | ERFÜLLT | Feed-Seiten/Shells, Smoke-Test |
| A-05 | Keine offiziellen Logos, Authentifizierung oder APIs | ERFÜLLT | Lucide-Icons, Code-Sweep |
| A-06 | Instagram behält fünf visuelle Posts und bestehende Interaktionen | ERFÜLLT | Daten-/Smoke-Tests |
| A-07 | Reddit zeigt sechs Text-/Bild-/Video-Posts, `r/`-Communities, Kommentare, Upvotes, Save und Details | ERFÜLLT | `DiscussionFeedPage`, Media-/Smoke-Test |
| A-08 | ETHOS-Schicht liegt über beiden Social Apps | ERFÜLLT | beide Shells, Cross-App-Test |
| A-09 | Community-Knopf benennt Reaktion sichtbar | ERFÜLLT | Komponenten-/Smoke-Test |
| A-10 | Knopf nutzt Selbstauskunft und „am häufigsten“ bei Pluralität | ERFÜLLT | `communitySummary`, Tests |
| A-11 | Verteilung, Quelle, n, Klein-n- und Repräsentativitätswarnung bleiben sichtbar | ERFÜLLT | Sheet-/Detailtests |
| A-12 | `SocialPlatform` ersetzt mehrdeutigen Feed-Modus | ERFÜLLT | Typen, Datenintegrität |
| A-13 | Like/Upvote und Save überstehen Remount/Reload bei Speicherung | ERFÜLLT | Persistenz-Smoke-Test |
| A-14 | Bei Speicher-Opt-out bleiben Aktionen memory-only | ERFÜLLT | Smoke-Test und Provider |
| A-15 | Export/Löschen/Reset berücksichtigen Engagements | ERFÜLLT | Provider, PrivacyPage; manuelle Exportprüfung empfohlen |
| A-16 | Übersicht startet mit fiktivem Demo-Profil | ERFÜLLT | Overview-Smoke-Test |
| A-17 | Sitzung enthält nur echte Browserinteraktionen und Selbstauskünfte | ERFÜLLT | Analytics-Unit-Tests |
| A-18 | Demo und Sitzung werden nie zusammengeführt | ERFÜLLT | getrennte Snapshots/Quelle, Tests |
| A-19 | Donut, Emotionslandschaft und Plattformbalken vorhanden | ERFÜLLT | `PersonalAnalyticsCharts` |
| A-20 | Jede Grafik hat semantische Werte/Liste/Tabelle | ERFÜLLT | Komponentenmarkup, Tests |
| A-21 | Ausdrucksschätzung wird nicht als tatsächliche Emotion gezählt | ERFÜLLT | Analytics-Test |
| A-22 | Hell/Dunkel und Reduced Motion unterstützt | ERFÜLLT | Tokens, Animation aus; manuelle Sichtprüfung empfohlen |
| A-23 | Kanonische Routen und alte Redirects bleiben erreichbar | ERFÜLLT | `App.tsx` |
| A-24 | Kein Netzwerk, Backend oder echte Emotionserkennung | ERFÜLLT | Architektur/Sweep/Privacy-Review |
| A-25 | Typprüfung, komplette Testsuite und Build erfolgreich | ERFÜLLT | 20.08.2026: 133/133 |
| A-26 | Keine hohe/kritische offene Dependency-Schwachstelle | ERFÜLLT | `npm audit --audit-level=high` |
| A-27 | P-001 bis P-013 unter Prompt-Dokumentation nachvollziehbar | ERFÜLLT | `prompt-catalog.md`, Register |
| A-28 | 320 px, 200-%-Zoom und Screenreader in echten Browsern geprüft | TEILWEISE | mobile Struktur/Testalternativen vorhanden; manueller Gerätetest ausstehend |
| A-29 | Instagram-Kommentarlinks öffnen nur die native Kommentarsektion; ETHOS-Analyse nur aus dem ETHOS-Streifen | ERFÜLLT | getrennte Routen, Smoke-Test |
| A-30 | Reddit zeigt Doom-Video als zweiten und Kerle-Meme als dritten Post | ERFÜLLT | Datenintegritäts- und Smoke-Test |
| A-31 | Reddit-Video startet pausiert, zeigt den ersten Frame und erlaubt Wiedergabe mit Ton | ERFÜLLT | native Videoattribute + Browserprüfung |
| A-32 | Doom-Video füllt ohne seitlichen schwarzen Spalt die Kartenbreite und enthält keinen Demo-Erklärabsatz | ERFÜLLT | 4:3-Layout, Smoke-/Browserprüfung |
| A-33 | Desktop bietet einen umkehrbaren Handy-Vollbild-Modus ohne seitliche Demo-Erklärung | ERFÜLLT | `DeviceLayout`, Smoke-/Browserprüfung |

## Kernfälle in Given/When/Then

### AC-3APP

**GEGEBEN** der Telefon-Startbildschirm, **WENN** die Person nacheinander Instagram, Reddit und ETHOS öffnet, **DANN** sieht sie jeweils eigenes Chrome und erreicht über Home wieder `/phone`.

### AC-COMMUNITY

**GEGEBEN** eine simulierte Verteilung mit führendem Wert unter 50 Prozent, **WENN** der Post gerendert wird, **DANN** nennt der Button Emotion und Prozent mit „Am häufigsten“, und das Sheet erklärt Selbstauskunft, n und Grenzen.

### AC-PERSISTENCE

**GEGEBEN** aktive Speicherung, **WENN** ein Instagram-Post gelikt/gespeichert oder ein Reddit-Post upgevotet/gespeichert und die App neu gemountet wird, **DANN** bleibt der Zustand. **GEGEBEN** deaktivierte Speicherung, **DANN** bleibt er nur bis zum Sitzungsende im Speicher und der persistente Schlüssel wird entfernt.

### AC-SOURCES

**GEGEBEN** das Demo-Profil und eine leere Sitzung, **WENN** die Quelle gewechselt wird, **DANN** zeigt die Sitzung keinen Demo-Wert. **WENN** danach Likes/Upvotes und Selbstauskünfte entstehen, **DANN** aktualisieren sich ausschließlich die Sitzungswerte.

### AC-DELETE

**GEGEBEN** Verlauf, Reaktion und Engagement zu einem Post, **WENN** dessen Verlaufseintrag gelöscht wird, **DANN** verschwinden alle drei zugeordneten Datensätze. Gesamtlöschung/Reset entfernen alle Engagements; Reset setzt zusätzlich sichere Einwilligungsdefaults.

### AC-NATIVE-DETAILS

**GEGEBEN** ein Instagram-Post, **WENN** Kommentar-Symbol oder „Alle Kommentare ansehen“ gewählt wird, **DANN** erscheint die Instagram-Kommentarsektion ohne ETHOS-Analyseblöcke. **WENN** `ETHOS-Auswertung` im Assistenzstreifen gewählt wird, **DANN** erscheint die getrennte Analyseansicht. Für Reddit gilt dieselbe Trennung zwischen Thread und ETHOS-Auswertung.
