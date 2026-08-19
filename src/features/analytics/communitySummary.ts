import { COMMUNITY_KEY_LABEL, REACTION_EMOJI, SELF_REPORT_ORDER } from '@/lib/labels';
import type { CommunityReactionSummary, CommunitySource } from '@/types';

/**
 * Derivations for the community numbers.
 *
 * Pure functions over the scripted data in `src/data/community.ts`. Nothing
 * here mixes the two sources: a value is either from the camera estimates or
 * from the self reports, and it carries which one it is.
 */

export type RankedReaction = {
  key: string;
  label: string;
  emoji: string;
  /** Share in percent. */
  value: number;
};

export function rankReactions(
  summary: CommunityReactionSummary,
  source: CommunitySource,
): RankedReaction[] {
  const distribution =
    source === 'estimated'
      ? summary.estimatedReactions
      : summary.selfReportedReactions;

  return Object.entries(distribution)
    .map(([key, value]) => ({
      key,
      label: COMMUNITY_KEY_LABEL[key] ?? key,
      emoji: REACTION_EMOJI[key] ?? '❔',
      value,
    }))
    .sort((a, b) => {
      if (b.value !== a.value) return b.value - a.value;
      // Ties would otherwise depend on object key order, and a demo that shows
      // a different face on every reload is not one you can moderate. Fall
      // back to the fixed vocabulary order instead.
      return orderIndex(a.key) - orderIndex(b.key);
    });
}

function orderIndex(key: string): number {
  const index = SELF_REPORT_ORDER.indexOf(key as never);
  return index === -1 ? SELF_REPORT_ORDER.length : index;
}

/**
 * The single reaction shown on the button over a post.
 *
 * Read from the **self reports**, not from the camera estimates, for the same
 * reason a participant's own correction outranks their own estimate: a number
 * people confirmed about themselves is a better thing to put on a face than a
 * number a machine guessed about them. The estimates are one tap away, in the
 * panel, with their own participant count.
 *
 * Returns `undefined` when a post has no scripted self reports at all, so the
 * caller can render nothing rather than an empty badge.
 */
export function headlineReaction(
  summary: CommunityReactionSummary,
): RankedReaction | undefined {
  return rankReactions(summary, 'self-reported')[0];
}

export function participantCount(
  summary: CommunityReactionSummary,
  source: CommunitySource,
): number {
  return source === 'estimated'
    ? summary.participantCount
    : summary.selfReportedParticipantCount;
}

/**
 * Whether a distribution rests on so few people that a percentage is
 * misleading. The threshold is arbitrary and deliberately generous; it exists
 * so `v-lowcontext` (9 self reports) is visibly treated differently from
 * `v-ragebait` (742).
 */
export const SMALL_SAMPLE_THRESHOLD = 30;

export function isSmallSample(
  summary: CommunityReactionSummary,
  source: CommunitySource,
): boolean {
  return participantCount(summary, source) < SMALL_SAMPLE_THRESHOLD;
}
