import type { ReactionTimelineSegment } from '@/types';

/**
 * Simulated reaction timelines shown under a video's playback bar.
 *
 * `expression` is what a camera would supposedly SEE, `label` is the everyday
 * word we show next to it. Keeping both means the UI can display "amüsiert"
 * while the underlying claim stays "sichtbares Lächeln".
 *
 * Segment boundaries are inclusive-exclusive in seconds and must cover the
 * whole clip without gaps (asserted in the unit tests).
 */
export const TIMELINES: Record<string, ReactionTimelineSegment[]> = {
  /** The example from the brief (section 6.9). 27 second clip. */
  'v-emotional': [
    { fromSeconds: 0, toSeconds: 6, expression: 'neutral', label: 'neutral', confidence: 0.72 },
    { fromSeconds: 6, toSeconds: 12, expression: 'smile', label: 'amüsiert', confidence: 0.58 },
    { fromSeconds: 12, toSeconds: 19, expression: 'surprise', label: 'überrascht', confidence: 0.64 },
    { fromSeconds: 19, toSeconds: 27, expression: 'tense', label: 'genervt', confidence: 0.49 },
  ],

  'v-ragebait': [
    { fromSeconds: 0, toSeconds: 5, expression: 'neutral', label: 'neutral', confidence: 0.68 },
    { fromSeconds: 5, toSeconds: 9, expression: 'surprise', label: 'überrascht', confidence: 0.61 },
    { fromSeconds: 9, toSeconds: 16, expression: 'tense', label: 'angespannt', confidence: 0.55 },
    { fromSeconds: 16, toSeconds: 22, expression: 'unclear', label: 'nicht eindeutig', confidence: 0.31 },
  ],

  'v-humor': [
    { fromSeconds: 0, toSeconds: 4, expression: 'neutral', label: 'neutral', confidence: 0.7 },
    { fromSeconds: 4, toSeconds: 13, expression: 'smile', label: 'amüsiert', confidence: 0.81 },
    { fromSeconds: 13, toSeconds: 18, expression: 'smile', label: 'amüsiert', confidence: 0.66 },
  ],
};

export function getTimeline(
  postId: string,
): ReactionTimelineSegment[] | undefined {
  return TIMELINES[postId];
}

/** Formats seconds as mm:ss for the timeline axis. */
export function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
