import { Info, ScanFace, Users, UserCheck } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import { Chip, FieldLabel, Panel, SimulatedBadge } from '@/components/primitives';
import { participantCount, rankReactions } from '@/features/analytics/communitySummary';
import type { CommunityReactionSummary, CommunitySource } from '@/types';

/**
 * Aggregated community reactions for one post.
 *
 * The source toggle is the heart of this component. Camera estimates and active
 * self reports are two different claims about two different things, so they get
 * two separate datasets, two separate participant counts, and a switch rather
 * than a stacked chart - averaging them would be exactly the confusion the
 * study is trying to avoid.
 *
 * Every bar is labelled with its percentage and its reaction name, so the chart
 * is readable without relying on colour or on hovering.
 */
export function CommunityReactions({
  summary,
  /** Which of the two datasets is shown first. */
  initialSource = 'estimated',
  /**
   * `true` when the component already sits inside a titled container (the
   * sheet behind the reaction button), so it drops its own panel and heading
   * instead of repeating them.
   */
  embedded = false,
}: {
  summary: CommunityReactionSummary;
  initialSource?: CommunitySource;
  embedded?: boolean;
}) {
  const [source, setSource] = useState<CommunitySource>(initialSource);

  // The emoji rides along on the visual axis only. The screen reader table
  // below keeps the plain word, because "Gesicht mit rollenden Augen, genervt"
  // is noise once the word is already there.
  const data = rankReactions(summary, source).map((row) => ({
    ...row,
    chartLabel: `${row.emoji} ${row.label}`,
  }));
  const shownParticipants = participantCount(summary, source);

  const Wrapper = embedded ? PlainWrapper : PanelWrapper;

  return (
    <Wrapper>
      {embedded ? null : (
        <div className="flex flex-wrap items-center gap-2">
          <Users aria-hidden="true" className="size-5 text-assist-strong" />
          <h2 className="text-base font-bold text-ink">Reaktionen der Community</h2>
          <SimulatedBadge label="erfundene Werte" />
        </div>
      )}

      {/* ---- source switch ------------------------------------------ */}
      <div
        role="radiogroup"
        aria-label="Datenquelle der Reaktionen"
        className="mt-3 flex flex-wrap gap-2"
      >
        {(
          [
            {
              value: 'estimated' as const,
              label: 'Automatische Schätzungen',
              icon: ScanFace,
            },
            {
              value: 'self-reported' as const,
              label: 'Aktive Selbstauskünfte',
              icon: UserCheck,
            },
          ]
        ).map(({ value, label, icon: Icon }) => {
          const isActive = source === value;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => setSource(value)}
              className={`
                inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5
                text-sm font-medium transition-colors
                ${
                  isActive
                    ? 'border-assist bg-assist-tint font-semibold text-assist-strong'
                    : 'border-line bg-surface text-muted hover:bg-surface-2'
                }
              `}
            >
              <Icon aria-hidden="true" className="size-4" />
              {label}
              {isActive ? <span className="sr-only">(ausgewählt)</span> : null}
            </button>
          );
        })}
      </div>

      <p className="mt-2.5 text-sm text-muted">
        {source === 'estimated' ? (
          <>
            <strong className="font-semibold text-ink">
              Automatische Schätzungen:
            </strong>{' '}
            von Kameras geschätzte Gesichtsausdrücke, in Reaktionswörter
            übersetzt. Diese Werte können falsch sein – niemand hat sie bestätigt.
          </>
        ) : (
          <>
            <strong className="font-semibold text-ink">
              Aktive Selbstauskünfte:
            </strong>{' '}
            Angaben, die Personen selbst ausgewählt haben. Weniger Daten, aber von
            Menschen bestätigt.
          </>
        )}
      </p>

      <p className="mt-2 text-sm font-semibold text-ink">
        {shownParticipants.toLocaleString('de-DE')}{' '}
        {shownParticipants === 1 ? 'Person' : 'Personen'} haben freiwillig
        teilgenommen
        {source === 'self-reported'
          ? ` (von ${summary.participantCount.toLocaleString('de-DE')} insgesamt)`
          : ''}
        .
      </p>

      {/* ---- chart -------------------------------------------------- */}
      <div className="mt-4">
        {/*
          A table equivalent for screen readers. The chart itself is hidden from
          the accessibility tree because an SVG of bars conveys nothing useful
          when read out node by node.
        */}
        <table className="sr-only">
          <caption>
            Verteilung der Reaktionen (
            {source === 'estimated'
              ? 'automatische Schätzungen'
              : 'aktive Selbstauskünfte'}
            ), simulierte Werte
          </caption>
          <thead>
            <tr>
              <th scope="col">Reaktion</th>
              <th scope="col">Anteil in Prozent</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.key}>
                <th scope="row">{row.label}</th>
                <td>{row.value} %</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div aria-hidden="true" style={{ height: data.length * 38 + 10 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 44, bottom: 0, left: 0 }}
              barCategoryGap={6}
            >
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis
                type="category"
                dataKey="chartLabel"
                width={132}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: 'var(--cl-text-muted)' }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} isAnimationActive={false}>
                {data.map((row) => (
                  <Cell
                    key={row.key}
                    fill={
                      // "nicht eindeutig" is not a reaction, so it is drawn in
                      // a neutral grey rather than sharing the data colour.
                      row.key === 'unclear'
                        ? 'var(--cl-border-strong)'
                        : source === 'estimated'
                          ? 'var(--cl-assist)'
                          : 'var(--cl-info)'
                    }
                  />
                ))}
                <LabelList
                  dataKey="value"
                  position="right"
                  formatter={(value: number) => `${value} %`}
                  style={{
                    fill: 'var(--cl-text)',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ---- caveats ------------------------------------------------ */}
      <div className="mt-4 space-y-2.5 border-t border-line pt-3.5">
        <div>
          <FieldLabel icon={<Info aria-hidden="true" className="size-3.5" />}>
            Woher kommen diese Zahlen?
          </FieldLabel>
          <p className="mt-1.5 text-sm text-muted">{summary.sourceExplanation}</p>
        </div>

        <Chip tone="caution">{summary.representativeWarning}</Chip>
      </div>
    </Wrapper>
  );
}

function PanelWrapper({ children }: { children: ReactNode }) {
  return (
    <Panel as="section" className="p-4">
      {children}
    </Panel>
  );
}

function PlainWrapper({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
