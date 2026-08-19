import { Heart, Pause, Play, Video } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { useSimulatedPlayback } from '@/hooks/useSimulatedPlayback';
import { formatClock } from '@/data/timelines';
import { PostScene } from '@/features/feed/PostScene';
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
  /**
   * Double tap on the picture. The gesture every photo feed has trained its
   * users to expect; the caller decides what it means (here: like the post).
   */
  onDoubleTap,
}: {
  media: SimulatedMedia;
  /** Called with the playback position so a parent can sync the timeline. */
  onTimeChange?: (seconds: number) => void;
  /** Overlay rendered on top of the media, e.g. the own-reaction chip. */
  children?: React.ReactNode;
  variant?: 'feed' | 'detail';
  onDoubleTap?: () => void;
}) {
  const duration = media.durationSeconds ?? 0;
  const playback = useSimulatedPlayback(duration);
  const isVideo = media.kind === 'video';
  const hasStaticFile = Boolean(media.src || media.poster);
  const [burst, setBurst] = useState(0);
  const burstTimer = useRef<number | undefined>(undefined);

  // Report the position upward in an effect, never during render - a parent
  // setState call while rendering would loop.
  useEffect(() => {
    onTimeChange?.(playback.currentTime);
  }, [playback.currentTime, onTimeChange]);

  useEffect(() => () => window.clearTimeout(burstTimer.current), []);

  function handleDoubleTap() {
    if (!onDoubleTap) return;
    onDoubleTap();
    // Keyed remount of the heart, so a second double tap restarts the
    // animation instead of being swallowed by the running one.
    setBurst((value) => value + 1);
    window.clearTimeout(burstTimer.current);
    burstTimer.current = window.setTimeout(() => setBurst(0), 800);
  }

  return (
    <figure className="relative m-0" onDoubleClick={handleDoubleTap}>
      <div
        className={`
          relative overflow-hidden bg-surface-3
          ${onDoubleTap ? 'select-none' : ''}
          ${variant === 'feed' ? 'aspect-[4/5]' : 'aspect-[4/5] rounded-xl border border-line sm:aspect-video'}
        `}
        style={{
          background: `linear-gradient(150deg, ${media.palette[0]}, ${media.palette[1]})`,
        }}
      >
        {/*
          Three ways to fill this frame, in order of preference: a real file
          the demo was given, a real poster file as a photo preview for a video
          post, the drawn scene, and - only if a post ever ships without either -
          the plain gradient behind both.
        */}
        {media.src ? (
          isVideo ? (
            <video
              src={media.src}
              poster={media.poster}
              muted
              loop
              playsInline
              autoPlay={playback.isPlaying}
              aria-hidden="true"
              className="size-full object-cover"
            />
          ) : (
            <img src={media.src} alt="" className="size-full object-cover" />
          )
        ) : media.poster && isVideo ? (
          <img src={media.poster} alt="" className="size-full object-cover" />
        ) : (
          <PostScene
            scene={media.scene}
            palette={media.palette}
            isPlaying={playback.isPlaying}
          />
        )}

        {/*
          Vignette. Photo feeds are dense with white text on arbitrary
          pictures, and the corners are where the overlays sit.
        */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_45%,rgb(0_0_0/0.28))]"
        />

        {/* Meme caption, where the post carries one. */}
        {media.overlayText ? (
          <div
            aria-hidden="true"
            className="absolute inset-0 flex flex-col justify-between p-4 text-center"
          >
            <p className="meme-caption text-[1.375rem]">
              {media.overlayText.top ?? ''}
            </p>
            <p className="meme-caption text-[1.375rem]">
              {media.overlayText.bottom ?? ''}
            </p>
          </div>
        ) : null}

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

          {/*
            The marker stays even now that the frame carries a picture -
            especially now. A participant must never have to work out whether
            what they are looking at was filmed.
          */}
          <span className="rounded-md bg-black/50 px-2 py-1 text-[0.6875rem] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
            {hasStaticFile ? 'Beispielclip' : 'Simulierter Platzhalter'}
          </span>
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

        {/*
          The double-tap heart. Decoration only: the like itself is owned by
          the labelled button under the picture, which is also the one route
          to it for keyboard and screen reader users. Under
          `prefers-reduced-motion` the animation collapses to nothing, which is
          the intended outcome here.
        */}
        {burst > 0 ? (
          <div
            key={burst}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <Heart
              className="heart-burst size-24 text-white drop-shadow-[0_2px_12px_rgb(0_0_0/0.5)]"
              fill="currentColor"
            />
          </div>
        ) : null}
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

      {/*
        The description carries the whole content of the frame for anyone not
        looking at it, so it says what the scene shows - and says plainly
        whether it was drawn for this prototype or is a supplied example clip.
      */}
      <figcaption className="sr-only">
        {hasStaticFile
          ? 'Beispielclip in einem simulierten Feed.'
          : 'Gezeichnete Szene. In diesem Prototyp gibt es keine echten Fotos oder Videos.'}{' '}
        Beschreibung: {media.altText}
      </figcaption>
    </figure>
  );
}
