/**
 * The mock engine.
 *
 * This is the ONLY place that produces "analysis" results. There is no model,
 * no network call and no real detection anywhere in this prototype - every
 * value below is either hand-authored in `src/data` or derived from it by a
 * pure function.
 *
 * Design rules:
 *  - Deterministic. The same post always yields the same result, so a
 *    moderated test session never gets a surprise.
 *  - Settings-aware. A feature that the participant has not consented to must
 *    produce `null`, not a hidden result.
 *  - Card variants are DERIVED from the analysis, never stored next to it, so
 *    a headline can never contradict the data it summarises.
 */

import { ANALYSES, COMMENT_ANALYSES, getAnalysis } from '@/data/analyses';
import { getCommunity } from '@/data/community';
import { getTimeline } from '@/data/timelines';
import { getPost } from '@/data/posts';
import type {
  AssistantCardVariant,
  CommunityReactionSummary,
  ContentAnalysis,
  ContentCategory,
  EstimatedExpression,
  ReactionTimelineSegment,
  Settings,
} from '@/types';

/* ------------------------------------------------------------------ */
/* Card variant derivation                                             */
/* ------------------------------------------------------------------ */

/**
 * Maps an analysis onto one of the seven card presentations.
 *
 * Precedence matters and is asserted in the tests:
 *   1. no indicators at all        -> we simply do not know enough
 *   2. flagged as possible ragebait
 *   3. sarcasm / irony             -> the literal-meaning cases
 *   4. frustrated / aggressive     -> emotional tone
 *   5. humour                      -> exaggeration meant as a joke
 *   6. anything still unclear      -> ambiguous
 */
export function deriveCardVariant(
  analysis: ContentAnalysis,
): AssistantCardVariant {
  if (analysis.indicators.length === 0) return 'insufficient-context';
  if (analysis.possibleRagebait) return 'ragebait';

  switch (analysis.probableTone) {
    case 'sarcastic':
      return 'sarcasm';
    case 'ironic':
      return 'irony';
    case 'frustrated':
    case 'aggressive':
      return 'emotional';
    case 'humorous':
      return 'exaggeration';
    case 'neutral':
    case 'unclear':
    default:
      return 'ambiguous';
  }
}

/** Content bucket used by the personal overview. Derived, never stored. */
export function deriveContentCategory(
  analysis: ContentAnalysis | undefined,
): ContentCategory {
  if (!analysis) return 'informational';
  if (analysis.probableTone === 'sarcastic' || analysis.probableTone === 'ironic') {
    return 'sarcasm';
  }
  if (analysis.possibleRagebait || analysis.polarizationLevel === 'high') {
    return 'polarising';
  }
  if (analysis.probableTone === 'frustrated') return 'emotional';
  if (analysis.probableTone === 'humorous') return 'humor';
  return 'informational';
}

/* ------------------------------------------------------------------ */
/* Content analysis, gated by consent                                  */
/* ------------------------------------------------------------------ */

export type AnalysisAvailability =
  | { status: 'available'; analysis: ContentAnalysis; variant: AssistantCardVariant }
  /** The participant switched something off - we say which switch. */
  | { status: 'disabled'; reason: 'paused' | 'analysis-off' | 'sarcasm-off' | 'ragebait-off' }
  /** No scripted analysis exists for this post. */
  | { status: 'none' };

/**
 * Returns the analysis for a post, or an explicit reason why it is withheld.
 *
 * Returning a tagged reason rather than `null` lets the UI tell the user
 * *which* setting is hiding the hint, which is one of the things we want to
 * test (can people find the switches again?).
 */
