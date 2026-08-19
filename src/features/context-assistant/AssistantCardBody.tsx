import {
  AlertTriangle,
  Eye,
  Info,
  Lightbulb,
  ListChecks,
  Repeat2,
  ThumbsDown,
  Volume2,
} from 'lucide-react';
import { useState } from 'react';

import { useAppState } from '@/app/AppStateProvider';
import { ConfidenceMeter } from '@/components/ConfidenceMeter';
import {
  Button,
  Chip,
  FieldLabel,
  Panel,
  SimulatedBadge,
} from '@/components/primitives';
import {
  POLARIZATION_LABEL,
  POLARIZATION_SENTENCE,
  VARIANT_SUBTITLE,
  VARIANT_TITLE,
} from '@/lib/labels';
import { mayShowPolarisation } from '@/features/simulation/mockEngine';
import { VARIANT_PRESENTATION } from '@/features/context-assistant/variantPresentation';
import type { AssistantCardVariant, ContentAnalysis } from '@/types';

/**
 * The assistance card contents.
 *
 * Rendered inside a `<Sheet>` from the feed, and inline on the post detail
 * page. Order is deliberate and constant across variants so participants learn
 * where to look:
 *
 *   headline -> one-line reading -> confidence -> reasoning -> observations
 *   -> tone/expression -> polarisation -> limits -> feedback controls
 *
 * The limits block is not optional. Every card admits what it cannot know.
 */
