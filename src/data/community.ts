import type { CommunityReactionSummary } from '@/types';

const REPRESENTATIVE_WARNING =
  'Diese Gruppe muss nicht repräsentativ sein. Es haben nur Personen mitgemacht, die diese Funktion freiwillig aktiviert haben.';

const SOURCE_ESTIMATED_AND_SELF =
  'Die Prozentwerte kommen aus zwei getrennten Quellen: automatische Kamera-Schätzungen und aktive Angaben der Personen selbst. Beide werden nie zusammengerechnet. Für diesen Prototyp sind alle Werte erfunden.';

/**
 * Simulated aggregate community reactions.
 *
 * Two separate distributions per post, on purpose: the whole point of this
 * screen is that a camera estimate and what people actually say about
 * themselves can differ. `estimatedReactions` and `selfReportedReactions`
 * are never summed or averaged together anywhere in the app.
 *
 * Percentages are authored to total 100 (asserted in the unit tests).
 */
export const COMMUNITY: Record<string, CommunityReactionSummary> = {
  'v-humor': {
    postId: 'v-humor',
    participantCount: 1284,
    selfReportedParticipantCount: 306,
    estimatedReactions: {
      amused: 61,
      neutral: 18,
      surprised: 9,
      interested: 7,
      unclear: 5,
    },
    selfReportedReactions: {
      amused: 68,
      interested: 14,
      neutral: 10,
      surprised: 5,
      other: 3,
    },
    representativeWarning: REPRESENTATIVE_WARNING,
    sourceExplanation: SOURCE_ESTIMATED_AND_SELF,
  },

  'v-sarcasm': {
    postId: 'v-sarcasm',
    participantCount: 642,
    selfReportedParticipantCount: 188,
    estimatedReactions: {
      neutral: 31,
      amused: 24,
      confused: 18,
      annoyed: 14,
      surprised: 8,
      unclear: 5,
    },
    selfReportedReactions: {
      amused: 33,
      annoyed: 25,
      confused: 21,
      neutral: 12,
      interested: 9,
    },
    representativeWarning: REPRESENTATIVE_WARNING,
    sourceExplanation: SOURCE_ESTIMATED_AND_SELF,
  },

  'v-emotional': {
    postId: 'v-emotional',
    participantCount: 2140,
    selfReportedParticipantCount: 517,
    estimatedReactions: {
      neutral: 27,
      uncomfortable: 21,
      interested: 18,
      surprised: 14,
      confused: 12,
      unclear: 8,
    },
    selfReportedReactions: {
      interested: 29,
      uncomfortable: 22,
      neutral: 16,
      confused: 11,
      annoyed: 10,
      surprised: 8,
      amused: 4,
    },
    representativeWarning: REPRESENTATIVE_WARNING,
    sourceExplanation: SOURCE_ESTIMATED_AND_SELF,
  },

  /**
   * The figures from the brief (section 6.8). Kept exactly as specified so the
   * example in the documentation matches the running prototype.
   */
  'v-ragebait': {
    postId: 'v-ragebait',
    participantCount: 3178,
    selfReportedParticipantCount: 742,
    estimatedReactions: {
      amused: 28,
      annoyed: 24,
      surprised: 18,
      neutral: 16,
      confused: 9,
      unclear: 5,
    },
    selfReportedReactions: {
      annoyed: 34,
      angry: 17,
      amused: 14,
      uncomfortable: 11,
      confused: 9,
      interested: 8,
      neutral: 7,
    },
    representativeWarning: REPRESENTATIVE_WARNING,
    sourceExplanation: SOURCE_ESTIMATED_AND_SELF,
  },

  'v-lowcontext': {
    postId: 'v-lowcontext',
    participantCount: 23,
    selfReportedParticipantCount: 9,
    estimatedReactions: {
      neutral: 44,
      unclear: 33,
      confused: 15,
      amused: 8,
    },
    selfReportedReactions: {
      confused: 41,
      neutral: 34,
      amused: 13,
      other: 12,
    },
    representativeWarning:
      'Hier haben sehr wenige Personen mitgemacht. Bei so kleinen Gruppen sind Prozentwerte kaum aussagekräftig.',
    sourceExplanation: SOURCE_ESTIMATED_AND_SELF,
  },

  'd-sarcasm': {
    postId: 'd-sarcasm',
    participantCount: 431,
    selfReportedParticipantCount: 122,
    estimatedReactions: {
      amused: 46,
      neutral: 22,
      confused: 14,
      interested: 10,
      unclear: 8,
    },
    selfReportedReactions: {
      amused: 57,
      confused: 16,
      interested: 12,
      neutral: 10,
      annoyed: 5,
    },
    representativeWarning: REPRESENTATIVE_WARNING,
    sourceExplanation: SOURCE_ESTIMATED_AND_SELF,
  },

  'd-irony': {
    postId: 'd-irony',
    participantCount: 287,
    selfReportedParticipantCount: 94,
    estimatedReactions: {
      neutral: 34,
      confused: 26,
      amused: 17,
      interested: 13,
      unclear: 10,
    },
    selfReportedReactions: {
      confused: 38,
      amused: 22,
      interested: 15,
      neutral: 13,
      annoyed: 12,
    },
    representativeWarning: REPRESENTATIVE_WARNING,
    sourceExplanation: SOURCE_ESTIMATED_AND_SELF,
  },

  'd-aggressive-headline': {
    postId: 'd-aggressive-headline',
    participantCount: 806,
    selfReportedParticipantCount: 233,
    estimatedReactions: {
      annoyed: 29,
      neutral: 24,
      interested: 17,
      surprised: 12,
      confused: 11,
      unclear: 7,
    },
    selfReportedReactions: {
      annoyed: 31,
      interested: 24,
      confused: 15,
      neutral: 14,
      angry: 9,
      uncomfortable: 7,
    },
    representativeWarning: REPRESENTATIVE_WARNING,
    sourceExplanation: SOURCE_ESTIMATED_AND_SELF,
  },

  'd-polarising': {
    postId: 'd-polarising',
    participantCount: 1902,
    selfReportedParticipantCount: 488,
    estimatedReactions: {
      annoyed: 33,
      neutral: 19,
      surprised: 15,
      amused: 13,
      confused: 12,
      unclear: 8,
    },
    selfReportedReactions: {
      annoyed: 28,
      angry: 19,
      interested: 16,
      confused: 13,
      uncomfortable: 12,
      amused: 7,
      neutral: 5,
    },
    representativeWarning: REPRESENTATIVE_WARNING,
    sourceExplanation: SOURCE_ESTIMATED_AND_SELF,
  },
};

export function getCommunity(
  postId: string,
): CommunityReactionSummary | undefined {
  return COMMUNITY[postId];
}
