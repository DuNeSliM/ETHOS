import { CircleHelp } from 'lucide-react';

import {
  CONFIDENCE_LABEL,
  CONFIDENCE_SENTENCE,
  CONFIDENCE_STEPS,
} from '@/lib/labels';
import type { Confidence } from '@/types';

/**
 * Uncertainty display for an analysis.
 *
 * Three things communicate the same value on purpose: the word ("mittel"),
 * the filled-step count ("2 von 3"), and the bar. Colour is the least
 * important channel, so the component stays readable for people who cannot
 * distinguish the hues and for anyone using a screen reader.
 */
export function ConfidenceMeter({
  confidence,
  showSentence = true,
}: {
  confidence: Confidence;
  showSentence?: boolean;
}) {
  const steps = CONFIDENCE_STEPS[confidence];
  const toneClass = {
    low: 'bg-caution',
    medium: 'bg-info',
    high: 'bg-positive',
  }[confidence];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="text-sm font-semibold text-ink">
          Sicherheit der Einschätzung: {CONFIDENCE_LABEL[confidence]}
        </span>
        <span className="text-xs font-medium text-faint">
          ({steps} von 3)
        </span>
      </div>

      <div
        className="mt-1.5 flex gap-1"
        role="img"
        aria-label={`Sicherheit ${CONFIDENCE_LABEL[confidence]}, ${steps} von 3 Stufen`}
      >
        {[1, 2, 3].map((step) => (
          <span
            key={step}
            className={`h-2 flex-1 rounded-full ${
              step <= steps ? toneClass : 'bg-surface-3'
            }`}
          />
        ))}
      </div>

      {showSentence ? (
        <p className="mt-2 flex gap-1.5 text-sm text-muted">
          <CircleHelp aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>{CONFIDENCE_SENTENCE[confidence]}</span>
        </p>
      ) : null}
    </div>
  );
}
