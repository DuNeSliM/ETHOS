import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { getAnalysis } from '@/data/analyses';
import { deriveContentCategory } from '@/features/simulation/mockEngine';
import {
  STORAGE_KEYS,
  clearAll,
  readJson,
  removeKey,
  writeJson,
} from '@/lib/storage';
import type {
  AssistantFeedback,
  EstimatedExpression,
  HistoryEntry,
  ResearchResult,
  SelfReportedReaction,
  Settings,
  ViewerReaction,
} from '@/types';

/**
 * Single source of truth for everything the prototype remembers.
 *
 * Deliberately one small context rather than a state library: the data set is
 * tiny, and having one file that owns every write makes the privacy claims
 * auditable - if it is not written here, it is not stored.
 */

/**
 * Consent defaults.
 *
 * Anything that touches the participant's own reaction, the camera, or sharing
 * starts as `false`. Content analysis starts on because the app is useless as
 * a demo without it, and the onboarding says so before the feed opens.
 */
export const DEFAULT_SETTINGS: Settings = {
  contentAnalysis: true,
  sarcasmHints: true,
  ragebaitHints: true,
  simulatedCameraCapture: false,
  liveCameraPreview: false,
  shareAnonymousReaction: false,
  showCommunityReactions: true,
  storeReactionHistory: true,
  hintVisibility: 'on-demand',
  theme: 'system',
  assistantPaused: false,
};

