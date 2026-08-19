import { FlaskConical } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { getScenario } from '@/features/research-mode/scenarios';
import { useResearchSession } from '@/features/research-mode/useResearchSession';

/**
 * Thin banner shown while a research scenario is in progress.
 *
 * A scenario sends the participant off into the feed and settings, so without
 * this strip they would have no way back to the task and the rating form. Hidden
 * on the research page itself, where the task is already on screen.
 */
export function ResearchBanner() {
  const { active } = useResearchSession();
  const location = useLocation();

  if (!active || location.pathname === '/research') return null;

  const scenario = getScenario(active.scenarioId);
  if (!scenario) return null;

  return (
    <div className="border-t border-sim-line bg-sim-tint">
      <div className="mx-auto flex max-w-[34rem] flex-wrap items-center gap-x-3 gap-y-1 px-3 py-1.5">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sim">
          <FlaskConical aria-hidden="true" className="size-3.5" />
          Research Mode: Aufgabe läuft
        </span>
        <span className="min-w-0 truncate text-xs text-muted">
          {scenario.title}
        </span>
        <Link
          to="/research"
          className="
            ml-auto rounded-md px-2 py-1 text-xs font-semibold text-sim underline
            decoration-sim-line underline-offset-2 hover:bg-surface
          "
        >
          Aufgabe anzeigen
        </Link>
      </div>
    </div>
  );
}
