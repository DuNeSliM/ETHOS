import { Pause, Play, Video } from 'lucide-react';
import { useEffect } from 'react';

import { useSimulatedPlayback } from '@/hooks/useSimulatedPlayback';
import { formatClock } from '@/data/timelines';
import type { SimulatedMedia } from '@/types';

/**
 * Stand-in for a photo or video in the visual feed.
 *
 * No real media ships with this prototype, so instead of a grey box we render
 * a labelled placeholder that describes what the clip *would* show. Test
 * participants can then reason about the content without us implying that any
 * footage was analysed. The description is visible text rather than an `alt`
 * attribute, so screen reader users and sighted users get the same thing.
 *
 * Layout follows the conventions of a photo-sharing feed: full-bleed, portrait
 * aspect ratio, controls overlaid on the media rather than beside it.
 */
export function MediaPlaceholder({
  media,
  onTimeChange,
  children,
  /** `feed` is the full-bleed 4:5 card variant, `detail` is a contained one. */
  variant = 'feed',
}: {
  media: SimulatedMedia;
  /** Called with the playback position so a parent can sync the timeline. */
  onTimeChange?: (seconds: number) => void;
  /** Overlay rendered on top of the media, e.g. the own-reaction chip. */
  children?: React.ReactNode;
  variant?: 'feed' | 'detail';
}) {
  const duration = media.durationSeconds ?? 0;
  const playback = useSimulatedPlayback(duration);
  const isVideo = media.kind === 'video';

  // Report the position upward in an effect, never during render - a parent
  // setState call while rendering would loop.
  useEffect(() => {
    onTimeChange?.(playback.currentTime);
  }, [playback.currentTime, onTimeChange]);

  return (
    <figure className="relative m-0">
      <div
        className={`
          relative overflow-hidden bg-surface-3
          ${variant === 'feed' ? 'aspect-[4/5]' : 'aspect-[4/5] rounded-xl border border-line sm:aspect-video'}
        `}
        style={{
          background: `linear-gradient(150deg, ${media.palette[0]}, ${media.palette[1]})`,
        }}
      >
        <div className="sim-hatch absolute inset-0" aria-hidden="true" />

        {/* Top row: media type and the simulation marker. */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          {isVideo ? (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-black/50 px-2 py-1 text-[0.6875rem] font-semibold text-white backdrop-blur-sm">
              <Video aria-hidden="true" className="size-3.5" />
              {formatClock(duration)}
            </span>
          ) : (
            <span />
          )}

          <span className="rounded-md bg-black/50 px-2 py-1 text-[0.6875rem] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
            Simulierter Platzhalter
          </span>
        </div>

        {/*
          The description is the actual content of this placeholder, so it gets
          the centre of the frame rather than being tucked away.
        */}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <p className="max-w-sm text-center text-[0.9375rem] font-medium leading-snug text-white [text-shadow:0_1px_12px_rgb(0_0_0_/_0.85)]">
            {media.altText}
          </p>
        </div>

        {/*
          Overlay slot, e.g. the own-reaction chip. The wrapper is always
          rendered because `children` is a component that decides for itself
          whether to show anything, so it stays click-through and only the
          chip inside takes pointer events.
        */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-start p-3 [&>*]:pointer-events-auto">
          {children}
        </div>
      </div>

      {isVideo && duration > 0 ? (
        <div
          className={`
            flex items-center gap-2 bg-black/85 px-3 py-2
            ${variant === 'detail' ? 'mt-1 rounded-lg' : ''}
          `}
        >
          <button
            type="button"
            onClick={playback.toggle}
            className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold text-white hover:bg-white/15"
          >
            {playback.isPlaying ? (
              <Pause aria-hidden="true" className="size-4" />
            ) : (
              <Play aria-hidden="true" className="size-4" />
            )}
            {playback.isPlaying ? 'Pause' : 'Abspielen'}
          </button>

          <label className="flex min-w-0 flex-1 items-center">
            <span className="sr-only">Wiedergabeposition im simulierten Video</span>
            <input
              type="range"
              min={0}
              max={duration}
              step={0.5}
              value={playback.currentTime}
              onChange={(event) => playback.seek(Number(event.target.value))}
              className="min-w-0 flex-1 accent-white"
            />
          </label>

          <span className="shrink-0 font-mono text-[0.6875rem] tabular-nums text-white/80">
            {formatClock(playback.currentTime)} / {formatClock(duration)}
          </span>
        </div>
      ) : null}

      <figcaption className="sr-only">
        Simulierter Platzhalter. In diesem Prototyp gibt es keine echten Bilder
        oder Videos. Beschreibung: {media.altText}
      </figcaption>
    </figure>
  );
}
