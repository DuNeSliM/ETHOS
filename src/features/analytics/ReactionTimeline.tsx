import { Timer } from 'lucide-react';

import { Chip, FieldLabel, Panel, SimulatedBadge } from '@/components/primitives';
import { formatClock } from '@/data/timelines';
import { EXPRESSION_LABEL } from '@/lib/labels';
import { segmentAt } from '@/features/simulation/mockEngine';
import type { EstimatedExpression, ReactionTimelineSegment } from '@/types';

/**
 * Colour per expression. Never the only signal - each segment also carries its
 * label as text, and the legend below spells out every band.
 */
const SEGMENT_COLOR: Record<EstimatedExpression, string> = {
  smile: 'var(--cl-positive)',
  surprise: 'var(--cl-info)',
  tense: 'var(--cl-caution)',
  neutral: 'var(--cl-neutral)',
  // Same base colour as `neutral` so the label stays readable; the two are
  // told apart by the diagonal hatch below, not by a paler fill. A lighter
  // grey here failed the 3:1 contrast requirement against its own label.
  unclear: 'var(--cl-neutral)',
};

/** Diagonal hatch marking an inconclusive segment. */
const HATCH =
  'repeating-linear-gradient(135deg, rgb(255 255 255 / 0.28) 0 3px, transparent 3px 9px)';

function segmentStyle(expression: EstimatedExpression) {
  const backgroundColor = SEGMENT_COLOR[expression];
  return expression === 'unclear'
    ? { backgroundColor, backgroundImage: HATCH }
    : { backgroundColor };
}

/**
 * Simulated reaction course over the length of a video.
 *
 * Sits directly under the playback bar so the bands line up with the clip's
 * timeline. `currentTime` highlights the band the playhead is in, which is the
 * "reaction changes during the video" behaviour the brief asks for.
 */
export function ReactionTimeline({
  segments,
  durationSeconds,
  currentTime,
}: {
  segments: ReactionTimelineSegment[];
  durationSeconds: number;
  currentTime?: number;
}) {
  const activeSegment =
    currentTime === undefined ? undefined : segmentAt(segments, currentTime);

  return (
    <Panel as="section" className="p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Timer aria-hidden="true" className="size-5 text-assist-strong" />
        <h2 className="text-base font-bold text-ink">
          Verlauf deiner geschätzten Reaktion
        </h2>
        <SimulatedBadge label="erfundener Verlauf" />
      </div>

      <p className="mt-1.5 text-sm text-muted">
        So hätte sich eine Kamera-Schätzung während des Videos verändert. Es sind
        Beschreibungen von sichtbarem Ausdruck, keine Aussagen darüber, was du
        wirklich empfunden hast.
      </p>

      {/* ---- band ---------------------------------------------------- */}
      <div className="mt-4">
        <div
          className="flex h-11 overflow-hidden rounded-lg border border-line"
          role="img"
          aria-label={`Reaktionsverlauf: ${segments
            .map(
              (segment) =>
                `${formatClock(segment.fromSeconds)} bis ${formatClock(
                  segment.toSeconds,
                )} ${segment.label}`,
            )
            .join(', ')}`}
        >
          {segments.map((segment) => {
            const width =
              ((segment.toSeconds - segment.fromSeconds) / durationSeconds) * 100;
            const isActive = activeSegment === segment;
            return (
              <div
                key={`${segment.fromSeconds}-${segment.expression}`}
                style={{
                  width: `${width}%`,
                  ...segmentStyle(segment.expression),
                }}
                className={`
                  flex items-center justify-center overflow-hidden px-1
                  ${isActive ? 'ring-2 ring-inset ring-ink' : ''}
                `}
              >
                {/*
                  The band colours are the semantic tokens, which are dark in
                  light mode and light in dark mode. `text-inverse` flips with
                  them, so the label stays readable in both schemes - a blend
                  mode here produced unpredictable contrast.
                */}
                <span className="truncate text-[0.6875rem] font-bold text-inverse">
                  {segment.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Time axis. */}
        <div className="mt-1 flex justify-between font-mono text-[0.6875rem] text-faint">
          <span>{formatClock(0)}</span>
          <span>{formatClock(durationSeconds)}</span>
        </div>
      </div>

      {activeSegment ? (
        <p role="status" className="mt-3 text-sm text-ink">
          Bei {formatClock(currentTime ?? 0)}: geschätzter Ausdruck{' '}
          <strong className="font-semibold">
            {EXPRESSION_LABEL[activeSegment.expression].toLowerCase()}
          </strong>{' '}
          („{activeSegment.label}“), Sicherheit{' '}
          {Math.round(activeSegment.confidence * 100)} %.
        </p>
      ) : null}

      {/* ---- readable legend ---------------------------------------- */}
      <div className="mt-4 border-t border-line pt-3.5">
        <FieldLabel>Abschnitte im Detail</FieldLabel>
        <ul className="mt-2 space-y-1.5">
          {segments.map((segment) => (
            <li
              key={`legend-${segment.fromSeconds}`}
              className="flex flex-wrap items-center gap-2 text-sm"
            >
              <span
                aria-hidden="true"
                className="size-3 shrink-0 rounded-sm border border-line"
                style={segmentStyle(segment.expression)}
              />
              <span className="font-mono text-xs tabular-nums text-muted">
                {formatClock(segment.fromSeconds)}–{formatClock(segment.toSeconds)}
              </span>
              <span className="font-medium text-ink">{segment.label}</span>
              <span className="text-xs text-faint">
                ({EXPRESSION_LABEL[segment.expression].toLowerCase()}, Sicherheit{' '}
                {Math.round(segment.confidence * 100)} %)
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3">
        <Chip tone="caution">
          Ein Ausdruck kann viele Ursachen haben. Dieser Verlauf beweist nichts
          über dein Empfinden.
        </Chip>
      </div>
    </Panel>
  );
}
