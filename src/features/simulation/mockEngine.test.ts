import { describe, expect, it } from 'vitest';

import { DEFAULT_SETTINGS } from '@/app/AppStateProvider';
import { ANALYSES } from '@/data/analyses';
import {
  deriveCardVariant,
  deriveContentCategory,
  estimateViewerExpression,
  resolveAnalysis,
  resolveCommunity,
  resolveTimeline,
  segmentAt,
} from '@/features/simulation/mockEngine';
import type { AssistantCardVariant, Settings } from '@/types';

const settings = (overrides: Partial<Settings> = {}): Settings => ({
  ...DEFAULT_SETTINGS,
  ...overrides,
});

describe('deriveCardVariant', () => {
  /**
   * Section 6.6 of the brief requires all seven presentations to be reachable.
   * If a data edit ever collapses two cases onto one variant, this fails.
   */
  it('covers every card variant across the authored posts', () => {
    const produced = new Set<AssistantCardVariant>(
      Object.values(ANALYSES).map(deriveCardVariant),
    );

    const required: AssistantCardVariant[] = [
      'sarcasm',
      'irony',
      'emotional',
      'exaggeration',
      'ragebait',
      'ambiguous',
      'insufficient-context',
    ];

    required.forEach((variant) => expect(produced).toContain(variant));
  });

  it('maps each example post to its intended variant', () => {
    const expected: Record<string, AssistantCardVariant> = {
      'v-humor': 'exaggeration',
      'v-sarcasm': 'sarcasm',
      'v-emotional': 'emotional',
      'v-ragebait': 'ragebait',
      'v-lowcontext': 'insufficient-context',
      'd-sarcasm': 'sarcasm',
      'd-irony': 'irony',
      'd-aggressive-headline': 'ambiguous',
      'd-polarising': 'emotional',
    };

    Object.entries(expected).forEach(([postId, variant]) => {
      expect(deriveCardVariant(ANALYSES[postId])).toBe(variant);
    });
  });

  it('prefers "insufficient-context" over any tone when there are no indicators', () => {
    const variant = deriveCardVariant({
      ...ANALYSES['v-sarcasm'],
      indicators: [],
    });
    expect(variant).toBe('insufficient-context');
  });

  it('prefers "ragebait" over the tone-based variants', () => {
    const variant = deriveCardVariant({
      ...ANALYSES['v-sarcasm'],
      possibleRagebait: true,
    });
    expect(variant).toBe('ragebait');
  });
});

describe('resolveAnalysis consent gating', () => {
  it('returns the analysis when everything is enabled', () => {
    const result = resolveAnalysis('v-sarcasm', settings());
    expect(result.status).toBe('available');
  });

  it('withholds everything while the assistant is paused', () => {
    const result = resolveAnalysis('v-sarcasm', settings({ assistantPaused: true }));
    expect(result).toEqual({ status: 'disabled', reason: 'paused' });
  });

  it('withholds everything when content analysis is off', () => {
    const result = resolveAnalysis('v-sarcasm', settings({ contentAnalysis: false }));
    expect(result).toEqual({ status: 'disabled', reason: 'analysis-off' });
  });

  it('names the sarcasm switch when only that category is off', () => {
    const result = resolveAnalysis('v-sarcasm', settings({ sarcasmHints: false }));
    expect(result).toEqual({ status: 'disabled', reason: 'sarcasm-off' });
  });

  it('keeps unrelated categories visible when sarcasm hints are off', () => {
    const result = resolveAnalysis('v-emotional', settings({ sarcasmHints: false }));
    expect(result.status).toBe('available');
  });

  it('names the ragebait switch when only that category is off', () => {
    const result = resolveAnalysis('v-ragebait', settings({ ragebaitHints: false }));
    expect(result).toEqual({ status: 'disabled', reason: 'ragebait-off' });
  });

  it('reports "none" for a post without a scripted analysis', () => {
    expect(resolveAnalysis('does-not-exist', settings())).toEqual({ status: 'none' });
  });
});

describe('viewer estimate gating', () => {
  /** The core privacy guarantee: no estimate without explicit consent. */
  it('produces no estimate while simulated capture is off (the default)', () => {
    expect(DEFAULT_SETTINGS.simulatedCameraCapture).toBe(false);
    expect(estimateViewerExpression('v-humor', settings())).toBeNull();
  });

  it('produces an estimate once capture is switched on', () => {
    const estimate = estimateViewerExpression(
      'v-humor',
      settings({ simulatedCameraCapture: true }),
    );
    expect(estimate).toEqual({ expression: 'smile', confidence: 0.83 });
  });

  it('produces no estimate while paused, even with capture on', () => {
    const estimate = estimateViewerExpression(
      'v-humor',
      settings({ simulatedCameraCapture: true, assistantPaused: true }),
    );
    expect(estimate).toBeNull();
  });

  it('deliberately mis-estimates the ragebait post so scenario 3 has something to correct', () => {
    const estimate = estimateViewerExpression(
      'v-ragebait',
      settings({ simulatedCameraCapture: true }),
    );
    expect(estimate?.expression).toBe('smile');
  });

  it('is deterministic across calls', () => {
    const a = estimateViewerExpression('v-emotional', settings({ simulatedCameraCapture: true }));
    const b = estimateViewerExpression('v-emotional', settings({ simulatedCameraCapture: true }));
    expect(a).toEqual(b);
  });
});

describe('timeline and community gating', () => {
  it('hides the timeline without capture consent', () => {
    expect(resolveTimeline('v-emotional', settings())).toBeNull();
  });

  it('returns the timeline with capture consent', () => {
    const timeline = resolveTimeline(
      'v-emotional',
      settings({ simulatedCameraCapture: true }),
    );
    expect(timeline).toHaveLength(4);
  });

  it('hides community data when the participant switched it off', () => {
    expect(
      resolveCommunity('v-ragebait', settings({ showCommunityReactions: false })),
    ).toBeNull();
  });
});

describe('segmentAt', () => {
  const segments = resolveTimeline(
    'v-emotional',
    settings({ simulatedCameraCapture: true }),
  )!;

  it('finds the segment covering a position', () => {
    expect(segmentAt(segments, 0)?.label).toBe('neutral');
    expect(segmentAt(segments, 8)?.label).toBe('amüsiert');
    expect(segmentAt(segments, 15)?.label).toBe('überrascht');
    expect(segmentAt(segments, 26.9)?.label).toBe('genervt');
  });

  it('treats the upper bound as exclusive so segments cannot overlap', () => {
    expect(segmentAt(segments, 6)?.label).toBe('amüsiert');
  });

  it('returns nothing past the end of the clip', () => {
    expect(segmentAt(segments, 27)).toBeUndefined();
  });
});

describe('deriveContentCategory', () => {
  it('sorts posts into buckets for the personal overview', () => {
    expect(deriveContentCategory(ANALYSES['v-humor'])).toBe('humor');
    expect(deriveContentCategory(ANALYSES['v-sarcasm'])).toBe('sarcasm');
    expect(deriveContentCategory(ANALYSES['d-irony'])).toBe('sarcasm');
    expect(deriveContentCategory(ANALYSES['v-emotional'])).toBe('emotional');
    expect(deriveContentCategory(ANALYSES['v-ragebait'])).toBe('polarising');
    expect(deriveContentCategory(ANALYSES['d-polarising'])).toBe('polarising');
    expect(deriveContentCategory(undefined)).toBe('informational');
  });
});
