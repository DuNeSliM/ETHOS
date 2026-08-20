import {
  Check,
  CircleDot,
  Download,
  FlaskConical,
  Play,
  RotateCcw,
  Table,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

import { useAppState } from '@/app/AppStateProvider';
import {
  Button,
  Chip,
  FieldLabel,
  Panel,
  SimulatedBadge,
} from '@/components/primitives';
import {
  RESEARCH_QUESTION,
  RESEARCH_RATING_ORDER,
  RESEARCH_SCALE_ENDS,
} from '@/lib/labels';
import { SCENARIOS, getScenario } from '@/features/research-mode/scenarios';
import { useResearchSession } from '@/features/research-mode/useResearchSession';
import { downloadFile, timestampSlug } from '@/lib/storage';
import type { ResearchRatingKey, ResearchResult } from '@/types';

type Draft = {
  ratings: Record<ResearchRatingKey, number | null>;
  freeText: string;
};

const EMPTY_DRAFT: Draft = {
  ratings: {
    understandable: null,
    helpful: null,
    intrusive: null,
    trust: null,
  },
  freeText: '',
};

/**
 * Research Mode.
 *
 * Guides a test person through the three scripted scenarios and collects a
 * short rating after each. Results stay on the device; the export exists so a
 * moderator can collect them manually at the end of a session.
 */
export function ResearchModePage() {
  const { research, saveResearchResult, clearResearch } = useAppState();
  const { active, start, beginRating, finish } = useResearchSession();
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [status, setStatus] = useState('');

  const activeScenario = active ? getScenario(active.scenarioId) : undefined;
  const completedIds = new Set(research.map((result) => result.scenarioId));

  function submitRating() {
    if (!active || !activeScenario) return;
    const result: ResearchResult = {
      scenarioId: active.scenarioId,
      completedAt: Date.now(),
      ratings: draft.ratings,
      freeText: draft.freeText.trim(),
      durationSeconds: Math.round((Date.now() - active.startedAt) / 1000),
    };
    saveResearchResult(result);
    finish();
    setDraft(EMPTY_DRAFT);
    setStatus(`Bewertung zu „${activeScenario.title}“ wurde lokal gespeichert.`);
  }

  function exportJson() {
    downloadFile(
      `ethos-research-${timestampSlug()}.json`,
      JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          note:
            'Research-Mode-Ergebnisse aus dem ETHOS-Prototyp. Die bewerteten Analysen waren simuliert.',
          scale: RESEARCH_SCALE_ENDS,
          results: research,
        },
        null,
        2,
      ),
      'application/json',
    );
    setStatus('JSON-Export gestartet.');
  }

  function exportCsv() {
    const header = [
      'szenario',
      ...RESEARCH_RATING_ORDER,
      'freitext',
      'dauer_sekunden',
      'abgeschlossen_am',
    ];
    // Quote every field and double inner quotes: free text may contain commas,
    // semicolons, quotes or newlines.
    const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const rows = research.map((result) =>
      [
        result.scenarioId,
        ...RESEARCH_RATING_ORDER.map((key) => String(result.ratings[key] ?? '')),
        result.freeText,
        String(result.durationSeconds),
        new Date(result.completedAt).toISOString(),
      ]
        .map(escape)
        .join(','),
    );
    downloadFile(
      `ethos-research-${timestampSlug()}.csv`,
      [header.map(escape).join(','), ...rows].join('\r\n'),
      'text/csv',
    );
    setStatus('CSV-Export gestartet.');
  }

  /* ---- rating form ------------------------------------------------ */
  if (active?.phase === 'rating' && activeScenario) {
    const complete = RESEARCH_RATING_ORDER.every(
      (key) => draft.ratings[key] !== null,
    );

    return (
      <div className="mx-auto max-w-2xl">
        <Chip tone="sim" icon={<FlaskConical aria-hidden="true" className="size-3.5" />}>
          Research Mode · Bewertung
        </Chip>

        <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink">
          Kurze Bewertung
        </h1>
        <p className="mt-1.5 text-muted">{activeScenario.title}</p>
        <p className="mt-2 text-sm text-muted">
          Es gibt keine richtigen Antworten. Deine Einschätzung hilft uns zu
          verstehen, ob die Funktion so verständlich ist, wie wir hoffen.
        </p>

        <div className="mt-6 space-y-4">
          {RESEARCH_RATING_ORDER.map((key) => (
            <Panel key={key} className="p-4">
              <fieldset>
                <legend className="text-sm font-semibold text-ink">
                  {RESEARCH_QUESTION[key]}
                </legend>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {[1, 2, 3, 4, 5].map((value) => {
                    const isActive = draft.ratings[key] === value;
                    return (
                      <label
                        key={value}
                        className={`
                          flex size-11 cursor-pointer items-center justify-center
                          rounded-lg border text-sm font-bold transition-colors
                          ${
                            isActive
                              ? 'border-assist bg-assist text-assist-on'
                              : 'border-line bg-surface text-ink hover:bg-surface-2'
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name={key}
                          value={value}
                          checked={isActive}
                          onChange={() =>
                            setDraft((current) => ({
                              ...current,
                              ratings: { ...current.ratings, [key]: value },
                            }))
                          }
                          className="sr-only"
                        />
                        {value}
                      </label>
                    );
                  })}
                </div>
                <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-faint">
                  <span>{RESEARCH_SCALE_ENDS[key].low}</span>
                  <span>{RESEARCH_SCALE_ENDS[key].high}</span>
                </div>
              </fieldset>
            </Panel>
          ))}

          <Panel className="p-4">
            <label
              htmlFor="research-freetext"
              className="block text-sm font-semibold text-ink"
            >
              Möchtest du etwas ergänzen? (optional)
            </label>
            <textarea
              id="research-freetext"
              rows={4}
              value={draft.freeText}
              onChange={(event) =>
                setDraft((current) => ({ ...current, freeText: event.target.value }))
              }
              placeholder="Was war klar, was war unklar, was hat gestört?"
              className="
                mt-2 w-full rounded-lg border border-line bg-surface px-3 py-2
                text-sm text-ink
              "
            />
          </Panel>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button variant="assist" size="lg" onClick={submitRating} disabled={!complete}>
            <Check aria-hidden="true" className="size-4" />
            Bewertung speichern
          </Button>
          <Button
            onClick={() => {
              finish();
              setDraft(EMPTY_DRAFT);
              setStatus('Szenario abgebrochen. Es wurde nichts gespeichert.');
            }}
          >
            Abbrechen
          </Button>
        </div>
        {!complete ? (
          <p className="mt-2 text-sm text-muted">
            Bitte beantworte alle vier Fragen, um zu speichern.
          </p>
        ) : null}
      </div>
    );
  }

  /* ---- working on a scenario -------------------------------------- */
  if (active?.phase === 'working' && activeScenario) {
    return (
      <div className="mx-auto max-w-2xl">
        <Chip tone="sim" icon={<FlaskConical aria-hidden="true" className="size-3.5" />}>
          Research Mode · Aufgabe läuft
        </Chip>

        <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink">
          {activeScenario.title}
        </h1>

        <Panel variant="assist" className="mt-4 p-4">
          <FieldLabel>Worum es geht</FieldLabel>
          <p className="mt-1.5 text-sm text-ink">{activeScenario.goal}</p>
        </Panel>

        <section className="mt-5">
          <h2 className="text-base font-bold text-ink">Deine Aufgabe</h2>
          <ol className="mt-2 space-y-2">
            {activeScenario.steps.map((step, index) => (
              <li key={step} className="flex gap-3 text-sm text-ink">
                <span
                  aria-hidden="true"
                  className="
                    flex size-6 shrink-0 items-center justify-center rounded-full
                    bg-surface-3 text-xs font-bold text-muted
                  "
                >
                  {index + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to={activeScenario.startPath}>
            <Button variant="assist" size="lg">
              <Play aria-hidden="true" className="size-4" />
              {activeScenario.startLabel}
            </Button>
          </Link>
          <Button size="lg" onClick={beginRating}>
            Aufgabe erledigt – jetzt bewerten
          </Button>
        </div>

        <p className="mt-3 text-sm text-faint">
          Du kannst dich frei in der App bewegen. Über den Hinweis am oberen Rand
          kommst du jederzeit zu dieser Aufgabe zurück.
        </p>
      </div>
    );
  }

  /* ---- overview --------------------------------------------------- */
  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-ink">Research Mode</h1>
        <SimulatedBadge label="Nutzertest" />
      </div>
      <p className="mt-2 text-muted">
        Drei kurze Aufgaben mit je einer Bewertung danach. Die Ergebnisse werden
        ausschließlich lokal in diesem Browser gespeichert.
      </p>

      <p role="status" className="mt-3 min-h-5 text-sm font-medium text-assist-strong">
        {status}
      </p>

      <ul className="mt-4 space-y-3">
        {SCENARIOS.map((scenario) => {
          const done = completedIds.has(scenario.id);
          const result = research.find((r) => r.scenarioId === scenario.id);
          return (
            <li key={scenario.id}>
              <Panel className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-bold text-ink">
                        {scenario.title}
                      </h2>
                      <Chip
                        tone={done ? 'positive' : 'neutral'}
                        icon={
                          done ? (
                            <Check aria-hidden="true" className="size-3.5" />
                          ) : (
                            <CircleDot aria-hidden="true" className="size-3.5" />
                          )
                        }
                      >
                        {done ? 'abgeschlossen' : 'offen'}
                      </Chip>
                    </div>
                    <p className="mt-1.5 text-sm text-muted">{scenario.goal}</p>
                    {result ? (
                      <p className="mt-2 text-xs text-faint">
                        Bewertet am{' '}
                        {new Date(result.completedAt).toLocaleString('de-DE', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}{' '}
                        · Dauer {result.durationSeconds} s
                      </p>
                    ) : null}
                  </div>

                  <Button
                    variant={done ? 'secondary' : 'assist'}
                    onClick={() => start(scenario.id)}
                  >
                    <Play aria-hidden="true" className="size-4" />
                    {done ? 'Wiederholen' : 'Starten'}
                  </Button>
                </div>
              </Panel>
            </li>
          );
        })}
      </ul>

      {/* ---- results and export ------------------------------------ */}
      <section className="mt-8" aria-labelledby="results-heading">
        <h2
          id="results-heading"
          className="text-lg font-bold tracking-tight text-ink"
        >
          Ergebnisse ({research.length} von {SCENARIOS.length})
        </h2>

        {research.length === 0 ? (
          <p className="mt-2 text-sm text-muted">
            Noch keine Bewertungen gespeichert.
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-sm">
              <caption className="sr-only">
                Gespeicherte Bewertungen je Szenario, Skala 1 bis 5
              </caption>
              <thead>
                <tr className="border-b border-line text-left">
                  <th scope="col" className="py-2 pr-3 font-semibold text-muted">
                    Szenario
                  </th>
                  {RESEARCH_RATING_ORDER.map((key) => (
                    <th
                      key={key}
                      scope="col"
                      className="py-2 pr-3 font-semibold text-muted"
                    >
                      {
                        // Short column heads; the full question is in the form.
                        {
                          understandable: 'verständlich',
                          helpful: 'hilfreich',
                          intrusive: 'störend',
                          trust: 'Vertrauen',
                        }[key]
                      }
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {research.map((result) => (
                  <tr key={result.scenarioId} className="border-b border-line">
                    <th scope="row" className="py-2 pr-3 text-left font-medium text-ink">
                      {result.scenarioId}
                    </th>
                    {RESEARCH_RATING_ORDER.map((key) => (
                      <td key={key} className="py-2 pr-3 tabular-nums text-ink">
                        {result.ratings[key] ?? '–'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2.5">
          <Button variant="assist" onClick={exportJson} disabled={research.length === 0}>
            <Download aria-hidden="true" className="size-4" />
            Als JSON exportieren
          </Button>
          <Button onClick={exportCsv} disabled={research.length === 0}>
            <Table aria-hidden="true" className="size-4" />
            Als CSV exportieren
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              clearResearch();
              setStatus('Alle Research-Mode-Ergebnisse wurden gelöscht.');
            }}
            disabled={research.length === 0}
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            Ergebnisse löschen
          </Button>
        </div>
      </section>
    </div>
  );
}
