import type { SyntheticEvent } from 'react';

import type { SimulatedMedia } from '@/types';

type RedditPostMediaProps = {
  media: SimulatedMedia;
  title: string;
};

/**
 * Native media for the Reddit mock.
 *
 * Instagram's scripted player drives ETHOS' simulated reaction timeline. A
 * Reddit post instead behaves like ordinary embedded platform media: the
 * browser owns playback, controls stay visible, autoplay is absent, and audio
 * is deliberately not muted. Seeking a few milliseconds after metadata loads
 * makes the first decoded frame available as the paused preview without
 * starting playback.
 */
export function RedditPostMedia({ media, title }: RedditPostMediaProps) {
  if (!media.src) return null;

  if (media.kind === 'video') {
    function revealFirstFrame(event: SyntheticEvent<HTMLVideoElement>) {
      const video = event.currentTarget;
      if (video.currentTime === 0 && Number.isFinite(video.duration)) {
        video.currentTime = Math.min(0.001, video.duration);
      }
    }

    return (
      <figure className="mt-3 overflow-hidden border-y border-line bg-black">
        <video
          aria-label={`Video: ${title}`}
          className="aspect-[4/3] w-full bg-black object-contain"
          controls
          playsInline
          preload="metadata"
          onLoadedMetadata={revealFirstFrame}
        >
          <source src={media.src} type="video/mp4" />
          Dein Browser kann dieses Video nicht abspielen.
        </video>
        <figcaption className="bg-surface px-4 py-2 text-xs text-faint">
          Video startet pausiert. Wiedergabe und Ton steuerst du über die
          Player-Bedienelemente. Lokale Demo-Datei.
          <span className="sr-only"> Bildbeschreibung: {media.altText}</span>
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className="mt-3 overflow-hidden border-y border-line bg-surface-2">
      <img
        src={media.src}
        alt={media.altText}
        className="aspect-square w-full object-contain"
        loading="lazy"
      />
      <figcaption className="bg-surface px-4 py-2 text-xs text-faint">
        Bildbeitrag · lokale Demo-Datei
      </figcaption>
    </figure>
  );
}