type AppStateValue = {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  resetSettings: () => void;

  reactions: Record<string, ViewerReaction>;
  /** Records the scripted machine estimate for a post. */
  recordEstimate: (
    postId: string,
    expression: EstimatedExpression,
    confidence: number,
  ) => void;
  /** Records what the participant says about themselves. Overrides nothing. */
  recordSelfReport: (
    postId: string,
    reaction: SelfReportedReaction,
    note?: string,
  ) => void;
  clearSelfReport: (postId: string) => void;

  history: HistoryEntry[];
  recordView: (postId: string, openedAssistant: boolean) => void;
  deleteHistoryEntry: (entryId: string) => void;

  research: ResearchResult[];
  saveResearchResult: (result: ResearchResult) => void;
  clearResearch: () => void;

  feedback: AssistantFeedback[];
  recordFeedback: (entry: AssistantFeedback) => void;

  onboardingDone: boolean;
  setOnboardingDone: (done: boolean) => void;

  /** Wipes stored data but keeps consent settings. */
  deleteAllData: () => void;
  /** Full factory reset, including consent settings. */
  resetDemo: () => void;
};

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => ({
    // Spread over defaults so a stored object from an older build that is
    // missing a key cannot leave that key `undefined`.
    ...DEFAULT_SETTINGS,
    ...readJson<Partial<Settings>>(STORAGE_KEYS.settings, {}),
  }));
  const [reactions, setReactions] = useState<Record<string, ViewerReaction>>(
    () => readJson(STORAGE_KEYS.reactions, {}),
  );
  const [history, setHistory] = useState<HistoryEntry[]>(() =>
    readJson(STORAGE_KEYS.history, []),
  );
  const [research, setResearch] = useState<ResearchResult[]>(() =>
    readJson(STORAGE_KEYS.research, []),
  );
  const [feedback, setFeedback] = useState<AssistantFeedback[]>(() =>
    readJson(STORAGE_KEYS.feedback, []),
  );
  const [onboardingDone, setOnboardingDoneState] = useState<boolean>(() =>
    readJson(STORAGE_KEYS.onboardingDone, false),
  );

  /* ---- persistence ------------------------------------------------ */

  useEffect(() => {
    writeJson(STORAGE_KEYS.settings, settings);
  }, [settings]);

  useEffect(() => {
    // Honour the "do not store my reaction history" switch by actively
    // removing what is already there, not just stopping new writes.
    if (settings.storeReactionHistory) {
      writeJson(STORAGE_KEYS.history, history);
      writeJson(STORAGE_KEYS.reactions, reactions);
    } else {
      removeKey(STORAGE_KEYS.history);
      removeKey(STORAGE_KEYS.reactions);
    }
  }, [history, reactions, settings.storeReactionHistory]);

  useEffect(() => {
    writeJson(STORAGE_KEYS.research, research);
  }, [research]);

  useEffect(() => {
    writeJson(STORAGE_KEYS.feedback, feedback);
  }, [feedback]);

  useEffect(() => {
    writeJson(STORAGE_KEYS.onboardingDone, onboardingDone);
  }, [onboardingDone]);

  /* ---- theme ------------------------------------------------------ */

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', settings.theme);
    }
  }, [settings.theme]);

  /* ---- actions ---------------------------------------------------- */

  const updateSetting = useCallback(
    <K extends keyof Settings>(key: K, value: Settings[K]) => {
      setSettings((previous) => {
        const next = { ...previous, [key]: value };

        // Switching off the simulated capture must also switch off the live
        // camera preview - a preview without capture consent would be
        // misleading about what is active.
        if (key === 'simulatedCameraCapture' && value === false) {
          next.liveCameraPreview = false;
        }
        // Sharing your reaction is meaningless without capturing one.
        if (key === 'simulatedCameraCapture' && value === false) {
          next.shareAnonymousReaction = false;
        }
        return next;
      });
    },
    [],
  );

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const recordEstimate = useCallback(
    (postId: string, expression: EstimatedExpression, confidence: number) => {
      setReactions((previous) => {
        const existing = previous[postId];
        // Never overwrite an existing estimate for the same post: the
        // participant may already have corrected it, and a re-render must not
        // silently reset that.
        if (existing) return previous;
        return {
          ...previous,
          [postId]: {
            postId,
            timestamp: Date.now(),
            estimatedExpression: expression,
            confidence,
          },
        };
      });
    },
    [],
  );

  const recordSelfReport = useCallback(
    (postId: string, reaction: SelfReportedReaction, note?: string) => {
      setReactions((previous) => {
        const existing = previous[postId];
        return {
          ...previous,
          [postId]: {
            postId,
            timestamp: existing?.timestamp ?? Date.now(),
            // Keep the estimate on record next to the correction. The two are
            // shown side by side, so we must not discard the original guess.
            estimatedExpression: existing?.estimatedExpression ?? 'unclear',
            confidence: existing?.confidence ?? 0,
            selfReportedReaction: reaction,
            selfReportedNote: note,
          },
        };
      });

      setHistory((previous) =>
        previous.map((entry) =>
          entry.postId === postId
            ? { ...entry, selfReportedReaction: reaction, selfReportedNote: note }
            : entry,
        ),
      );
    },
    [],
  );

  const clearSelfReport = useCallback((postId: string) => {
    setReactions((previous) => {
      const existing = previous[postId];
      if (!existing) return previous;
      const { selfReportedReaction: _r, selfReportedNote: _n, ...rest } = existing;
      return { ...previous, [postId]: rest };
    });
    setHistory((previous) =>
      previous.map((entry) =>
        entry.postId === postId
          ? {
              ...entry,
              selfReportedReaction: undefined,
              selfReportedNote: undefined,
            }
          : entry,
      ),
    );
  }, []);

  const recordView = useCallback((postId: string, openedAssistant: boolean) => {
    setHistory((previous) => {
      const category = deriveContentCategory(getAnalysis(postId));
      const existingIndex = previous.findIndex((e) => e.postId === postId);

      if (existingIndex >= 0) {
        const next = [...previous];
        const existing = next[existingIndex];
        next[existingIndex] = {
          ...existing,
          viewedAt: Date.now(),
          openedAssistant: existing.openedAssistant || openedAssistant,
        };
        return next;
      }

      return [
        {
          id: `${postId}-${Date.now()}`,
          postId,
          viewedAt: Date.now(),
          contentCategory: category,
          openedAssistant,
        },
        ...previous,
      ];
    });
  }, []);

  const deleteHistoryEntry = useCallback((entryId: string) => {
    setHistory((previous) => {
      const entry = previous.find((e) => e.id === entryId);
      if (entry) {
        // Deleting a history row must also drop the reaction attached to it,
        // otherwise "delete this entry" would leave data behind.
        setReactions((prevReactions) => {
          const { [entry.postId]: _removed, ...rest } = prevReactions;
          return rest;
        });
      }
      return previous.filter((e) => e.id !== entryId);
    });
  }, []);

  const saveResearchResult = useCallback((result: ResearchResult) => {
    setResearch((previous) => [
      ...previous.filter((r) => r.scenarioId !== result.scenarioId),
      result,
    ]);
  }, []);

  const clearResearch = useCallback(() => setResearch([]), []);

  const recordFeedback = useCallback((entry: AssistantFeedback) => {
    setFeedback((previous) => [entry, ...previous]);
  }, []);

  const setOnboardingDone = useCallback((done: boolean) => {
    setOnboardingDoneState(done);
  }, []);

  const deleteAllData = useCallback(() => {
    setHistory([]);
    setReactions({});
    setResearch([]);
    setFeedback([]);
    removeKey(STORAGE_KEYS.history);
    removeKey(STORAGE_KEYS.reactions);
    removeKey(STORAGE_KEYS.research);
    removeKey(STORAGE_KEYS.feedback);
  }, []);

  const resetDemo = useCallback(() => {
    clearAll();
    setHistory([]);
    setReactions({});
    setResearch([]);
    setFeedback([]);
    setSettings(DEFAULT_SETTINGS);
    setOnboardingDoneState(false);
  }, []);

  const value = useMemo<AppStateValue>(
    () => ({
      settings,
      updateSetting,
      resetSettings,
      reactions,
      recordEstimate,
      recordSelfReport,
      clearSelfReport,
      history,
      recordView,
      deleteHistoryEntry,
      research,
      saveResearchResult,
      clearResearch,
      feedback,
      recordFeedback,
      onboardingDone,
      setOnboardingDone,
      deleteAllData,
      resetDemo,
    }),
    [
      settings,
      updateSetting,
      resetSettings,
      reactions,
      recordEstimate,
      recordSelfReport,
      clearSelfReport,
      history,
      recordView,
      deleteHistoryEntry,
      research,
      saveResearchResult,
      clearResearch,
      feedback,
      recordFeedback,
      onboardingDone,
      setOnboardingDone,
      deleteAllData,
      resetDemo,
    ],
  );

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  );
}

export function useAppState(): AppStateValue {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used inside <AppStateProvider>.');
  }
  return context;
}

export function useSettings(): Settings {
  return useAppState().settings;
}
