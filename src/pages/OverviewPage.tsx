import { Info, ScanFace, Trash2, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';

import { useAppState } from '@/app/AppStateProvider';
import {
  Button,
  Chip,
  DefinitionRow,
  FieldLabel,
  Panel,
  SimulatedBadge,
} from '@/components/primitives';
import { getPost } from '@/data/posts';
import {
  COMPARISON_LABEL,
  compareEstimateWithSelfReport,
  type ComparisonVerdict,
} from '@/features/analytics/comparison';
import {
  CONTENT_CATEGORY_LABEL,
  EXPRESSION_LABEL,
  SELF_REPORT_LABEL,
} from '@/lib/labels';
import type { ContentCategory } from '@/types';

/**
 * Personal overview.
 *
 * Reports counts and nothing else. There are deliberately no interpretations of
 * the participant as a person here - no "you react negatively a lot", no mood
 * scores, no trends over time. The brief rules those out, and they would also
 * be indefensible given that every input is a scripted guess.
 */
export function OverviewPage() {
  const { history, reactions, deleteHistoryEntry, deleteAllData, settings } =
    useAppState();
  const [confirmingDeleteAll, setConfirmingDeleteAll] = useState(false);

  const sorted = useMemo(
    () => [...history].sort((a, b) => b.viewedAt - a.viewedAt),
    [history],
  );

  const categoryCounts = useMemo(() => {
    const counts = new Map<ContentCategory, number>();
    history.forEach((entry) => {
      counts.set(entry.contentCategory, (counts.get(entry.contentCategory) ?? 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [history]);

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

  const selfReportCount = Object.values(reactions).filter(
    (reaction) => reaction.selfReportedReaction,
  ).length;
  const comparableTotal = comparison.aligned + comparison.diverged;

  if (history.length === 0) {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          Persönliche Übersicht
        </h1>
        <Panel variant="muted" className="mt-5 p-5">
          <h2 className="text-base font-semibold text-ink">
            Noch keine Einträge
          </h2>
          <p className="mt-1.5 text-sm text-muted">
            Sobald du Beiträge im Feed ansiehst, erscheinen sie hier. Alles bleibt
            lokal in diesem Browser.
          </p>
          <Link to="/feed/visual" className="mt-4 inline-block">
            <Button variant="assist">Zum Feed</Button>
          </Link>
        </Panel>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          Persönliche Übersicht
        </h1>
        <SimulatedBadge label="Schätzungen sind simuliert" />
      </div>
      <p className="mt-2 text-muted">
        Eine Zusammenfassung dessen, was in diesem Browser gespeichert ist. Hier
        stehen nur Zählungen – keine Bewertung deiner Person.
      </p>

      {!settings.storeReactionHistory ? (
        <Chip tone="caution" className="mt-3">
          Speicherung ist ausgeschaltet. Diese Liste verschwindet beim Neuladen.
        </Chip>
      ) : null}

      {/* ---- counters ----------------------------------------------- */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Panel className="p-3.5">
          <p className="text-2xl font-bold tabular-nums text-ink">
            {history.length}
          </p>
          <p className="mt-0.5 text-sm text-muted">
            {history.length === 1 ? 'Beitrag' : 'Beiträge'} angesehen
          </p>
        </Panel>
        <Panel className="p-3.5">
          <p className="text-2xl font-bold tabular-nums text-ink">
            {selfReportCount}
          </p>
          <p className="mt-0.5 text-sm text-muted">
            eigene Angaben gemacht
          </p>
        </Panel>
        <Panel className="p-3.5">
          <p className="text-2xl font-bold tabular-nums text-ink">
            {history.filter((entry) => entry.openedAssistant).length}
          </p>
          <p className="mt-0.5 text-sm text-muted">
            Mal „Kontext erklären“ geöffnet
          </p>
        </Panel>
      </div>

      {/* ---- estimate vs. self report -------------------------------- */}
      <Panel as="section" className="mt-6 p-4">
        <h2 className="text-base font-bold text-ink">
          Automatische Schätzung und deine eigene Angabe
        </h2>

        {comparableTotal === 0 ? (
          <p className="mt-2 text-sm text-muted">
            Es gibt noch keinen Vergleich. Sobald du bei einem Beitrag deine
            eigene Reaktion angibst und dafür auch eine Schätzung vorlag, steht
            hier, wie oft beides in dieselbe Richtung zeigte.
          </p>
        ) : (
          <>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              <DefinitionRow term={COMPARISON_LABEL.aligned} tone="assist">
                {comparison.aligned} von {comparableTotal}
              </DefinitionRow>
              <DefinitionRow term={COMPARISON_LABEL.diverged} tone="self">
                {comparison.diverged} von {comparableTotal}
              </DefinitionRow>
            </dl>
            {comparison['not-comparable'] > 0 ? (
              <p className="mt-2 text-sm text-faint">
                {comparison['not-comparable']} Angabe(n) waren nicht vergleichbar
                (unklare Schätzung oder „andere Reaktion“).
              </p>
            ) : null}
          </>
        )}

        <p className="mt-3 flex gap-2 text-sm text-muted">
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>
            Eine Abweichung bedeutet nicht, dass du oder die Schätzung „falsch“
            wart. Derselbe Gesichtsausdruck kann zu sehr unterschiedlichen
            Empfindungen gehören. Deine Angabe gilt immer.
          </span>
        </p>
      </Panel>

      {/* ---- categories --------------------------------------------- */}
      <Panel as="section" className="mt-6 p-4">
        <h2 className="text-base font-bold text-ink">
          Häufige Inhaltskategorien
        </h2>
        <p className="mt-1 text-sm text-muted">
          Wie die angesehenen Beiträge von der simulierten Analyse einsortiert
          wurden.
        </p>
        <ul className="mt-3 space-y-2">
          {categoryCounts.map(([category, count]) => (
            <li key={category}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-ink">
                  {CONTENT_CATEGORY_LABEL[category]}
                </span>
                <span className="tabular-nums text-muted">
                  {count} {count === 1 ? 'Beitrag' : 'Beiträge'}
                </span>
              </div>
              <div
                aria-hidden="true"
                className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-3"
              >
                <div
                  className="h-full rounded-full bg-assist"
                  style={{ width: `${(count / history.length) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      {/* ---- entries ------------------------------------------------ */}
      <section className="mt-6" aria-labelledby="entries-heading">
        <h2
          id="entries-heading"
          className="text-base font-bold tracking-tight text-ink"
        >
          Zuletzt betrachtete Beiträge
        </h2>

        <ul className="mt-3 space-y-2.5">
          {sorted.map((entry) => {
            const post = getPost(entry.postId);
            const reaction = reactions[entry.postId];
            return (
              <li key={entry.id}>
                <Panel className="p-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">
                        {post?.title ?? post?.body ?? entry.postId}
                      </p>
                      <p className="mt-0.5 text-xs text-faint">
                        {post ? `${post.author} · ` : ''}
                        {new Date(entry.viewedAt).toLocaleString('de-DE', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                        {' · '}
                        {CONTENT_CATEGORY_LABEL[entry.contentCategory]}
                      </p>
                    </div>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteHistoryEntry(entry.id)}
                      aria-label={`Eintrag zu „${
                        post?.title ?? post?.author ?? entry.postId
                      }“ löschen`}
                    >
                      <Trash2 aria-hidden="true" className="size-4" />
                      Löschen
                    </Button>
                  </div>

                  {reaction ? (
                    <dl className="mt-3 grid gap-2.5 border-t border-line pt-3 sm:grid-cols-2">
                      <DefinitionRow
                        term="Automatisch geschätzter Ausdruck"
                        tone="assist"
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <ScanFace aria-hidden="true" className="size-3.5" />
                          {EXPRESSION_LABEL[reaction.estimatedExpression]}
                        </span>
                      </DefinitionRow>
                      <DefinitionRow term="Von dir angegebene Reaktion" tone="self">
                        {reaction.selfReportedReaction ? (
                          <span className="inline-flex items-center gap-1.5 text-info">
                            <UserCheck aria-hidden="true" className="size-3.5" />
                            {SELF_REPORT_LABEL[reaction.selfReportedReaction]}
                            {reaction.selfReportedNote
                              ? ` – „${reaction.selfReportedNote}“`
                              : ''}
                          </span>
                        ) : (
                          <span className="font-normal text-faint">
                            keine Angabe
                          </span>
                        )}
                      </DefinitionRow>
                    </dl>
                  ) : null}
                </Panel>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ---- delete all --------------------------------------------- */}
      <Panel variant="muted" as="section" className="mt-8 p-4">
        <FieldLabel>Daten löschen</FieldLabel>
        {confirmingDeleteAll ? (
          <>
            <p className="mt-2 text-sm text-ink">
              Wirklich alle lokal gespeicherten Einträge, Reaktionen und
              Testergebnisse löschen? Das lässt sich nicht rückgängig machen.
              Deine Einstellungen bleiben erhalten.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                variant="danger"
                onClick={() => {
                  deleteAllData();
                  setConfirmingDeleteAll(false);
                }}
              >
                <Trash2 aria-hidden="true" className="size-4" />
                Ja, alles löschen
              </Button>
              <Button onClick={() => setConfirmingDeleteAll(false)}>
                Abbrechen
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-muted">
              Löscht den Verlauf, deine Angaben und die Research-Mode-Ergebnisse
              aus diesem Browser.
            </p>
            <Button
              variant="danger"
              className="mt-3"
              onClick={() => setConfirmingDeleteAll(true)}
            >
              <Trash2 aria-hidden="true" className="size-4" />
              Alle Daten löschen
            </Button>
          </>
        )}
      </Panel>
    </div>
  );
}
