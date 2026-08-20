import { Info, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAppState } from '@/app/AppStateProvider';
import { Button, Chip, Panel, SimulatedBadge } from '@/components/primitives';
import { DEMO_PROFILE } from '@/data/demoProfile';
import { getPost } from '@/data/posts';
import { PersonalAnalyticsCharts } from '@/features/analytics/PersonalAnalyticsCharts';
import {
  COMPARISON_LABEL,
  compareEstimateWithSelfReport,
  type ComparisonVerdict,
} from '@/features/analytics/comparison';
import { buildSessionAnalytics } from '@/features/analytics/personalAnalytics';
import { CONTENT_CATEGORY_LABEL, SELF_REPORT_LABEL } from '@/lib/labels';
import type { AnalyticsSource } from '@/types';

export function OverviewPage() {
  const {
    deleteAllData,
    deleteHistoryEntry,
    engagements,
    history,
    reactions,
    settings,
  } = useAppState();
  const [source, setSource] = useState<AnalyticsSource>('demo-profile');
  const [confirmingDeleteAll, setConfirmingDeleteAll] = useState(false);

  const sessionSnapshot = useMemo(
    () => buildSessionAnalytics(engagements, reactions),
    [engagements, reactions],
  );
  const snapshot = source === 'demo-profile' ? DEMO_PROFILE : sessionSnapshot;
  const sessionEmpty =
    sessionSnapshot.likedPostCount === 0 &&
    sessionSnapshot.savedPostCount === 0 &&
    sessionSnapshot.selfReportCount === 0;

  const comparison = useMemo(() => {
    const tally: Record<ComparisonVerdict, number> = {
      aligned: 0,
      diverged: 0,
      'not-comparable': 0,
    };
    Object.values(reactions).forEach((reaction) => {
      if (!reaction.selfReportedReaction) return;
      tally[
        compareEstimateWithSelfReport(
          reaction.estimatedExpression,
          reaction.selfReportedReaction,
        )
      ] += 1;
    });
    return tally;
  }, [reactions]);

  const comparableTotal = comparison.aligned + comparison.diverged;
  const sortedHistory = useMemo(
    () => [...history].sort((a, b) => b.viewedAt - a.viewedAt),
    [history],
  );

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-ink">ETHOS-Statistiken</h1>
        <SimulatedBadge label="alle Auswertungen sind simuliert" />
      </div>
      <p className="mt-2 text-muted">
        Sieh, welche Arten von Beiträgen geliked wurden und welche Reaktionen
        aktiv angegeben wurden. ETHOS bewertet daraus keine Persönlichkeit.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl border border-line bg-surface-2 p-1" role="group" aria-label="Datenquelle der Statistik">
        <button
          type="button"
          onClick={() => setSource('demo-profile')}
          aria-pressed={source === 'demo-profile'}
          className={`rounded-lg px-3 py-2 text-sm font-semibold ${source === 'demo-profile' ? 'bg-surface text-assist-strong panel-shadow' : 'text-muted hover:text-ink'}`}
        >
          Simuliertes Profil
        </button>
        <button
          type="button"
          onClick={() => setSource('current-session')}
          aria-pressed={source === 'current-session'}
          className={`rounded-lg px-3 py-2 text-sm font-semibold ${source === 'current-session' ? 'bg-surface text-assist-strong panel-shadow' : 'text-muted hover:text-ink'}`}
        >
          Diese Sitzung
        </button>
      </div>

      {source === 'demo-profile' ? (
        <Chip tone="caution" className="mt-3">
          Fiktives Langzeitprofil mit vorbereiteten Zahlen. Es beschreibt nicht dich und wird nie mit deiner Sitzung vermischt.
        </Chip>
      ) : (
        <Chip tone={settings.storeReactionHistory ? 'assist' : 'caution'} className="mt-3">
          {settings.storeReactionHistory
            ? 'Nur bewusste Aktionen aus diesem Browser; lokal gespeichert.'
            : 'Speicherung ist aus. Diese Sitzungsdaten verschwinden beim Neuladen.'}
        </Chip>
      )}

      {source === 'current-session' && sessionEmpty ? (
        <Panel variant="muted" className="mt-5 p-5">
          <h2 className="text-base font-semibold text-ink">Noch keine Sitzungsstatistik</h2>
          <p className="mt-1.5 text-sm text-muted">
            Like oder speichere einen Beitrag in Instagram, gib einem Reddit-Beitrag ein Upvote oder trage deine Reaktion aktiv ein.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/instagram"><Button variant="assist">Instagram öffnen</Button></Link>
            <Link to="/reddit"><Button>Reddit öffnen</Button></Link>
          </div>
        </Panel>
      ) : (
        <PersonalAnalyticsCharts snapshot={snapshot} />
      )}

      {source === 'current-session' && comparableTotal > 0 ? (
        <Panel as="section" className="mt-5 p-4">
          <h2 className="text-base font-bold text-ink">Automatische Schätzung und deine Angabe</h2>
          <dl className="mt-3 grid gap-2">
            <div className="rounded-lg bg-assist-tint p-3"><dt className="text-xs font-semibold text-assist-strong">{COMPARISON_LABEL.aligned}</dt><dd className="mt-1 text-xl font-bold tabular-nums text-ink">{comparison.aligned} von {comparableTotal}</dd></div>
            <div className="rounded-lg bg-info-tint p-3"><dt className="text-xs font-semibold text-info">{COMPARISON_LABEL.diverged}</dt><dd className="mt-1 text-xl font-bold tabular-nums text-ink">{comparison.diverged} von {comparableTotal}</dd></div>
          </dl>
          <p className="mt-3 flex gap-2 text-sm text-muted"><Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" /><span>Eine Kamera-Schätzung ist keine Aussage über dein Gefühl. Deine aktive Angabe bleibt separat und hat Vorrang.</span></p>
        </Panel>
      ) : null}

      {source === 'current-session' && sortedHistory.length > 0 ? (
        <section className="mt-7" aria-labelledby="history-heading">
          <h2 id="history-heading" className="text-base font-bold text-ink">Zuletzt betrachtete Beiträge</h2>
          <ul className="mt-3 space-y-2">
            {sortedHistory.map((entry) => {
              const post = getPost(entry.postId);
              const selfReport = reactions[entry.postId]?.selfReportedReaction;
              return (
                <li key={entry.id}>
                  <Panel className="p-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link to={post ? `/${post.platform}/post/${post.id}` : '#'} className="block truncate text-sm font-semibold text-ink hover:underline">
                          {post?.title ?? post?.body ?? entry.postId}
                        </Link>
                        <p className="mt-0.5 text-xs text-faint">{post?.platform === 'reddit' ? 'Reddit' : 'Instagram'} · {CONTENT_CATEGORY_LABEL[entry.contentCategory]}{selfReport ? ` · deine Angabe: ${SELF_REPORT_LABEL[selfReport]}` : ''}</p>
                      </div>
                      <Button variant="danger" size="sm" onClick={() => deleteHistoryEntry(entry.id)} aria-label={`Verlaufseintrag zu ${post?.title ?? post?.author ?? entry.postId} löschen`}>
                        <Trash2 aria-hidden="true" className="size-4" />
                        Löschen
                      </Button>
                    </div>
                  </Panel>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <Panel variant="muted" as="section" className="mt-8 p-4">
        <h2 className="text-sm font-bold text-ink">Lokale Sitzungsdaten löschen</h2>
        {confirmingDeleteAll ? (
          <div className="mt-2">
            <p className="text-sm text-muted">Verlauf, Reaktionen, Likes, Upvotes, gespeicherte Beiträge und Research-Ergebnisse löschen? Einstellungen bleiben erhalten.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="danger" onClick={() => { deleteAllData(); setConfirmingDeleteAll(false); }}><Trash2 aria-hidden="true" className="size-4" />Ja, alles löschen</Button>
              <Button onClick={() => setConfirmingDeleteAll(false)}>Abbrechen</Button>
            </div>
          </div>
        ) : (
          <Button variant="danger" className="mt-3" onClick={() => setConfirmingDeleteAll(true)}><Trash2 aria-hidden="true" className="size-4" />Alle Sitzungsdaten löschen</Button>
        )}
      </Panel>
    </div>
  );
}
