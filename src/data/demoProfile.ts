import type { PersonalAnalyticsSnapshot } from '@/types';

/**
 * A deterministic fictional profile used to make the dashboard useful before
 * a study participant has interacted. It is never merged with session data.
 */
export const DEMO_PROFILE: PersonalAnalyticsSnapshot = {
  source: 'demo-profile',
  likedPostCount: 128,
  savedPostCount: 34,
  selfReportCount: 128,
  likesByCategory: {
    humor: 38,
    sarcasm: 24,
    emotional: 22,
    polarising: 17,
    informational: 27,
  },
  likesByPlatform: { instagram: 76, reddit: 52 },
  selfReportsByCategory: {
    humor: {
      amused: 24,
      interested: 8,
      surprised: 3,
      confused: 1,
      annoyed: 1,
      angry: 0,
      uncomfortable: 0,
      neutral: 1,
      other: 0,
    },
    sarcasm: {
      amused: 8,
      interested: 5,
      surprised: 1,
      confused: 6,
      annoyed: 3,
      angry: 0,
      uncomfortable: 0,
      neutral: 1,
      other: 0,
    },
    emotional: {
      amused: 0,
      interested: 5,
      surprised: 2,
      confused: 4,
      annoyed: 2,
      angry: 1,
      uncomfortable: 6,
      neutral: 2,
      other: 0,
    },
    polarising: {
      amused: 0,
      interested: 2,
      surprised: 1,
      confused: 2,
      annoyed: 5,
      angry: 4,
      uncomfortable: 2,
      neutral: 1,
      other: 0,
    },
    informational: {
      amused: 0,
      interested: 16,
      surprised: 3,
      confused: 2,
      annoyed: 1,
      angry: 0,
      uncomfortable: 0,
      neutral: 5,
      other: 0,
    },
  },
};
