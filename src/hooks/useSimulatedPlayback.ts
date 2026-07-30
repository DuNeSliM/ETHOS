import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Drives the fake video scrubber.
 *
 * There is no real `<video>` element in this prototype, so playback position
 * is just a number advanced by a timer. A ref holds the position between ticks
 * so the interval callback never closes over a stale value.
 *
 * Respects `prefers-reduced-motion` by not auto-advancing: participants who
 * asked for less movement can still step through the clip with the scrubber.
 */
export function useSimulatedPlayback(durationSeconds: number) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timeRef = useRef(0);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    timeRef.current = currentTime;
  }, [currentTime]);

  useEffect(() => {
    if (!isPlaying) return;

    const TICK_MS = 250;
    const id = window.setInterval(() => {
      const next = timeRef.current + TICK_MS / 1000;
      if (next >= durationSeconds) {
        timeRef.current = durationSeconds;
        setCurrentTime(durationSeconds);
        setIsPlaying(false);
      } else {
        timeRef.current = next;
        setCurrentTime(next);
      }
    }, TICK_MS);

    return () => window.clearInterval(id);
  }, [isPlaying, durationSeconds]);

  const toggle = useCallback(() => {
    setIsPlaying((playing) => {
      // Restarting from the end is friendlier than a dead play button.
      if (!playing && timeRef.current >= durationSeconds) {
        timeRef.current = 0;
        setCurrentTime(0);
      }
      return !playing;
    });
  }, [durationSeconds]);

  const seek = useCallback(
    (seconds: number) => {
      const clamped = Math.min(Math.max(seconds, 0), durationSeconds);
      timeRef.current = clamped;
      setCurrentTime(clamped);
    },
    [durationSeconds],
  );

  const reset = useCallback(() => {
    setIsPlaying(false);
    timeRef.current = 0;
    setCurrentTime(0);
  }, []);

  return {
    currentTime,
    isPlaying,
    toggle,
    seek,
    reset,
    prefersReducedMotion,
    progress: durationSeconds > 0 ? currentTime / durationSeconds : 0,
  };
}
