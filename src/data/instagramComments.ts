export type InstagramMockComment = {
  id: string;
  authorHandle: string;
  body: string;
  postedAgo: string;
  likes: number;
};

/** Invented comments for the native Instagram-mock comment screen. */
export const INSTAGRAM_COMMENTS: Record<string, InstagramMockComment[]> = {
  'v-humor': [
    {
      id: 'v-humor-comment-1',
      authorHandle: 'kochloeffel92',
      body: 'Der Blick zur Kamera nach der Schale hat mich komplett erwischt 😂',
      postedAgo: 'vor 1 Std.',
      likes: 184,
    },
    {
      id: 'v-humor-comment-2',
      authorHandle: 'eierexpertin',
      body: 'Tag 5 wird bestimmt der Durchbruch!',
      postedAgo: 'vor 48 Min.',
      likes: 67,
    },
    {
      id: 'v-humor-comment-3',
      authorHandle: 'tischkante',
      body: 'Endlich ein realistisches Kochvideo.',
      postedAgo: 'vor 22 Min.',
      likes: 31,
    },
  ],
  'v-sarcasm': [
    {
      id: 'v-sarcasm-comment-1',
      authorHandle: 'gleiswechsel',
      body: 'Der umgekippte Kaffee macht den Traumstart perfekt.',
      postedAgo: 'vor 4 Std.',
      likes: 91,
    },
    {
      id: 'v-sarcasm-comment-2',
      authorHandle: 'regenjacke',
      body: 'Fühle ich. Mein Anschluss war schon weg, bevor wir ankamen.',
      postedAgo: 'vor 3 Std.',
      likes: 42,
    },
    {
      id: 'v-sarcasm-comment-3',
      authorHandle: 'fruehzug',
      body: 'Besser geht es wirklich kaum 🙃',
      postedAgo: 'vor 2 Std.',
      likes: 18,
    },
  ],
  'v-emotional': [
    {
      id: 'v-emotional-comment-1',
      authorHandle: 'ruhigerraum',
      body: 'Danke, dass du das so offen teilst. Nimm dir die Zeit, die du brauchst.',
      postedAgo: 'vor 20 Std.',
      likes: 604,
    },
    {
      id: 'v-emotional-comment-2',
      authorHandle: 'mohnblume',
      body: 'Du musst hier nichts perfekt schneiden.',
      postedAgo: 'vor 18 Std.',
      likes: 289,
    },
    {
      id: 'v-emotional-comment-3',
      authorHandle: 'leiserkaffee',
      body: 'Ganz viel Kraft für die nächste Zeit.',
      postedAgo: 'vor 16 Std.',
      likes: 147,
    },
  ],
  'v-ragebait': [
    {
      id: 'v-ragebait-comment-1',
      authorHandle: 'landbus_letztefahrt',
      body: 'Nicht alle haben morgens eine brauchbare Alternative zum Auto.',
      postedAgo: 'vor 7 Std.',
      likes: 1830,
    },
    {
      id: 'v-ragebait-comment-2',
      authorHandle: 'radundregen',
      body: 'Das Thema ist wichtig, aber so pauschal bringt uns das nicht weiter.',
      postedAgo: 'vor 6 Std.',
      likes: 1241,
    },
    {
      id: 'v-ragebait-comment-3',
      authorHandle: 'stadtweg',
      body: 'Ich bin gespannt, ob du wirklich alles liest.',
      postedAgo: 'vor 5 Std.',
      likes: 552,
    },
  ],
  'v-lowcontext': [
    {
      id: 'v-lowcontext-comment-1',
      authorHandle: 'waspassiert',
      body: 'Was genau sehen wir hier?',
      postedAgo: 'vor 17 Min.',
      likes: 12,
    },
    {
      id: 'v-lowcontext-comment-2',
      authorHandle: 'parkplatzpoesie',
      body: 'Ich verstehe es nicht, aber die vier Sekunden waren intensiv.',
      postedAgo: 'vor 11 Min.',
      likes: 8,
    },
    {
      id: 'v-lowcontext-comment-3',
      authorHandle: 'no_context_needed',
      body: 'ok',
      postedAgo: 'vor 6 Min.',
      likes: 3,
    },
  ],
};

export function getInstagramComments(postId: string): InstagramMockComment[] {
  return INSTAGRAM_COMMENTS[postId] ?? [];
}
