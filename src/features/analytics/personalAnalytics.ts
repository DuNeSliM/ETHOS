import { getAnalysis } from '@/data/analyses';
import { getPost } from '@/data/posts';
import { deriveContentCategory } from '@/features/simulation/mockEngine';
import { SELF_REPORT_ORDER } from '@/lib/labels';
import type {
  ContentCategory,
  PersonalAnalyticsSnapshot,
  PostEngagement,
  SelfReportedReaction,
  SocialPlatform,
  ViewerReaction,
} from '@/types';

export const CONTENT_CATEGORIES: ContentCategory[] = [
  'humor',
  'sarcasm',
  'emotional',
  'polarising',
  'informational',
];

function categoryCounts(): Record<ContentCategory, number> {
  return Object.fromEntries(CONTENT_CATEGORIES.map((category) => [category, 0])) as Record<ContentCategory, number>;
}

function reactionCounts(): Record<ContentCategory, Record<SelfReportedReaction, number>> {
  return Object.fromEntries(
    CONTENT_CATEGORIES.map((category) => [
      category,
      Object.fromEntries(SELF_REPORT_ORDER.map((reaction) => [reaction, 0])),
    ]),
  ) as Record<ContentCategory, Record<SelfReportedReaction, number>>;
}

export function buildSessionAnalytics(
  engagements: Record<string, PostEngagement>,
  reactions: Record<string, ViewerReaction>,
): PersonalAnalyticsSnapshot {
  const likesByCategory = categoryCounts();
  const likesByPlatform: Record<SocialPlatform, number> = { instagram: 0, reddit: 0 };
  const selfReportsByCategory = reactionCounts();

  let likedPostCount = 0;
  let savedPostCount = 0;
  Object.values(engagements).forEach((engagement) => {
    const post = getPost(engagement.postId);
    if (!post) return;
    if (engagement.liked) {
      likedPostCount += 1;
      likesByPlatform[post.platform] += 1;
      likesByCategory[deriveContentCategory(getAnalysis(post.id))] += 1;
    }
    if (engagement.saved) savedPostCount += 1;
  });

  let selfReportCount = 0;
  Object.values(reactions).forEach((reaction) => {
    if (!reaction.selfReportedReaction || !getPost(reaction.postId)) return;
    selfReportCount += 1;
    const category = deriveContentCategory(getAnalysis(reaction.postId));
    selfReportsByCategory[category][reaction.selfReportedReaction] += 1;
  });

  return {
    source: 'current-session',
    likedPostCount,
    savedPostCount,
    selfReportCount,
    likesByCategory,
    likesByPlatform,
    selfReportsByCategory,
  };
}
