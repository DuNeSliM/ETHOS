import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import { Panel } from '@/components/primitives';
import { CONTENT_CATEGORIES } from '@/features/analytics/personalAnalytics';
import {
  CONTENT_CATEGORY_LABEL,
  REACTION_EMOJI,
  SELF_REPORT_LABEL,
  SELF_REPORT_ORDER,
} from '@/lib/labels';
import type {
  ContentCategory,
  PersonalAnalyticsSnapshot,
  SelfReportedReaction,
  SocialPlatform,
} from '@/types';

const CATEGORY_COLORS: Record<ContentCategory, string> = {
  humor: 'var(--cl-info)',
  sarcasm: 'var(--cl-assist)',
  emotional: 'var(--cl-positive)',
  polarising: 'var(--cl-alert)',
  informational: 'var(--cl-caution)',
};

const REACTION_COLORS: Record<SelfReportedReaction, string> = {
  amused: 'var(--cl-info)',
  interested: 'var(--cl-assist)',
  surprised: 'var(--cl-positive)',
  confused: 'var(--cl-caution)',
  annoyed: 'var(--cl-alert)',
  angry: 'var(--cl-chart-angry)',
  uncomfortable: 'var(--cl-chart-uncomfortable)',
  neutral: 'var(--cl-neutral)',
  other: 'var(--cl-border-strong)',
};

export function PersonalAnalyticsCharts({ snapshot }: { snapshot: PersonalAnalyticsSnapshot }) {
  return (
    <div className="mt-5 space-y-4">
      <SummaryMetrics snapshot={snapshot} />
      <LikedCategoriesChart snapshot={snapshot} />
      <EmotionLandscape snapshot={snapshot} />
      <PlatformPreference snapshot={snapshot} />
    </div>
  );
}

