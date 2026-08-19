import type { Post } from '@/types';

/**
 * Simulated demo content for ContextLens.
 *
 * Every post is invented. Handles, communities and numbers do not refer to
 * real accounts or platforms. Each visual post names a drawn scene
 * (`features/feed/PostScene.tsx`) that stands in for its footage; setting
 * `src` on the media swaps in a real file instead (`public/media/README.md`).
 *
 * The set is deliberately built to cover the interpretation cases we want to
 * test, one post per case (see `researchNote`).
 */
export const POSTS: Post[] = [
  /* ---------------------------------------------------------------- */
  /* Visual feed                                                       */
  /* ---------------------------------------------------------------- */
  {
    id: 'v-humor',
    mode: 'visual',
    kind: 'video',
    author: 'Mira Falk',
    authorHandle: '@mirakocht',
    body:
      'Tag 4 meines Versuchs, wie in Kochvideos einhändig ein Ei aufzuschlagen. Die Küche hat verloren. #küchenchaos #tag4 #einhändig',
    postedAgo: 'vor 2 Std.',
    likes: 12840,
    commentCount: 233,
    media: {
      kind: 'video',
      altText:
        'Person schlägt in einer Küche ein Ei auf, die Schale fällt mit in die Schüssel, die Person lacht und hebt entschuldigend die Hände.',
      palette: ['#f6c26b', '#e08a5f'],
      durationSeconds: 18,
      scene: 'kitchen-egg',
      poster: '/media/kitchen-recipe.jpg',
      overlayText: { top: 'Tag 4', bottom: 'die Küche hat verloren' },
    },
    researchNote:
      'Eindeutig humorvoll. Kontrollfall: Erkennen Testpersonen, dass hier kein Warnhinweis nötig ist?',
  },
  {
    id: 'v-sarcasm',
    mode: 'visual',
    kind: 'image',
    author: 'Jonas Reiter',
    authorHandle: '@jonasunterwegs',
    body:
      'Absolut perfekter Start in den Tag. Wirklich ein Traum. 50 Minuten Verspätung und der Ersatzzug fährt woanders ab. Besser geht es kaum. #pendlerleben',
    postedAgo: 'vor 5 Std.',
    likes: 3410,
    commentCount: 87,
    media: {
      kind: 'image',
      altText:
        'Bahnsteig im Regen, Anzeigetafel mit vier verspäteten Verbindungen, im Vordergrund ein umgekippter Kaffeebecher.',
      palette: ['#7f93a8', '#4a5b6e'],
      scene: 'rainy-platform',
      src: '/media/platform-rain.jpg',
      overlayText: { bottom: 'besser geht es kaum' },
    },
    researchNote:
      'Möglicherweise sarkastisch. Hauptfall für Szenario 1 im Research Mode.',
  },
  {
    id: 'v-emotional',
    mode: 'visual',
    kind: 'video',
    author: 'Elif Kaya',
    authorHandle: '@elifspricht',
    body:
      'Ich rede hier kurz offen über die letzten drei Wochen. Es ist gerade viel, und ich wollte das nicht wegschneiden.',
    postedAgo: 'vor 1 Tag',
    likes: 24190,
    commentCount: 1502,
    media: {
      kind: 'video',
      altText:
        'Person sitzt in einem Zimmer und spricht ruhig, aber sichtbar angespannt in die Kamera, atmet mehrfach tief durch.',
      palette: ['#8d7fb8', '#59527f'],
      durationSeconds: 27,
      scene: 'talking-head',
      poster: '/media/portrait-couple.jpg',
      // No burned-in caption here on purpose: the one post that is meant
      // sincerely should not look like it is set up for a punchline.
    },
    researchNote:
      'Emotionales bzw. frustriertes Video. Trägt den simulierten Reaktionsverlauf (6.9).',
  },
  {
    id: 'v-ragebait',
    mode: 'visual',
    kind: 'video',
    author: 'Klartext Daily',
    authorHandle: '@klartext.daily',
    body:
      'Niemand traut sich das zu sagen, also sage ich es: Wer morgens noch mit dem Auto zur Arbeit fährt, hat den Ernst der Lage einfach nicht verstanden. Schreib deine Meinung in die Kommentare, ich lese ALLES. #klartext #meinung',
    postedAgo: 'vor 8 Std.',
    likes: 58230,
    commentCount: 9418,
    media: {
      kind: 'video',
      altText:
        'Person spricht schnell und mit großen Gesten direkt in die Kamera, im Hintergrund eine stark befahrene Straße, eingeblendeter Text in Großbuchstaben.',
      palette: ['#d76a6a', '#8f3b4d'],
      durationSeconds: 22,
      scene: 'street-rant',
      poster: '/media/street-voice.jpg',
      // The all-caps overlay is part of what the analysis flags as
      // reaction-seeking, so it has to be visible in the picture.
      overlayText: { top: 'niemand traut sich das zu sagen', bottom: 'ich lese ALLES' },
    },
    researchNote:
      'Stark polarisierender, reaktionsorientierter Beitrag. Hauptfall für Szenario 2 (Community-Reaktionen).',
  },
  {
    id: 'v-lowcontext',
    mode: 'visual',
    kind: 'video',
    author: 'noa.clips',
    authorHandle: '@noa.clips',
    body: 'ok',
    postedAgo: 'vor 20 Min.',
    likes: 412,
    commentCount: 19,
    media: {
      kind: 'video',
      altText:
        'Sehr kurzer Clip ohne Sprache, die Kamera schwenkt über einen leeren Parkplatz, kein Text und keine Musik.',
      palette: ['#9aa6ae', '#6b7681'],
      durationSeconds: 4,
      scene: 'empty-lot',
      poster: '/media/empty-lot.jpg',
    },
    researchNote:
      'Unzureichender Kontext. Prüft, ob Testpersonen ein ehrliches "keine Einschätzung" akzeptieren.',
  },

  /* ---------------------------------------------------------------- */
  /* Discussion feed                                                   */
  /* ---------------------------------------------------------------- */
  {
    id: 'd-sarcasm',
    mode: 'discussion',
    kind: 'text-post',
    community: 'c/heimwerken',
    author: 'brettundschraube',
    authorHandle: 'u/brettundschraube',
    title: 'Anleitung sagt "in 20 Minuten aufgebaut"',
    body:
      'Kleines Update nach Stunde vier: Läuft super. Wirklich. Ich habe jetzt drei Schrauben übrig und ein Regal, das nur nach links kippt. Die 20 Minuten waren extrem realistisch, vielen Dank auch.',
    postedAgo: 'vor 3 Std.',
    likes: 1840,
    commentCount: 4,
    comments: [
      {
        id: 'd-sarcasm-c1',
        author: 'u/holzwurm_71',
        body: 'Drei Schrauben übrig ist eigentlich ein gutes Zeichen. Sicherheitsreserve.',
        upvotes: 420,
        hasAnalysis: false,
      },
      {
        id: 'd-sarcasm-c2',
        author: 'u/lenabaut',
        body:
          'Bei mir waren es sieben. Das Regal steht trotzdem. Irgendwie. Bitte nicht anlehnen.',
        upvotes: 331,
        hasAnalysis: false,
      },
      {
        id: 'd-sarcasm-c3',
        author: 'u/anleitungsleser',
        body:
          'Warst du sicher auf Seite 2? Da steht, dass man Teil F vorher umdrehen muss.',
        upvotes: 88,
        hasAnalysis: false,
      },
    ],
    researchNote:
      'Sarkastischer Beitrag im Textformat, hohe Konfidenz. Vergleichsfall zu v-sarcasm.',
  },
  {
    id: 'd-irony',
    mode: 'discussion',
    kind: 'text-post',
    community: 'c/nahverkehr',
    author: 'tramfahrerin',
    authorHandle: 'u/tramfahrerin',
    title: 'Der neue Fahrplan ist ein echter Gewinn für alle Beteiligten',
    body:
      'Die Linie 4 fährt jetzt alle 30 statt alle 10 Minuten. Dafür ist der Anschluss an die S-Bahn ganz neu gedacht: Man erreicht sie nicht mehr. Ein Konzept, das man erst mal verstehen muss.',
    postedAgo: 'vor 6 Std.',
    likes: 612,
    commentCount: 3,
    comments: [
      {
        id: 'd-irony-c1',
        author: 'u/pendler_ost',
        body:
          'Warte, meinst du das ernst? Ich habe die Mail vom Verkehrsverbund so gelesen, dass der Anschluss besser wird.',
        upvotes: 143,
        hasAnalysis: false,
      },
      {
        id: 'd-irony-c2',
        author: 'u/mo_neu',
        body: 'Ich lese das als Kritik. Aber sicher bin ich mir auch nicht.',
        upvotes: 96,
        hasAnalysis: true,
      },
      {
        id: 'd-irony-c3',
        author: 'u/tramfahrerin',
        body: 'Ich wollte es kritisch meinen. Sorry, war wohl zu trocken.',
        upvotes: 208,
        hasAnalysis: false,
      },
    ],
    researchNote:
      'Missverständliche Ironie mit niedriger Konfidenz. Zeigt bewusst eine unsichere Analyse.',
  },
  {
    id: 'd-aggressive-headline',
    mode: 'discussion',
    kind: 'text-post',
    community: 'c/stadtpolitik',
    author: 'nordstadt_notizen',
    authorHandle: 'u/nordstadt_notizen',
    title: 'Schluss mit dem Chaos: Diese Verwaltung ruiniert unser Viertel!',
    body:
      'Im Detail sieht es sachlicher aus, als die Überschrift klingt. Der Bauausschuss hat am Dienstag drei Anträge verschoben, weil zwei Gutachten fehlen. Laut Protokoll ist ein neuer Termin für den 14. angesetzt. Die Verzögerung betrifft vor allem den Radweg an der Ringstraße. Wer sich einlesen will: Das Protokoll ist öffentlich, Punkt 4 bis 6 sind relevant.',
    postedAgo: 'vor 11 Std.',
    likes: 927,
    commentCount: 3,
    comments: [
      {
        id: 'd-agg-c1',
        author: 'u/ringstrasse_anwohner',
        body:
          'Die Überschrift ist deutlich schärfer als der Text. Der Text selbst ist eigentlich brauchbar.',
        upvotes: 512,
        hasAnalysis: false,
      },
      {
        id: 'd-agg-c2',
        author: 'u/kv_beobachter',
        body: 'Punkt 5 im Protokoll ist wichtig, da steht die Begründung für die Verschiebung.',
        upvotes: 187,
        hasAnalysis: false,
      },
      {
        id: 'd-agg-c3',
        author: 'u/mika_r',
        body: 'Warum dann so eine Überschrift? Das erzeugt doch nur Wut.',
        upvotes: 240,
        hasAnalysis: false,
      },
    ],
    researchNote:
      'Aggressive Überschrift mit sachlicherem Inhalt. Prüft, ob Nutzer die Trennung Überschrift/Inhalt erkennen.',
  },
  {
    id: 'd-polarising',
    mode: 'discussion',
    kind: 'thread',
    community: 'c/arbeitswelt',
    author: 'homeoffice_debatte',
    authorHandle: 'u/homeoffice_debatte',
    title: 'Wer im Büro arbeiten will, hat entweder kein Zuhause oder keine Argumente',
    body:
      'Ich sage es, wie es ist: Die Rückkehr ins Büro ist eine Kontrollfantasie von Leuten, die sonst keine Aufgabe hätten. Wer das verteidigt, soll mir einen einzigen sachlichen Grund nennen. Ich warte.',
    postedAgo: 'vor 14 Std.',
    likes: 4102,
    commentCount: 4,
    comments: [
      {
        id: 'd-pol-c1',
        author: 'u/team_lead_sara',
        body:
          'Ein sachlicher Grund: Wir haben drei neue Kolleginnen, die sich in Präsenz deutlich schneller einarbeiten. Das ist messbar, nicht ideologisch.',
        upvotes: 1830,
        hasAnalysis: false,
      },
      {
        id: 'd-pol-c2',
        author: 'u/remote_seit_2019',
        body:
          'Und ein anderer: Ich habe zu Hause einen ruhigen Raum, im Büro ein Großraumbüro mit 40 Leuten. Für mich ist Präsenz objektiv schlechter.',
        upvotes: 1655,
        hasAnalysis: false,
      },
      {
        id: 'd-pol-c3',
        author: 'u/f_bergmann',
        body:
          'Beides stimmt doch gleichzeitig? Kommt auf Rolle und Wohnsituation an. Die Frage ist falsch gestellt.',
        upvotes: 2244,
        hasAnalysis: true,
      },
      {
        id: 'd-pol-c4',
        author: 'u/kein_nickname',
        body: '"Kontrollfantasie" ist schon eine Ansage. Damit gewinnt man keine Diskussion.',
        upvotes: 703,
        hasAnalysis: false,
      },
    ],
    researchNote:
      'Polarisierende Diskussion mit widersprüchlichen Kommentaren. Zweiter Fall für Szenario 2.',
  },
];

export const POSTS_BY_ID: Record<string, Post> = Object.fromEntries(
  POSTS.map((post) => [post.id, post]),
);

export function getPostsForMode(mode: Post['mode']): Post[] {
  return POSTS.filter((post) => post.mode === mode);
}

export function getPost(postId: string): Post | undefined {
  return POSTS_BY_ID[postId];
}
