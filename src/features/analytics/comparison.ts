import type { EstimatedExpression, SelfReportedReaction } from '@/types';

/**
 * Which self-reported reactions a given visible expression would plausibly
 * correspond to.
 *
 * This mapping exists ONLY to report how often the simulated estimate and the
 * participant's own answer pointed in the same direction. It is deliberately
 * coarse and generous: several emotions share one expression, which is the
 * whole reason a camera guess cannot stand in for asking someone.
 *
 * `unclear` maps to nothing - an inconclusive estimate is not something you can
 * be right or wrong about.
 */
const PLAUSIBLE_MATCH: Record<EstimatedExpression, SelfReportedReaction[]> = {
  smile: ['amused', 'interested'],
  surprise: ['surprised', 'interested'],
  tense: ['annoyed', 'angry', 'uncomfortable', 'confused'],
  neutral: ['neutral', 'interested'],
  unclear: [],
};

export type ComparisonVerdict = 'aligned' | 'diverged' | 'not-comparable';

/**
 * Compares one estimate with one self report.
 *
 * Returns `not-comparable` rather than forcing a verdict when the estimate was
 * inconclusive or the person chose "andere Reaktion" - counting those as
 * "wrong" would overstate what we actually know.
 */
export function compareEstimateWithSelfReport(
  expression: EstimatedExpression | undefined,
  selfReport: SelfReportedReaction | undefined,
): ComparisonVerdict {
  if (!expression || !selfReport) return 'not-comparable';
  if (expression === 'unclear' || selfReport === 'other') return 'not-comparable';
  return PLAUSIBLE_MATCH[expression].includes(selfReport)
    ? 'aligned'
    : 'diverged';
}

export const COMPARISON_LABEL: Record<ComparisonVerdict, string> = {
  aligned: 'Schätzung passte zu deiner Angabe',
  diverged: 'Schätzung wich von deiner Angabe ab',
  'not-comparable': 'Nicht vergleichbar',
};
