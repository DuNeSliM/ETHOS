import { CameraOff, Camera, HardDrive, Pause, ScanText } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useSettings } from '@/app/AppStateProvider';
import { Chip } from '@/components/primitives';

/**
 * Persistent status strip.
 *
 * Answers four questions at all times without the participant having to open
 * a settings screen: is the analysis running, is the (simulated) camera on,
 * where does data live, and is any of this real?
 *
 * The camera chip is the important one - it must read "Kamera aus" whenever
 * capture is off, so an inactive camera is stated rather than merely implied.
 */
export function StatusBar() {
  const settings = useSettings();

  const analysisActive = settings.contentAnalysis && !settings.assistantPaused;
  const cameraActive = settings.simulatedCameraCapture && !settings.assistantPaused;

  return (
    <div className="border-t border-line bg-surface-2">
      <div className="mx-auto flex max-w-[34rem] flex-wrap items-center gap-1.5 px-3 py-1.5">
        <span className="sr-only">Aktueller Status der Assistenzfunktionen:</span>

        {settings.assistantPaused ? (
          <Chip tone="caution" icon={<Pause aria-hidden="true" className="size-3.5" />}>
            Assistent pausiert
          </Chip>
        ) : (
          <Chip
            tone={analysisActive ? 'assist' : 'neutral'}
            icon={<ScanText aria-hidden="true" className="size-3.5" />}
          >
            {analysisActive ? 'Inhaltsanalyse aktiv' : 'Inhaltsanalyse aus'}
          </Chip>
        )}

        <Chip
          tone={cameraActive ? 'caution' : 'neutral'}
          icon={
            cameraActive ? (
              <Camera aria-hidden="true" className="size-3.5" />
            ) : (
              <CameraOff aria-hidden="true" className="size-3.5" />
            )
          }
        >
          {cameraActive
            ? 'Simulierte Kamera aktiv'
            : 'Kamera aus'}
        </Chip>

        <Chip tone="neutral" icon={<HardDrive aria-hidden="true" className="size-3.5" />}>
          {settings.storeReactionHistory
            ? 'Speicherung: nur lokal'
            : 'Keine Speicherung'}
        </Chip>

        <Link
          to="/settings"
          className="
            ml-auto rounded-md px-2 py-1 text-xs font-semibold text-assist-strong
            underline decoration-assist-line underline-offset-2 hover:bg-assist-tint
          "
        >
          Status ändern
        </Link>
      </div>
    </div>
  );
}
