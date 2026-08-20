# Prompt-Dokumentation

Dieses Verzeichnis dokumentiert den KI-Einsatz bei der Entwicklung des
ETHOS-Prototypen (historisch ContextLens). Es erfüllt die Vorgabe aus dem Projekt-README:

> Each AI prompt must be documented under "Prompt Documentation" by exporting
> the corresponding chat.

## Inhalt

| Datei | Zweck |
|---|---|
| `README.md` | Dieses Dokument: Aufbau und Vorgehen |
| `prompt-catalog.md` | **Kanonischer Katalog** mit verfügbarem Wortlaut/Zusammenfassungen P-001 bis P-013 |
| `prompt-register.md` | Tabellarisches Register aller Prompts (P-001 bis P-013) |
| `export-checklist.md` | Checkliste für den manuellen Export der Chatverläufe |
| `exports/` | **Manuell anzulegen** — hier gehören die exportierten Chats hinein |

Der verfügbare **Wortlaut** und die ehrliche Kennzeichnung historischer Lücken
stehen kanonisch in `prompt-catalog.md`. `AGENTS.md` enthält zusätzlich die
historische Rollenverteilung und Korrekturen nach dem Agent-Review.

## Vorgehen

1. **Während der Arbeit:** Jeder eingesetzte Prompt erhält eine ID (`P-00x`) und
   wird im Register eingetragen — mit Zweck, erzeugten Dateien und der Angabe,
   ob das Ergebnis übernommen, teilweise übernommen oder verworfen wurde.
2. **Nach der Arbeit:** Die zugehörigen Chatverläufe werden manuell exportiert
   und unter `exports/` abgelegt. Siehe `export-checklist.md`.
3. **Vor der Abgabe:** Die Checkliste wird vollständig abgehakt, und das
   Register wird gegen die tatsächlich vorhandenen Exportdateien geprüft.

## Wichtiger Hinweis

Die Exportdateien können **nicht** automatisch erzeugt werden — der Export eines
Chatverlaufs ist eine manuelle Handlung in der jeweiligen Oberfläche. Das
Register verweist deshalb auf Dateinamen, die erst beim Export entstehen. Die
Checkliste existiert genau dafür: damit dieser Schritt nicht vergessen wird.

## Einordnung für die Studienarbeit

- Der ausgelieferte Prototyp enthält **keine KI zur Laufzeit**. Alle
  Analyseergebnisse sind fest geschriebene Beispieldaten in `src/data/`.
- KI wurde ausschließlich als **Entwicklungswerkzeug** eingesetzt: zur
  Implementierung, zur Dokumentation und zum Review.
- Alle Ergebnisse wurden im Hauptchat geprüft, integriert und in Teilen
  korrigiert. Die vorgenommenen Korrekturen sind in `AGENTS.md`, Abschnitt 3,
  nachvollziehbar aufgeführt.