function SummaryMetrics({ snapshot }: { snapshot: PersonalAnalyticsSnapshot }) {
  const metrics = [
    { value: snapshot.likedPostCount, label: 'Likes oder Upvotes' },
    { value: snapshot.savedPostCount, label: 'gespeicherte Beiträge' },
    { value: snapshot.selfReportCount, label: 'aktive Reaktionsangaben' },
  ];
  return (
    <dl className="grid gap-2" aria-label="Zusammenfassung der Statistik">
      {metrics.map((metric) => (
        <div key={metric.label} className="rounded-xl border border-line bg-surface p-3 text-center">
          <dt className="text-[0.6875rem] leading-tight text-muted">{metric.label}</dt>
          <dd className="mt-1 text-xl font-bold tabular-nums text-ink">{metric.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function LikedCategoriesChart({ snapshot }: { snapshot: PersonalAnalyticsSnapshot }) {
  if (snapshot.likedPostCount === 0) {
    return (
      <Panel as="section" className="p-4" aria-labelledby="liked-categories-heading">
        <h2 id="liked-categories-heading" className="text-base font-bold text-ink">
          Welche Post-Arten werden am häufigsten geliked?
        </h2>
        <p className="mt-2 text-sm text-muted">
          Noch keine Likes oder Upvotes in dieser Quelle. Gespeicherte Beiträge
          werden separat gezählt und verändern dieses Diagramm nicht.
        </p>
      </Panel>
    );
  }

  const data = CONTENT_CATEGORIES.map((category) => ({
    category,
    name: CONTENT_CATEGORY_LABEL[category],
    value: snapshot.likesByCategory[category],
  }));
  const leading = [...data].sort((a, b) => b.value - a.value)[0];

  return (
    <Panel as="section" className="p-4" aria-labelledby="liked-categories-heading">
      <h2 id="liked-categories-heading" className="text-base font-bold text-ink">Welche Post-Arten werden am häufigsten geliked?</h2>
      <p className="mt-1 text-sm text-muted">Likes und Upvotes, nach der simulierten Inhaltskategorie des Beitrags.</p>

      <div className="relative mx-auto mt-3 h-52 w-full min-w-0" role="img" aria-label={`${leading.name} ist mit ${leading.value} Likes die häufigste Kategorie.`}>
        <ResponsiveContainer width="100%" height="100%" minWidth={240} minHeight={208}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={53} outerRadius={82} paddingAngle={2} isAnimationActive={false}>
              {data.map((entry) => <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tabular-nums text-ink">{snapshot.likedPostCount}</span>
          <span className="text-xs text-muted">insgesamt</span>
        </div>
      </div>

      <ul className="space-y-1.5" aria-label="Likes nach Inhaltskategorie">
        {data.sort((a, b) => b.value - a.value).map((entry) => (
          <li key={entry.category} className="flex items-center gap-2 text-sm">
            <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[entry.category] }} />
            <span className="min-w-0 flex-1 text-ink">{entry.name}</span>
            <span className="tabular-nums text-muted">{entry.value} · {snapshot.likedPostCount ? Math.round((entry.value / snapshot.likedPostCount) * 100) : 0} %</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function EmotionLandscape({ snapshot }: { snapshot: PersonalAnalyticsSnapshot }) {
  if (snapshot.selfReportCount === 0) {
    return (
      <Panel as="section" className="p-4" aria-labelledby="emotion-landscape-heading">
        <h2 id="emotion-landscape-heading" className="text-base font-bold text-ink">
          Emotion-Landschaft nach Post-Art
        </h2>
        <p className="mt-2 text-sm text-muted">
          Noch keine freiwillige Selbstauskunft in dieser Quelle. Automatische
          Ausdrucksschätzungen werden hier bewusst nicht als Emotion gezählt.
        </p>
      </Panel>
    );
  }

  const activeReactions = SELF_REPORT_ORDER.filter((reaction) =>
    CONTENT_CATEGORIES.some((category) => snapshot.selfReportsByCategory[category][reaction] > 0),
  );
  const rows = CONTENT_CATEGORIES.map((category) => {
    const values = snapshot.selfReportsByCategory[category];
    const total = Object.values(values).reduce((sum, value) => sum + value, 0);
    return {
      category,
      label: CONTENT_CATEGORY_LABEL[category],
      total,
      ...Object.fromEntries(SELF_REPORT_ORDER.map((reaction) => [reaction, total ? (values[reaction] / total) * 100 : 0])),
    };
  });

  return (
    <Panel as="section" className="p-4" aria-labelledby="emotion-landscape-heading">
      <h2 id="emotion-landscape-heading" className="text-base font-bold text-ink">Emotion-Landschaft nach Post-Art</h2>
      <p className="mt-1 text-sm text-muted">Ausschließlich freiwillige Selbstauskünfte – keine Kamera-Schätzungen.</p>

      <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-muted" aria-label="Legende">
        {activeReactions.map((reaction) => (
          <li key={reaction} className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="size-2.5 rounded-sm" style={{ backgroundColor: REACTION_COLORS[reaction] }} />
            <span aria-hidden="true">{REACTION_EMOJI[reaction]}</span>
            {SELF_REPORT_LABEL[reaction]}
          </li>
        ))}
      </ul>

      <div className="mt-3 h-64 min-w-0" role="img" aria-label="Gestapelte Prozentbalken der selbst angegebenen Reaktionen für jede Inhaltskategorie.">
        <ResponsiveContainer width="100%" height="100%" minWidth={240} minHeight={256}>
          <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 8, bottom: 20, left: 8 }}>
            <XAxis type="number" domain={[0, 100]} ticks={[0, 50, 100]} tickFormatter={(value) => `${value}%`} tick={{ fontSize: 11, fill: 'var(--cl-text-muted)' }} />
            <YAxis type="category" dataKey="label" width={112} tick={{ fontSize: 11, fill: 'var(--cl-text)' }} />
            {activeReactions.map((reaction) => (
              <Bar key={reaction} dataKey={reaction} stackId="reactions" fill={REACTION_COLORS[reaction]} isAnimationActive={false} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <caption className="sr-only">
            Vollständige Anzahl der selbst angegebenen Reaktionen je Inhaltskategorie
          </caption>
          <thead>
            <tr className="border-b border-line text-faint">
              <th className="py-2 pr-3 font-semibold">Post-Art</th>
              {activeReactions.map((reaction) => (
                <th key={reaction} className="whitespace-nowrap px-2 py-2 text-right font-semibold">
                  <span aria-hidden="true">{REACTION_EMOJI[reaction]} </span>
                  {SELF_REPORT_LABEL[reaction]}
                </th>
              ))}
              <th className="py-2 pl-3 text-right font-semibold">Gesamt</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.category} className="border-b border-line last:border-0">
                <th scope="row" className="whitespace-nowrap py-2 pr-3 font-medium text-ink">
                  {row.label}
                </th>
                {activeReactions.map((reaction) => {
                  const count = snapshot.selfReportsByCategory[row.category][reaction];
                  return (
                    <td key={reaction} className="whitespace-nowrap px-2 py-2 text-right tabular-nums text-muted">
                      {count}{row.total ? ` (${Math.round((count / row.total) * 100)} %)` : ''}
                    </td>
                  );
                })}
                <td className="py-2 pl-3 text-right font-semibold tabular-nums text-ink">
                  {row.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function PlatformPreference({ snapshot }: { snapshot: PersonalAnalyticsSnapshot }) {
  const platforms: Array<{ id: SocialPlatform; label: string; colour: string }> = [
    { id: 'instagram', label: 'Instagram', colour: 'var(--cl-info)' },
    { id: 'reddit', label: 'Reddit', colour: 'var(--cl-alert)' },
  ];
  const max = Math.max(1, ...platforms.map(({ id }) => snapshot.likesByPlatform[id]));
  if (snapshot.likedPostCount === 0) {
    return (
      <Panel as="section" className="p-4" aria-labelledby="platform-preference-heading">
        <h2 id="platform-preference-heading" className="text-base font-bold text-ink">
          Likes nach App
        </h2>
        <p className="mt-2 text-sm text-muted">
          Noch kein Instagram-Like oder Reddit-Upvote in dieser Quelle.
        </p>
      </Panel>
    );
  }
  return (
    <Panel as="section" className="p-4" aria-labelledby="platform-preference-heading">
      <h2 id="platform-preference-heading" className="text-base font-bold text-ink">Likes nach App</h2>
      <p className="mt-1 text-sm text-muted">Instagram-Herzen und Reddit-Upvotes bleiben als dieselbe bewusste Aktion vergleichbar.</p>
      <dl className="mt-4 space-y-3">
        {platforms.map(({ id, label, colour }) => {
          const value = snapshot.likesByPlatform[id];
          return (
            <div key={id}>
              <div className="flex items-center justify-between gap-3 text-sm"><dt className="font-semibold text-ink">{label}</dt><dd className="tabular-nums text-muted">{value} Likes</dd></div>
              <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-surface-3" role="progressbar" aria-label={`${label}: ${value} Likes`} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
                <div className="h-full rounded-full" style={{ width: `${(value / max) * 100}%`, backgroundColor: colour }} />
              </div>
            </div>
          );
        })}
      </dl>
    </Panel>
  );
}
