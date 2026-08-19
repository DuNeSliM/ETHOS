import { Camera, CameraOff, CircleAlert } from 'lucide-react';
import { useEffect } from 'react';

import { Button, Chip, Panel } from '@/components/primitives';
import { useCameraStream } from '@/features/reactions/useCameraStream';

/**
 * The camera preview inside the settings screen.
 *
 * Same picture as the corner self-view over the feed, shown large so a
 * participant can decide about the camera while looking at what it captures.
 * All the display-only guarantees live in `useCameraStream`; this component
 * only draws the frame around them.
 *
 * The reaction estimates elsewhere in the app remain scripted values and are
 * not affected by whether this preview is running.
 */
export function CameraPreview() {
  const { attachVideo, status, error, start, stop, isLive } = useCameraStream();

  // Mounting this component means the participant just switched the preview
  // on, so start straight away rather than asking for a second confirmation.
  useEffect(() => {
    void start();
    return stop;
  }, [start, stop]);

  return (
    <Panel className="p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-ink">Lokale Kamera-Vorschau</h3>
        <Chip
          tone={isLive ? 'caution' : 'neutral'}
          icon={
            isLive ? (
              <Camera aria-hidden="true" className="size-3.5" />
            ) : (
              <CameraOff aria-hidden="true" className="size-3.5" />
            )
          }
        >
          {isLive ? 'Kamera läuft' : 'Kamera aus'}
        </Chip>
      </div>

      <p className="mt-1.5 text-sm text-muted">
        Nur Anzeige. Der Prototyp wertet dieses Bild nicht aus, speichert es
        nicht und sendet es nicht. Die Reaktionsschätzungen bleiben simuliert.
      </p>

      <div className="mt-3 overflow-hidden rounded-xl border border-line bg-surface-3">
        {/*
          `muted` and `playsInline` keep autoplay policies happy; the element is
          decorative for screen readers since a live self-view carries no
          information they can use, and the status chip above states whether the
          camera is on. Mirrored, the way a self-view is expected to be.
        */}
        <video
          ref={attachVideo}
          autoPlay
          muted
          playsInline
          aria-hidden="true"
          className={`aspect-video w-full scale-x-[-1] object-cover ${isLive ? '' : 'hidden'}`}
        />
        {!isLive ? (
          <div className="flex aspect-video items-center justify-center px-4 text-center">
            <p className="text-sm text-muted">
              {status === 'starting'
                ? 'Die Kamera wird gestartet …'
                : 'Die Vorschau ist aus.'}
            </p>
          </div>
        ) : null}
      </div>

      {error ? (
        <p
          role="status"
          className="mt-2.5 flex gap-2 rounded-lg bg-caution-tint p-2.5 text-sm text-caution"
        >
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </p>
      ) : null}

      <div className="mt-3">
        {isLive ? (
          <Button onClick={stop}>
            <CameraOff aria-hidden="true" className="size-4" />
            Vorschau beenden
          </Button>
        ) : (
          <Button variant="assist" onClick={() => void start()}>
            <Camera aria-hidden="true" className="size-4" />
            Vorschau starten
          </Button>
        )}
      </div>
    </Panel>
  );
}
