import { describe, expect, it } from 'vitest';

import { ANALYSES, COMMENT_ANALYSES } from '@/data/analyses';
import { COMMUNITY } from '@/data/community';
import { POSTS } from '@/data/posts';
import { TIMELINES } from '@/data/timelines';
import { COMMUNITY_KEY_LABEL } from '@/lib/labels';

/**
 * Data integrity checks.
 *
 * The prototype's credibility rests on hand-authored content, so these tests
 * guard the invariants a reader would otherwise have to verify by eye.
 */

describe('posts', () => {
  it('meets the acceptance criterion of at least eight example posts', () => {
    expect(POSTS.length).toBeGreaterThanOrEqual(8);
  });

  it('provides at least four posts in each feed mode', () => {
    expect(POSTS.filter((p) => p.mode === 'visual').length).toBeGreaterThanOrEqual(4);
    expect(POSTS.filter((p) => p.mode === 'discussion').length).toBeGreaterThanOrEqual(4);
  });

  it('uses unique ids', () => {
    const ids = POSTS.map((post) => post.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every post a scripted analysis', () => {
    POSTS.forEach((post) => {
      expect(ANALYSES[post.id], `missing analysis for ${post.id}`).toBeDefined();
    });
  });

  it('describes every media placeholder, since the description is the content', () => {
    POSTS.filter((post) => post.media).forEach((post) => {
      expect(post.media!.altText.length).toBeGreaterThan(30);
    });
  });

  it('gives every video a duration', () => {
    POSTS.filter((post) => post.media?.kind === 'video').forEach((post) => {
      expect(post.media!.durationSeconds).toBeGreaterThan(0);
    });
  });

  it('flags exactly the comments that have their own analysis', () => {
    POSTS.flatMap((post) => post.comments ?? []).forEach((comment) => {
      expect(
        COMMENT_ANALYSES[comment.id] !== undefined,
        `comment ${comment.id} hasAnalysis flag does not match the data`,
      ).toBe(comment.hasAnalysis);
    });
  });
});

describe('analyses', () => {
  const all = { ...ANALYSES, ...COMMENT_ANALYSES };

  it('always states at least one thing it cannot know', () => {
    Object.values(all).forEach((analysis) => {
      expect(
        analysis.limitations.length,
        `${analysis.postId} has no limitations listed`,
      ).toBeGreaterThan(0);
    });
  });

  it('always offers at least one alternative reading', () => {
    Object.values(all).forEach((analysis) => {
      expect(analysis.alternativeReadings.length).toBeGreaterThan(0);
    });
  });

  it('keeps every explanation hedged rather than definitive', () => {
    // The wording rule from section 1 of the brief: no analysis may claim
    // certainty. Every explanation has to contain at least one hedge.
    const hedges = [
      'wahrscheinlich',
      'vermutlich',
      'möglicherweise',
      'könnte',
      'kann',
      'wirkt',
      'nicht eindeutig',
      'fehlt',
    ];
    Object.values(all).forEach((analysis) => {
      const text = analysis.explanation.toLowerCase();
      expect(
        hedges.some((hedge) => text.includes(hedge)),
        `explanation for ${analysis.postId} reads as a certainty: "${analysis.explanation}"`,
      ).toBe(true);
    });
  });

  it('never uses forbidden absolute phrasings', () => {
    const forbidden = [
      'ist definitiv',
      'die person ist wütend',
      'macht dich',
      'die ki weiß',
      'die ki kennt',
    ];
    Object.values(all).forEach((analysis) => {
      const haystack = [
        analysis.explanation,
        analysis.possibleIntent ?? '',
        ...analysis.indicators,
        ...analysis.limitations,
      ]
        .join(' ')
        .toLowerCase();
      forbidden.forEach((phrase) => {
        expect(haystack, `${analysis.postId} contains "${phrase}"`).not.toContain(
          phrase,
        );
      });
    });
  });

  it('only omits indicators for the deliberate low-context example', () => {
    const withoutIndicators = Object.values(all)
      .filter((analysis) => analysis.indicators.length === 0)
      .map((analysis) => analysis.postId);
    expect(withoutIndicators).toEqual(['v-lowcontext']);
  });
});

describe('community summaries', () => {
  it('exists for every post', () => {
    POSTS.forEach((post) => {
      expect(COMMUNITY[post.id], `missing community data for ${post.id}`).toBeDefined();
    });
  });

  it('has both distributions total 100 percent', () => {
    Object.values(COMMUNITY).forEach((summary) => {
      const sum = (record: Record<string, number>) =>
        Object.values(record).reduce((total, value) => total + value, 0);

      expect(sum(summary.estimatedReactions), `${summary.postId} estimated`).toBe(100);
      expect(sum(summary.selfReportedReactions), `${summary.postId} self-reported`).toBe(
        100,
      );
    });
  });

  it('uses only reaction keys the UI has labels for', () => {
    Object.values(COMMUNITY).forEach((summary) => {
      [
        ...Object.keys(summary.estimatedReactions),
        ...Object.keys(summary.selfReportedReactions),
      ].forEach((key) => {
        expect(COMMUNITY_KEY_LABEL[key], `unlabelled key "${key}"`).toBeDefined();
      });
    });
  });

  it('never reports more self-reports than total participants', () => {
    Object.values(COMMUNITY).forEach((summary) => {
      expect(summary.selfReportedParticipantCount).toBeLessThanOrEqual(
        summary.participantCount,
      );
    });
  });

  it('never puts "unclear" into the self-reported bucket', () => {
    // "nicht eindeutig" describes a failed camera estimate. A person choosing
    // their own reaction always picks something meaningful, or "andere".
    Object.values(COMMUNITY).forEach((summary) => {
      expect(Object.keys(summary.selfReportedReactions)).not.toContain('unclear');
    });
  });

  it('always carries a representativeness warning', () => {
    Object.values(COMMUNITY).forEach((summary) => {
      expect(summary.representativeWarning.length).toBeGreaterThan(20);
      expect(summary.sourceExplanation.length).toBeGreaterThan(20);
    });
  });
});

describe('reaction timelines', () => {
  it('starts at zero and covers the clip without gaps or overlaps', () => {
    Object.entries(TIMELINES).forEach(([postId, segments]) => {
      expect(segments[0].fromSeconds, `${postId} does not start at 0`).toBe(0);

      segments.forEach((segment, index) => {
        expect(segment.toSeconds).toBeGreaterThan(segment.fromSeconds);
        if (index > 0) {
          expect(
            segment.fromSeconds,
            `${postId} has a gap or overlap at segment ${index}`,
          ).toBe(segments[index - 1].toSeconds);
        }
      });
    });
  });

  it('ends exactly at the video duration', () => {
    Object.entries(TIMELINES).forEach(([postId, segments]) => {
      const post = POSTS.find((p) => p.id === postId);
      expect(post?.media?.durationSeconds).toBe(segments[segments.length - 1].toSeconds);
    });
  });

  it('matches the example from the brief for the emotional video', () => {
    expect(
      TIMELINES['v-emotional'].map((s) => [s.fromSeconds, s.toSeconds, s.label]),
    ).toEqual([
      [0, 6, 'neutral'],
      [6, 12, 'amüsiert'],
      [12, 19, 'überrascht'],
      [19, 27, 'genervt'],
    ]);
  });

  it('keeps confidences within a plausible range', () => {
    Object.values(TIMELINES)
      .flat()
      .forEach((segment) => {
        expect(segment.confidence).toBeGreaterThan(0);
        expect(segment.confidence).toBeLessThanOrEqual(1);
      });
  });
});