export function AssistantCardBody({
  analysis,
  variant,
}: {
  analysis: ContentAnalysis;
  variant: AssistantCardVariant;
}) {
  const { settings, recordFeedback } = useAppState();
  const [showReasoning, setShowReasoning] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState<null | string>(null);

  const { icon: Icon, tone } = VARIANT_PRESENTATION[variant];
  const showPolarisation =
    mayShowPolarisation(settings) &&
    (analysis.polarizationLevel !== 'low' || analysis.possibleRagebait);

  function sendFeedback(kind: 'not-helpful' | 'other-interpretation') {
    recordFeedback({ postId: analysis.postId, at: Date.now(), kind });
    setFeedbackSent(
      kind === 'not-helpful'
        ? 'Danke. Wir haben festgehalten, dass dieser Hinweis nicht hilfreich war.'
        : 'Danke. Wir haben festgehalten, dass du den Beitrag anders liest.',
    );
    if (kind === 'other-interpretation') setShowAlternatives(true);
  }

  return (
    <div className="space-y-5">
      {/* ---- headline ------------------------------------------------ */}
      <div>
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-assist-tint text-assist-strong"
          >
            <Icon className="size-5" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold tracking-tight text-ink">
                {VARIANT_TITLE[variant]}
              </h3>
              <Chip tone={tone}>Interpretation, keine Tatsache</Chip>
            </div>
            <p className="mt-1 text-sm text-muted">{VARIANT_SUBTITLE[variant]}</p>
          </div>
        </div>
      </div>

      {/* ---- uncertainty -------------------------------------------- */}
      <Panel variant="muted" className="p-3.5">
        <ConfidenceMeter confidence={analysis.confidence} />
      </Panel>

      {/* ---- plain explanation -------------------------------------- */}
      <section>
        <FieldLabel icon={<Info aria-hidden="true" className="size-3.5" />}>
          Kurze Begründung
        </FieldLabel>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink">
          {analysis.explanation}
        </p>

        {analysis.possibleIntent ? (
          <p className="mt-3 border-l-2 border-assist pl-3 text-sm text-muted">
            <span className="font-semibold text-ink">Mögliche Absicht: </span>
            {analysis.possibleIntent}
          </p>
        ) : null}
      </section>

      {/* ---- "why do you think that?" ------------------------------- */}
      <section>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowReasoning((open) => !open)}
          aria-expanded={showReasoning}
        >
          <Lightbulb aria-hidden="true" className="size-4" />
          {showReasoning
            ? 'Erklärung ausblenden'
            : 'Warum wird das so eingeschätzt?'}
        </Button>

        {showReasoning ? (
          <Panel variant="assist" className="mt-3 p-3.5">
            <FieldLabel
              icon={<ListChecks aria-hidden="true" className="size-3.5" />}
            >
              Woran es festgemacht wird
            </FieldLabel>

            {analysis.indicators.length > 0 ? (
              <ul className="mt-2 space-y-1.5">
                {analysis.indicators.map((indicator) => (
                  <li key={indicator} className="flex gap-2 text-sm text-ink">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-assist" />
                    <span>{indicator}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-ink">
                Es gibt keine belastbaren Anhaltspunkte. Deshalb gibt der
                Assistent hier bewusst keine Einschätzung ab.
              </p>
            )}

            <p className="mt-3 text-xs text-muted">
              In diesem Prototyp sind diese Punkte vorab geschrieben. Ein echtes
              System würde sie aus dem Beitrag ableiten und könnte dabei
              genauso irren.
            </p>
          </Panel>
        ) : null}
      </section>

      {/* ---- observable signals ------------------------------------- */}
      {analysis.visibleFacialExpression || analysis.toneOfVoice ? (
        <section>
          <FieldLabel icon={<Eye aria-hidden="true" className="size-3.5" />}>
            Sichtbare und hörbare Signale im Video
          </FieldLabel>
          <dl className="mt-2 space-y-2.5">
            {analysis.visibleFacialExpression ? (
              <div className="border-l-2 border-line pl-3">
                <dt className="text-sm font-semibold text-ink">
                  {analysis.visibleFacialExpression.label}
                </dt>
                <dd className="text-sm text-muted">
                  {analysis.visibleFacialExpression.note}
                </dd>
              </div>
            ) : null}
            {analysis.toneOfVoice ? (
              <div className="border-l-2 border-line pl-3">
                <dt className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                  <Volume2 aria-hidden="true" className="size-4" />
                  {analysis.toneOfVoice.label}
                </dt>
                <dd className="text-sm text-muted">{analysis.toneOfVoice.note}</dd>
              </div>
            ) : null}
          </dl>
        </section>
      ) : null}

      {/* ---- emotionalising language -------------------------------- */}
      {analysis.emotionalLanguage?.present ? (
        <section>
          <FieldLabel>Emotionalisierende Formulierungen</FieldLabel>
          <p className="mt-2 text-sm text-muted">
            Der Beitrag enthält Formulierungen, die stark auf Gefühle wirken
            können:
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {analysis.emotionalLanguage.examples.map((example) => (
              <li key={example}>
                <Chip tone="caution">{example}</Chip>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ---- polarisation ------------------------------------------- */}
      {showPolarisation ? (
        <section>
          <FieldLabel
            icon={<AlertTriangle aria-hidden="true" className="size-3.5" />}
          >
            Polarisierung
          </FieldLabel>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Chip
              tone={analysis.polarizationLevel === 'high' ? 'alert' : 'caution'}
            >
              Grad: {POLARIZATION_LABEL[analysis.polarizationLevel]}
            </Chip>
            {analysis.possibleRagebait ? (
              <Chip tone="alert">
                Könnte auf Reaktionen ausgerichtet sein
              </Chip>
            ) : null}
          </div>
          <p className="mt-2 text-sm text-muted">
            {POLARIZATION_SENTENCE[analysis.polarizationLevel]}
          </p>
          {analysis.possibleRagebait ? (
            <p className="mt-1.5 text-sm text-muted">
              Das ist eine Vermutung über die Formulierung, kein Nachweis einer
              Absicht. Es sagt auch nichts darüber, ob die Sachaussage richtig
              oder falsch ist.
            </p>
          ) : null}
        </section>
      ) : null}

      {/* ---- limits ------------------------------------------------- */}
      <section>
        <Panel variant="muted" className="p-3.5">
          <FieldLabel
            icon={<AlertTriangle aria-hidden="true" className="size-3.5" />}
          >
            Was diese Analyse nicht wissen kann
          </FieldLabel>
          <ul className="mt-2 space-y-1.5">
            {analysis.limitations.map((limitation) => (
              <li key={limitation} className="flex gap-2 text-sm text-muted">
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-line-strong" />
                <span>{limitation}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </section>

      {/* ---- alternatives ------------------------------------------- */}
      {showAlternatives ? (
        <section>
          <FieldLabel icon={<Repeat2 aria-hidden="true" className="size-3.5" />}>
            Andere mögliche Lesarten
          </FieldLabel>
          <ul className="mt-2 space-y-1.5">
            {analysis.alternativeReadings.map((reading) => (
              <li key={reading} className="flex gap-2 text-sm text-ink">
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-info" />
                <span>{reading}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ---- feedback ----------------------------------------------- */}
      <section className="border-t border-line pt-4">
        <FieldLabel>War dieser Hinweis brauchbar?</FieldLabel>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button size="sm" onClick={() => sendFeedback('not-helpful')}>
            <ThumbsDown aria-hidden="true" className="size-4" />
            Nicht hilfreich
          </Button>
          <Button size="sm" onClick={() => sendFeedback('other-interpretation')}>
            <Repeat2 aria-hidden="true" className="size-4" />
            Andere Interpretation
          </Button>
        </div>

        {/* Announced so keyboard and screen reader users get confirmation. */}
        <p role="status" className="mt-2 min-h-5 text-sm font-medium text-assist-strong">
          {feedbackSent}
        </p>

        <div className="mt-3">
          <SimulatedBadge label="Diese Einschätzung ist vorab geschrieben, nicht berechnet" />
        </div>
      </section>
    </div>
  );
}
