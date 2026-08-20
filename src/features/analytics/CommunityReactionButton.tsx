import { Users } from 'lucide-react';
import { useState } from 'react';

import { useAppState } from '@/app/AppStateProvider';
import { Sheet } from '@/components/Sheet';
import { Chip, SimulatedBadge } from '@/components/primitives';
import { CommunityReactions } from '@/features/analytics/CommunityReactions';
import {
  headlineReaction,
  isSmallSample,
  rankReactions,
} from '@/features/analytics/communitySummary';
import { resolveCommunity } from '@/features/simulation/mockEngine';

/**
 * The second thing the assistance layer adds to a post: one face.
 *
 * "Kontext erklären" answers *what the post means*. This button answers *how
 * other people took it* - and it has to answer it in the width of a thumb,
 * inside a feed nobody reads carefully. Hence an emoji: the most frequently
 * self-reported reaction, with its percentage next to it.
 *
 * The emoji is a door, not a verdict. Everything that makes the number
 * honest - which of the two sources it came from, how many people that is,
 * how the rest of the distribution looks, and that a volunteer sample is not
 * representative - lives one tap away in the panel, which is the same
 * component the detail page shows.
 *
 * Renders nothing when the participant switched community reactions off, while
 * the layer is paused, or when a post has no scripted numbers. That mirrors
 * `ContextAssistantButton`: an affordance that leads nowhere is worse than no
 * affordance.
 */
export function CommunityReactionButton({ postId }: { postId: string }) {
  const { settings } = useAppState();
  const [open, setOpen] = useState(false);

  const summary = resolveCommunity(postId, settings);
  const headline = summary ? headlineReaction(summary) : undefined;
  if (!summary || !headline) return null;

  const people = summary.selfReportedParticipantCount;
  const thin = isSmallSample(summary, 'self-reported');
  const runnerUp = rankReactions(summary, 'self-reported')[1];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        // The full claim, spelled out, because none of it is legible from an
        // emoji: which reaction, how big a share, of how many people, from
        // which source, and that the numbers are invented.
        aria-label={`Reaktionen anderer ansehen. Am häufigsten ${headline.label}, ${headline.value} Prozent von ${people} Selbstauskünften. Simulierte Werte.`}
        className="
          inline-flex items-center gap-1.5 rounded-lg border border-assist-line
          bg-assist-tint px-2.5 py-1 text-sm font-semibold text-assist-strong
          hover:bg-assist-tint-2
        "
      >
        <span className="text-xs font-medium">Am häufigsten:</span>
        <span aria-hidden="true" className="text-lg leading-none">{headline.emoji}</span>
        <span className="font-bold">{headline.label}</span>
        <span className="tabular-nums">
          · {thin ? `${people} Angaben` : `${headline.value} %`}
        </span>
      </button>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="So haben andere reagiert"
        description="Freiwillige, anonyme Angaben anderer Personen zu diesem Beitrag."
        titleAdornment={<SimulatedBadge label="erfundene Werte" />}
      >
        <div className="space-y-4">
          {/* ---- the headline the button stands for ------------------ */}
          <div className="flex items-center gap-3 rounded-[var(--radius-panel)] border border-assist-line bg-assist-tint p-4">
            <span aria-hidden="true" className="text-4xl leading-none">
              {headline.emoji}
            </span>
            <div className="min-w-0">
              <p className="text-sm text-muted">Am häufigsten genannt</p>
              <p className="text-lg font-bold leading-tight text-ink">
                {headline.label}
                <span className="ml-2 text-base font-semibold tabular-nums text-assist-strong">
                  {headline.value} %
                </span>
              </p>
              <p className="mt-0.5 text-xs text-muted">
                aus {people.toLocaleString('de-DE')}{' '}
                {people === 1 ? 'Selbstauskunft' : 'Selbstauskünften'}
                {runnerUp ? (
                  <>
                    {' · '}danach {runnerUp.emoji} {runnerUp.label} mit{' '}
                    {runnerUp.value} %
                  </>
                ) : null}
              </p>
            </div>
          </div>

          {/*
            An emoji collapses a distribution into one face. Say that out loud
            rather than letting the button imply consensus - on `v-ragebait`
            the leading self report is 34 %, which means two out of three
            people felt something else.
          */}
          <Chip tone="caution">
            {thin
              ? 'Sehr wenige Angaben. Ein Prozentwert wäre hier irreführend.'
              : `Ein Symbol steht für die häufigste Angabe, nicht für alle: ${100 - headline.value} % haben etwas anderes angegeben.`}
          </Chip>

          {/* ---- the full breakdown --------------------------------- */}
          <section aria-labelledby={`breakdown-${postId}`}>
            <h3
              id={`breakdown-${postId}`}
              className="flex items-center gap-2 text-sm font-bold text-ink"
            >
              <Users aria-hidden="true" className="size-4 shrink-0 text-assist-strong" />
              Alle Reaktionen im Detail
            </h3>
            <div className="mt-2">
              {/*
                Opens on the self reports, because that is the number the
                button showed. The camera estimates are the other radio
                option, never a merged average.
              */}
              <CommunityReactions
                summary={summary}
                initialSource="self-reported"
                embedded
              />
            </div>
          </section>
        </div>
      </Sheet>
    </>
  );
}
