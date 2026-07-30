import { Camera, CameraOff, CircleAlert } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button, Chip, Panel } from '@/components/primitives';

/**
 * Optional local camera preview (stretch goal from the brief).
 *
 * Strictly display-only:
 *  - the stream is attached to a `<video>` element and nothing else;
 *  - no canvas, no `drawImage`, no frame is ever read;
 *  - no `MediaRecorder`, no upload, no analysis;
 *  - every track is stopped when the preview is turned off or unmounted, so the
 *    browser's camera indicator goes out when the UI says it is off.
 *
 * The reaction estimates elsewhere in the app remain scripted values and are
 * not affected by whether this preview is running.
 */
export function CameraPreview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setActive(false);
  }, []);

  // Release the camera if the component disappears for any reason.
  useEffect(() => stop, [stop]);

  async function start() {
    setError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Dieser Browser stellt keine Kamera-Vorschau bereit.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setActive(true);
    } catch {
      // Covers denial, no device, and device-in-use alike. We deliberately do
      // not surface the raw error text.
      setError(
        'Die Kamera konnte nicht gestartet werden. Möglicherweise hast du den Zugriff abgelehnt oder es ist keine Kamera vorhanden. Der Prototyp funktioniert auch ohne Vorschau vollständig.',
      );
      stop();
    }
  }

  return (
    <Panel className="p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-ink">Lokale Kamera-Vorschau</h3>
        <Chip
          tone={active ? 'caution' : 'neutral'}
          icon={
            active ? (
              <Camera aria-hidden="true" className="size-3.5" />
            ) : (
              <CameraOff aria-hidden="true" className="size-3.5" />
            )
          }
        >
          {active ? 'Kamera läuft' : 'Kamera aus'}
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
          camera is on.
        */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          aria-hidden="true"
          className={`aspect-video w-full object-cover ${active ? '' : 'hidden'}`}
        />
        {!active ? (
          <div className="flex aspect-video items-center justify-center px-4 text-center">
            <p className="text-sm text-muted">
              Die Vorschau ist aus. Du musst sie ausdrücklich starten.
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
        {active ? (
          <Button onClick={stop}>
            <CameraOff aria-hidden="true" className="size-4" />
            Vorschau beenden
          </Button>
        ) : (
          <Button variant="assist" onClick={start}>
            <Camera aria-hidden="true" className="size-4" />
            Vorschau starten
          </Button>
        )}
      </div>
    </Panel>
  );
}
