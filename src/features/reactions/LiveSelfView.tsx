import { CameraOff, Info, ScanFace, Settings2, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAppState } from '@/app/AppStateProvider';
import { Sheet } from '@/components/Sheet';
import { Button, Chip, Panel, SimulatedBadge } from '@/components/primitives';
import { useCameraStream } from '@/features/reactions/useCameraStream';

/**
 * The self-view: a small live picture-in-picture of the participant's own
 * camera, pinned over the simulated platform while they scroll.
 *
 * Why it exists. The product claim is "a camera looks at your face while you
 * read". Describing that in a settings screen is abstract; showing the actual
 * image, in the corner, for the whole session, is not. A participant can see
 * at every moment exactly what a camera would be capturing of them - which is
 * the honest way to ask whether they want this at all.
 *
 * What it is not. It is not a detector. The image is displayed and nothing
 * more (see `useCameraStream`), and the reaction estimates on the posts stay
 * the scripted values from `mockEngine.ts`. The frame drawn over the picture is
 * a mock-up of where a detector *would* look, and it is labelled as such.
 *
 * Visibility follows consent: it appears only while the participant has both
 * the simulated capture and the camera preview switched on, and it vanishes the
 * moment the assistance layer is paused.
 */
export function LiveSelfView() {
  const { settings, updateSetting } = useAppState();
  const { attachVideo, status, error, start, stop, isLive } = useCameraStream();
  const [open, setOpen] = useState(false);

  const shouldRun =
    settings.liveCameraPreview &&
    settings.simulatedCameraCapture &&
    !settings.assistantPaused;

  // The consent switch drives the hardware directly. Switching the toggle off -
  // or pausing the whole layer - stops the tracks, so the operating system's
  // camera indicator agrees with what our UI says.
  useEffect(() => {
    if (shouldRun) {
      void start();
    } else {
      stop();
    }
  }, [shouldRun, start, stop]);

  if (!shouldRun) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={
          isLive
            ? 'Kamerabild von dir, live. Öffnen für Erklärung und zum Ausschalten.'
            : 'Kamerabild von dir ist nicht verfügbar. Öffnen für Erklärung.'
        }
        className="
          fixed bottom-20 left-3 z-40 w-[5.5rem] overflow-hidden rounded-xl
          border border-assist-line bg-ink text-left panel-shadow
        "
      >
        {/* Header strip: the assistance layer owns this element, not the feed. */}
        <span className="flex items-center gap-1 bg-assist px-1.5 py-1 text-[0.5625rem] font-bold uppercase tracking-wide text-assist-on">
          <span
            aria-hidden="true"
            className={`size-1.5 shrink-0 rounded-full bg-assist-on ${isLive ? 'rec-pulse' : 'opacity-40'}`}
          />
          <span className="truncate">{isLive ? 'Kamera live' : 'Kein Bild'}</span>
        </span>

        <span className="relative block aspect-[3/4] w-full bg-surface-3">
          {/*
            Mirrored, the way every self-view is: an unmirrored picture of your
            own face reads as somebody else's. `muted`/`playsInline` keep
            autoplay policies happy, and the element is hidden from assistive
            technology because a live self-view carries nothing to read out -
            the button's own label states whether the camera is on.
          */}
          <video
            ref={attachVideo}
            autoPlay
            muted
            playsInline
            aria-hidden="true"
            className={`size-full scale-x-[-1] object-cover ${isLive ? '' : 'invisible'}`}
          />

          {isLive ? (
            /*
              A mock-up of a detector's face box. Drawn at a fixed position on
              purpose: nothing here tracks anything, and pretending otherwise
              would be the one lie this prototype must not tell.
            */
            <span
              aria-hidden="true"
              className="absolute inset-x-[18%] top-[16%] block aspect-square rounded-md border border-dashed border-assist-on/70"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center p-2 text-center text-[0.5625rem] font-medium leading-tight text-muted">
              {status === 'starting' ? 'Kamera startet …' : 'Kamera nicht verfügbar'}
            </span>
          )}

          <span className="absolute inset-x-0 bottom-0 block bg-black/65 px-1 py-0.5 text-center text-[0.5rem] font-semibold leading-tight text-white">
            wird nicht ausgewertet
          </span>
        </span>
      </button>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Was die Kamera sieht"
        description="Das Bild oben links ist dein echtes Kamerabild, live auf diesem Gerät."
        titleAdornment={<SimulatedBadge label="Analyse simuliert" />}
      >
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-line bg-surface-3">
            <video
              ref={attachVideo}
              autoPlay
              muted
              playsInline
              aria-hidden="true"
              className={`aspect-video w-full scale-x-[-1] object-cover ${isLive ? '' : 'hidden'}`}
            />
            {!isLive ? (
              <p className="flex aspect-video items-center justify-center px-4 text-center text-sm text-muted">
                {status === 'starting'
                  ? 'Die Kamera wird gestartet …'
                  : 'Derzeit kommt kein Bild an.'}
              </p>
            ) : null}
          </div>

          {error ? (
            <p role="status" className="rounded-lg bg-caution-tint p-3 text-sm text-caution">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-1.5">
            <Chip tone={isLive ? 'caution' : 'neutral'} icon={<ScanFace aria-hidden="true" className="size-3.5" />}>
              {isLive ? 'Kamera läuft' : 'Kamera aus'}
            </Chip>
            <Chip tone="neutral" icon={<ShieldCheck aria-hidden="true" className="size-3.5" />}>
              Kein Bild verlässt dieses Gerät
            </Chip>
          </div>

          {/*
            The two halves of the honest answer, kept apart on purpose: the
            picture is real, the reading of it is not.
          */}
          <Panel variant="muted" className="p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-ink">
              <Info aria-hidden="true" className="size-4 shrink-0 text-assist" />
              Echt ist nur das Bild
            </h3>
            <ul className="mt-2 space-y-1.5 text-sm text-muted">
              <li>
                <strong className="font-semibold text-ink">Echt:</strong> das
                Kamerabild. Es wird angezeigt, damit du siehst, was eine Kamera
                erfassen würde.
              </li>
              <li>
                <strong className="font-semibold text-ink">Simuliert:</strong>{' '}
                jede Reaktionsschätzung an den Beiträgen. Sie sind vorab
                geschrieben und ändern sich nicht, egal was du in die Kamera
                machst.
              </li>
              <li>
                <strong className="font-semibold text-ink">Nicht vorhanden:</strong>{' '}
                Aufnahme, Speicherung, Übertragung und Gesichtserkennung. Der
                gestrichelte Rahmen im Vorschaubild ist eine Attrappe.
              </li>
            </ul>
          </Panel>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="assist"
              onClick={() => {
                updateSetting('liveCameraPreview', false);
                setOpen(false);
              }}
            >
              <CameraOff aria-hidden="true" className="size-4" />
              Kamerabild ausschalten
            </Button>

            <Link to="/settings" onClick={() => setOpen(false)}>
              <Button>
                <Settings2 aria-hidden="true" className="size-4" />
                Einstellungen
              </Button>
            </Link>
          </div>
        </div>
      </Sheet>
    </>
  );
}
