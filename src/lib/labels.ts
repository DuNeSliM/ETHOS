/**
 * Single source of truth for every user-facing label in the assistance layer.
 *
 * Wording rules (see docs/privacy-review.md):
 *  - Content analysis is always hedged: "wahrscheinlich", "moeglicherweise",
 *    "koennte".
 *  - Machine guesses about the viewer describe VISIBLE APPEARANCE
 *    ("sichtbares Laecheln"), never an inner state ("du bist froh").
 *  - Self-reported reactions are the only place we speak in the user's voice.
 *
 * Anything rendered to a participant should read its text from here so a
 * reviewer can audit the whole vocabulary in one file.
 */

import type {
  AssistantCardVariant,
  Confidence,
  ContentCategory,
  EstimatedExpression,
  PolarizationLevel,
  ProbableTone,
  ResearchRatingKey,
  SelfReportedReaction,
} from '@/types';

/** Content tone. Hedged by construction. */
export const TONE_LABEL: Record<ProbableTone, string> = {
  neutral: 'Wahrscheinlich sachlich',
  humorous: 'Wahrscheinlich humorvoll',
  sarcastic: 'Wahrscheinlich sarkastisch',
  ironic: 'Möglicherweise ironisch gemeint',
  frustrated: 'Wirkt frustriert oder belastet',
  aggressive: 'Wirkt konfrontativ formuliert',
  unclear: 'Analyse nicht eindeutig',
};

export const CONFIDENCE_LABEL: Record<Confidence, string> = {
  low: 'niedrig',
  medium: 'mittel',
  high: 'hoch',
};

/**
 * Spelled out so confidence is never communicated by a coloured bar alone.
 */
export const CONFIDENCE_SENTENCE: Record<Confidence, string> = {
  low: 'Diese Einschätzung ist unsicher. Bitte behandle sie als Vermutung.',
  medium:
    'Diese Einschätzung ist mittel sicher. Sie kann im Einzelfall falsch sein.',
  high: 'Diese Einschätzung ist relativ sicher, aber nicht garantiert richtig.',
};

/** Number of filled steps out of 3, for the non-colour-only meter. */
export const CONFIDENCE_STEPS: Record<Confidence, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

export const POLARIZATION_LABEL: Record<PolarizationLevel, string> = {
  low: 'niedrig',
  medium: 'mittel',
  high: 'hoch',
};

export const POLARIZATION_SENTENCE: Record<PolarizationLevel, string> = {
  low: 'Der Beitrag enthält kaum spaltende Formulierungen.',
  medium: 'Der Beitrag enthält einige zuspitzende Formulierungen.',
  high:
    'Der Beitrag enthält stark zuspitzende Formulierungen, die Gruppen gegeneinander stellen können.',
};

/** Assistant card headline per presentation variant. */
export const VARIANT_TITLE: Record<AssistantCardVariant, string> = {
  sarcasm: 'Wahrscheinlich sarkastisch',
  irony: 'Möglicherweise ironisch gemeint',
  emotional: 'Emotionaler Ton möglich',
  exaggeration: 'Möglicherweise humorvolle Übertreibung',
  ragebait: 'Könnte auf Reaktionen ausgerichtet sein',
  ambiguous: 'Analyse nicht eindeutig',
  'insufficient-context': 'Zu wenig Kontext für eine Einschätzung',
};

/** Short subtitle shown under the card headline. */
export const VARIANT_SUBTITLE: Record<AssistantCardVariant, string> = {
  sarcasm: 'Der Text ist vermutlich nicht wörtlich gemeint.',
  irony: 'Die Aussage könnte das Gegenteil des Gesagten meinen.',
  emotional: 'Die Formulierungen wirken emotional aufgeladen.',
  exaggeration: 'Die Übertreibung wirkt als Witz gemeint, nicht als Tatsache.',
  ragebait:
    'Die Formulierung könnte gezielt Widerspruch und Empörung auslösen sollen.',
  ambiguous: 'Es gibt mehrere plausible Lesarten dieses Beitrags.',
  'insufficient-context':
    'Für eine belastbare Einschätzung fehlen Text, Ton oder Kontext.',
};

