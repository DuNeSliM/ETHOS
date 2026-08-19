import { useCallback, useEffect, useState } from 'react';

import { STORAGE_KEYS, readJson, removeKey, writeJson } from '@/lib/storage';
import type { ResearchScenarioId } from '@/types';

type ActiveScenario = {
  scenarioId: ResearchScenarioId;
  startedAt: number;
  /** `working` = out in the app doing the task, `rating` = filling the form. */
  phase: 'working' | 'rating';
};

/** Custom event name used to keep several mounted hooks in sync. */
const SYNC_EVENT = 'contextlens:research-session';

/**
 * Tracks which scenario a participant is currently working on.
 *
 * Persisted rather than held in component state because the whole point of a
 * scenario is that the participant leaves this page and wanders through the app.
 * The banner in the app shell and the research page both read this hook, so a
 * custom event keeps the two instances in step within one tab.
 */
export function useResearchSession() {
  const [active, setActive] = useState<ActiveScenario | null>(() =>
    readJson<ActiveScenario | null>(STORAGE_KEYS.activeScenario, null),
  );

  // Re-read on our own event (same tab) and on `storage` (other tabs).
  useEffect(() => {
    function sync() {
      setActive(readJson<ActiveScenario | null>(STORAGE_KEYS.activeScenario, null));
    }
    window.addEventListener(SYNC_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(SYNC_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const publish = useCallback((next: ActiveScenario | null) => {
    if (next) {
      writeJson(STORAGE_KEYS.activeScenario, next);
    } else {
      removeKey(STORAGE_KEYS.activeScenario);
    }
    setActive(next);
    window.dispatchEvent(new Event(SYNC_EVENT));
  }, []);

  const start = useCallback(
    (scenarioId: ResearchScenarioId) => {
      publish({ scenarioId, startedAt: Date.now(), phase: 'working' });
    },
    [publish],
  );

  const beginRating = useCallback(() => {
    setActive((current) => {
      if (!current) return current;
      const next: ActiveScenario = { ...current, phase: 'rating' };
      writeJson(STORAGE_KEYS.activeScenario, next);
      window.dispatchEvent(new Event(SYNC_EVENT));
      return next;
    });
  }, []);

  const finish = useCallback(() => publish(null), [publish]);

  return { active, start, beginRating, finish };
}