export function resolveAnalysis(
  postId: string,
  settings: Settings,
): AnalysisAvailability {
  const analysis = getAnalysis(postId);
  if (!analysis) return { status: 'none' };

  if (settings.assistantPaused) return { status: 'disabled', reason: 'paused' };
  if (!settings.contentAnalysis) {
    return { status: 'disabled', reason: 'analysis-off' };
  }

  const variant = deriveCardVariant(analysis);

  if (!settings.sarcasmHints && (variant === 'sarcasm' || variant === 'irony')) {
    return { status: 'disabled', reason: 'sarcasm-off' };
  }
  if (!settings.ragebaitHints && variant === 'ragebait') {
    return { status: 'disabled', reason: 'ragebait-off' };
  }

  return { status: 'available', analysis, variant };
}

/** Whether the polarisation block may be rendered inside a card. */
export function mayShowPolarisation(settings: Settings): boolean {
  return settings.ragebaitHints && !settings.assistantPaused;
}

/* ------------------------------------------------------------------ */
/* Simulated viewer expression                                         */
/* ------------------------------------------------------------------ */

/**
 * Fixed simulated camera estimates per post.
 *
 * `v-ragebait` is intentionally wrong: the scripted estimate is a smile while
 * most people report being annoyed. Research Mode scenario 3 uses exactly this
 * mismatch to see whether participants find and use the correction control.
 */
const SIMULATED_EXPRESSION: Record<
  string,
  { expression: EstimatedExpression; confidence: number }
> = {
  'v-humor': { expression: 'smile', confidence: 0.83 },
  'v-sarcasm': { expression: 'neutral', confidence: 0.61 },
  'v-emotional': { expression: 'tense', confidence: 0.57 },
  'v-ragebait': { expression: 'smile', confidence: 0.66 },
  'v-lowcontext': { expression: 'unclear', confidence: 0.28 },
  'd-sarcasm': { expression: 'smile', confidence: 0.71 },
  'd-irony': { expression: 'neutral', confidence: 0.44 },
  'd-aggressive-headline': { expression: 'tense', confidence: 0.52 },
  'd-polarising': { expression: 'tense', confidence: 0.63 },
};

export type ExpressionEstimate = {
  expression: EstimatedExpression;
  confidence: number;
};

/**
 * The simulated own-reaction estimate for a post.
 *
 * Returns `null` whenever the participant has not switched the simulated
 * capture on, or while the assistant is paused. There is no code path that
 * produces an estimate without that switch being true.
 */
export function estimateViewerExpression(
  postId: string,
  settings: Settings,
): ExpressionEstimate | null {
  if (settings.assistantPaused) return null;
  if (!settings.simulatedCameraCapture) return null;
  return SIMULATED_EXPRESSION[postId] ?? { expression: 'unclear', confidence: 0.3 };
}

/* ------------------------------------------------------------------ */
/* Timeline                                                            */
/* ------------------------------------------------------------------ */

export function resolveTimeline(
  postId: string,
  settings: Settings,
): ReactionTimelineSegment[] | null {
  if (settings.assistantPaused) return null;
  if (!settings.simulatedCameraCapture) return null;
  return getTimeline(postId) ?? null;
}

/** The segment covering a playback position, or undefined past the end. */
export function segmentAt(
  segments: ReactionTimelineSegment[],
  seconds: number,
): ReactionTimelineSegment | undefined {
  return segments.find(
    (segment) => seconds >= segment.fromSeconds && seconds < segment.toSeconds,
  );
}

/* ------------------------------------------------------------------ */
/* Community                                                           */
/* ------------------------------------------------------------------ */

export function resolveCommunity(
  postId: string,
  settings: Settings,
): CommunityReactionSummary | null {
  if (settings.assistantPaused) return null;
  if (!settings.showCommunityReactions) return null;
  return getCommunity(postId) ?? null;
}

/* ------------------------------------------------------------------ */
/* Introspection helpers used by tests and the demo reset              */
/* ------------------------------------------------------------------ */

/** Every post id that has a scripted post-level analysis. */
export function analysedPostIds(): string[] {
  return Object.keys(ANALYSES);
}

/** Every comment id that has a scripted analysis. */
export function analysedCommentIds(): string[] {
  return Object.keys(COMMENT_ANALYSES);
}

export function postExists(postId: string): boolean {
  return getPost(postId) !== undefined;
}
