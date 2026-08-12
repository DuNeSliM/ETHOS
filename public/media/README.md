# Eigene Beispielclips und Bilddateien einsetzen

Der Prototyp zeichnet die Bilder seiner Beiträge selbst
(`src/features/feed/PostScene.tsx`). Das ist der Auslieferungszustand: keine
externen Dateien, kein Netzwerkzugriff, keine Rechtefragen.

Für eine Vorführung lassen sich die Bildinhalte zusätzlich durch **echte
Medien** austauschen. Die lokalen SVG-Assets in diesem Ordner sind einfache,
realistische Bilddateien statt Comic-Illustrationen. Der Feed kann bei Bedarf
solche Dateien über `src` im `media`-Objekt einbinden.

## In drei Schritten

1. Datei in diesen Ordner legen, z. B. `public/media/kueche.mp4`.
2. In `src/data/posts.ts` beim gewünschten Beitrag `src` im `media`-Objekt
   ergänzen — der Pfad ist ab `public/` zu schreiben, also mit führendem `/`:

   ```ts
   media: {
     kind: 'video',
     altText: 'Person schlägt in einer Küche ein Ei auf …',
     palette: ['#f6c26b', '#e08a5f'],
     durationSeconds: 18,
     scene: 'kitchen-egg',
     src: '/media/kueche.mp4',
     poster: '/media/kueche.jpg',   // optional, Standbild vor dem Abspielen
   },
   ```

3. `npm run dev` neu laden. Die Zeichnung entfällt, die Datei erscheint an
   ihrer Stelle.

Ohne `src` bleibt alles wie bisher — die Felder `scene` und `palette` müssen
also stehen bleiben, damit der Beitrag auch ohne Datei funktioniert.

## Was dabei gleich bleibt

- Die Markierung über dem Bild wechselt von „Simulierter Platzhalter" zu
  **„Beispielclip"**. Sie verschwindet nie: eine Testperson muss auch dann
  erkennen können, dass sie in einem simulierten Feed sitzt.
- `altText` beschreibt weiter, was zu sehen ist. Bitte an die neue Datei
  anpassen — der Text ist die Bildbeschreibung für Screenreader **und** die
  Grundlage der hinterlegten Analyse in `src/data/analyses.ts`.
- Die Analyse selbst ändert sich **nicht**. Sie ist pro Beitrag fest
  geschrieben und wird nicht aus der Datei berechnet. Passt der neue Clip
  inhaltlich nicht zur hinterlegten Einschätzung, muss der Text in
  `analyses.ts` mitgeändert werden, sonst widerspricht die Demo sich selbst.
- Videos laufen `muted` und `loop`; die Wiedergabeleiste unter dem Beitrag
  steuert weiterhin die simulierte Zeitachse für den Reaktionsverlauf.

## Rechte

In diesem Ordner liegen ausgelieferte Dateien — sie landen unverändert im
Build. Nur Material einsetzen, das dafür verwendet werden darf: eigene
Aufnahmen, ausdrücklich freigegebenes Material oder gemeinfreie Clips. Fremde
Memes aus sozialen Netzwerken sind in aller Regel urheberrechtlich geschützt,
auch wenn sie frei abrufbar sind.
