# Export-Checkliste für Chatverläufe

Die Chatverläufe können nicht automatisch abgelegt werden. Diese Checkliste
stellt sicher, dass der manuelle Export vor der Abgabe vollständig erfolgt.

## Vorbereitung

- [ ] Verzeichnis `docs/prompt-documentation/exports/` anlegen
- [ ] Dateinamensschema festlegen und einhalten:
      `P-<ID>-<agent>.<md|pdf|json>`

## Zu exportierende Verläufe

| Prompt-ID | Agent | Zieldatei | Status | Anmerkung |
|---|---|---|---|---|
| P-001 | Main (Hauptchat) | `exports/P-001-master.md` | [ ] | **Wichtigster Export.** Enthält Master-Prompt, gesamte Implementierung, alle iterativen Korrekturen sowie die nach den Agent-Abbrüchen im Hauptchat erstellten Dokumente |
| P-002 | Agent 1 | `exports/P-002-agent1.md` | [ ] | Nur Teilverlauf — Agent brach wegen Sitzungslimit ab |
| P-003 | Agent 3 | `exports/P-003-agent3.md` | [ ] | Nur Teilverlauf — Abbruch |
| P-004 | Agent 2 | `exports/P-004-agent2.md` | [ ] | Vollständiger Verlauf, erfolgreich abgeschlossen |
| P-006 | Agent 6 | `exports/P-006-agent6.md` | [ ] | Nur Teilverlauf — Abbruch |
| P-007 | Agent 7 | `exports/P-007-agent7.md` | [ ] | Nur Teilverlauf — Abbruch |
| P-008 | Main (zweite Sitzung) | `exports/P-008-produktrahmung.md` | [ ] | Eigener Verlauf vom 31.07.2026: Telefonrahmen, Plattform-Optik, Assistenz als Erweiterung |

P-005 hat keinen eigenen Verlauf: die Simulationsarbeit lief als Arbeitsphase im
Hauptchat und ist in `P-001-master.md` enthalten.

## Prüfung je Export

Für jede Exportdatei:

- [ ] Der **erste Nutzerbeitrag** ist im vollen Wortlaut enthalten
- [ ] Die Antworten des Modells sind vollständig, nicht gekürzt
- [ ] Werkzeugaufrufe und deren Ergebnisse sind enthalten, soweit die Oberfläche
      sie exportiert
- [ ] Datum und Modellbezeichnung sind erkennbar oder wurden im Kopf der Datei
      ergänzt
- [ ] Keine personenbezogenen Daten Dritter enthalten (Dateipfade mit
      Benutzernamen ggf. schwärzen)

## Abschluss

- [ ] Jede Zeile des Registers (`prompt-register.md`) verweist auf eine
      tatsächlich vorhandene Datei
- [ ] Die Spalte „Status" im Register stimmt mit dem tatsächlichen Ergebnis
      überein
- [ ] `AGENTS.md` ist auf dem Stand der letzten Änderungen
- [ ] Die vier abgebrochenen Subagent-Läufe sind als solche gekennzeichnet — der
      Abbruch ist Teil der ehrlichen Dokumentation, nicht zu verschweigen
- [ ] Falls weitere Prompts nach dieser Sitzung hinzukommen: neue ID vergeben,
      Register **und** diese Checkliste ergänzen

## Hinweis zur Ehrlichkeit der Dokumentation

Vier der fünf gestarteten Subagents brachen wegen eines Nutzungslimits ab. Ihre
Aufgaben wurden anschließend im Hauptchat erledigt. Das ist im Register und in
`AGENTS.md` so dokumentiert und sollte in der Studienarbeit auch so dargestellt
werden — ein abgebrochener Lauf ist ein reales Arbeitsergebnis und kein Makel,
den man durch Umschreiben glätten sollte.