/* ------------------------------------------------------------------ */
/* Viewer: machine estimate vs. self report                            */
/* ------------------------------------------------------------------ */

/**
 * Describes what a camera could SEE. Deliberately not an emotion word.
 */
export const EXPRESSION_LABEL: Record<EstimatedExpression, string> = {
  smile: 'Sichtbares Lächeln',
  surprise: 'Sichtbare Überraschung',
  tense: 'Angespannter Gesichtsausdruck',
  neutral: 'Neutraler Gesichtsausdruck',
  unclear: 'Nicht eindeutig',
};

/** Emotion words the user may pick for themselves. */
export const SELF_REPORT_LABEL: Record<SelfReportedReaction, string> = {
  amused: 'amüsiert',
  interested: 'interessiert',
  surprised: 'überrascht',
  confused: 'verwirrt',
  annoyed: 'genervt',
  angry: 'verärgert',
  uncomfortable: 'unangenehm berührt',
  neutral: 'neutral',
  other: 'andere Reaktion',
};

/** Stable order for the self-report picker and the community charts. */
export const SELF_REPORT_ORDER: SelfReportedReaction[] = [
  'amused',
  'interested',
  'surprised',
  'confused',
  'annoyed',
  'angry',
  'uncomfortable',
  'neutral',
  'other',
];

/**
 * Community chart keys. `unclear` is a bucket for participants whose
 * simulated estimate produced no usable result - it is not an emotion.
 */
export const COMMUNITY_KEY_LABEL: Record<string, string> = {
  ...SELF_REPORT_LABEL,
  unclear: 'nicht eindeutig',
};

/**
 * One face per reaction, for the community button on a post.
 *
 * These are a *shorthand for an aggregate*, never a statement about the person
 * looking at the screen. An emoji cannot be hedged, so it never travels alone:
 * wherever one is rendered, the reaction word, the percentage and the source
 * of the number are next to it, and the accessible name spells all three out.
 */
export const REACTION_EMOJI: Record<string, string> = {
  amused: '😂',
  interested: '👀',
  surprised: '😮',
  confused: '😕',
  annoyed: '🙄',
  angry: '😠',
  uncomfortable: '😟',
  neutral: '😐',
  other: '💬',
  unclear: '❔',
};

export const CONTENT_CATEGORY_LABEL: Record<ContentCategory, string> = {
  humor: 'Humor',
  sarcasm: 'Sarkasmus oder Ironie',
  emotional: 'Emotionale Beiträge',
  polarising: 'Polarisierende Beiträge',
  informational: 'Sachliche Beiträge',
};

/* ------------------------------------------------------------------ */
/* Research mode                                                       */
/* ------------------------------------------------------------------ */

export const RESEARCH_QUESTION: Record<ResearchRatingKey, string> = {
  understandable: 'War der Hinweis verständlich?',
  helpful: 'War der Hinweis hilfreich?',
  intrusive: 'War die Darstellung störend?',
  trust: 'Würdest du dieser Funktion vertrauen?',
};

/**
 * Endpoint wording per question, so "5" never means "good" in one row and
 * "bad" in the next without saying so.
 */
export const RESEARCH_SCALE_ENDS: Record<
  ResearchRatingKey,
  { low: string; high: string }
> = {
  understandable: { low: '1 = gar nicht verständlich', high: '5 = sehr verständlich' },
  helpful: { low: '1 = gar nicht hilfreich', high: '5 = sehr hilfreich' },
  intrusive: { low: '1 = gar nicht störend', high: '5 = sehr störend' },
  trust: { low: '1 = gar kein Vertrauen', high: '5 = großes Vertrauen' },
};

export const RESEARCH_RATING_ORDER: ResearchRatingKey[] = [
  'understandable',
  'helpful',
  'intrusive',
  'trust',
];
