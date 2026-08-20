import { describe, expect, it } from 'vitest';

import { DEMO_PROFILE } from '@/data/demoProfile';
import { buildSessionAnalytics, CONTENT_CATEGORIES } from '@/features/analytics/personalAnalytics';
import type { PostEngagement, ViewerReaction } from '@/types';

describe('personal analytics', () => {
  it('keeps the deterministic demo profile internally consistent', () => {
    expect(Object.values(DEMO_PROFILE.likesByCategory).reduce((sum, value) => sum + value, 0)).toBe(DEMO_PROFILE.likedPostCount);
    expect(Object.values(DEMO_PROFILE.likesByPlatform).reduce((sum, value) => sum + value, 0)).toBe(DEMO_PROFILE.likedPostCount);
    const reports = CONTENT_CATEGORIES.reduce(
      (total, category) => total + Object.values(DEMO_PROFILE.selfReportsByCategory[category]).reduce((sum, value) => sum + value, 0),
      0,
    );
    expect(reports).toBe(DEMO_PROFILE.selfReportCount);
  });

  it('derives session likes by platform and category without adding saved-only posts', () => {
    const engagements: Record<string, PostEngagement> = {
      'v-humor': { postId: 'v-humor', platform: 'instagram', liked: true, saved: true, updatedAt: 1 },
      'd-irony': { postId: 'd-irony', platform: 'reddit', liked: true, saved: false, updatedAt: 2 },
      'v-sarcasm': { postId: 'v-sarcasm', platform: 'instagram', liked: false, saved: true, updatedAt: 3 },
    };
    const snapshot = buildSessionAnalytics(engagements, {});
    expect(snapshot.source).toBe('current-session');
    expect(snapshot.likedPostCount).toBe(2);
    expect(snapshot.savedPostCount).toBe(2);
    expect(snapshot.likesByPlatform).toEqual({ instagram: 1, reddit: 1 });
    expect(snapshot.likesByCategory.humor).toBe(1);
    expect(snapshot.likesByCategory.sarcasm).toBe(1);
  });

  it('counts only active self-reports as emotions and ignores camera estimates', () => {
    const reactions: Record<string, ViewerReaction> = {
      'v-humor': { postId: 'v-humor', timestamp: 1, estimatedExpression: 'smile', confidence: 0.9, selfReportedReaction: 'amused' },
      'd-irony': { postId: 'd-irony', timestamp: 2, estimatedExpression: 'tense', confidence: 0.5 },
    };
    const snapshot = buildSessionAnalytics({}, reactions);
    expect(snapshot.selfReportCount).toBe(1);
    expect(snapshot.selfReportsByCategory.humor.amused).toBe(1);
    expect(snapshot.selfReportsByCategory.sarcasm.angry).toBe(0);
  });
});
