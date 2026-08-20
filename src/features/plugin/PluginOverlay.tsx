import {
  ClipboardList,
  Pause,
  Play,
  ScanFace,
  Settings2,
  ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useAppState } from '@/app/AppStateProvider';
import { EthosIcon } from '@/components/EthosIcon';
import { Sheet } from '@/components/Sheet';
import { Toggle } from '@/components/Toggle';
import { Chip, SimulatedBadge } from '@/components/primitives';
import { PRODUCT_NAME, getPlatformMeta } from '@/lib/identity';
import type { SocialPlatform } from '@/types';

/**
 * The assistance layer's presence on top of a foreign app.
 *
 * A floating button pinned over the platform, plus the panel it opens. This is
 * the piece that makes the product claim concrete: ETHOS is not a feature
 * of the feed underneath, it is a separate thing lying over it, reachable at
 * any moment, and switchable off from there in one tap.
 *
 * Everything the panel offers already exists elsewhere in the app. It is a
 * shortcut, never the only way to reach a setting - a participant who never
 * finds the bubble can still do everything from the ETHOS app.
 */
const SHORTCUTS = [
  {
    to: '/ethos/overview',
    label: 'Persönliche Übersicht',
    hint: 'Was du angesehen hast, lokal gespeichert',
    icon: ClipboardList,
  },
  {
    to: '/ethos/privacy',
    label: 'Datenschutz',
    hint: 'Was aktiv ist, exportieren, löschen',
    icon: ShieldCheck,
  },
  {
    to: '/ethos/settings',
    label: 'Einstellungen',
    hint: 'Jede Funktion einzeln schaltbar',
    icon: Settings2,
  },
  {
    to: '/ethos/research',
    label: 'Research Mode',
    hint: 'Drei geführte Testaufgaben',
    icon: ScanFace,
  },
] as const;

export function PluginOverlay({ platform }: { platform: SocialPlatform }) {
  const { settings, updateSetting } = useAppState();
  const [open, setOpen] = useState(false);
  const platformMeta = getPlatformMeta(platform);

  const paused = settings.assistantPaused;
  const analysisActive = settings.contentAnalysis && !paused;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${PRODUCT_NAME} öffnen`}
        className={`
          fixed bottom-20 right-3 z-40 flex items-center gap-2 rounded-full
          border py-2 pl-2.5 pr-3.5 text-sm font-bold panel-shadow
          max-[360px]:size-11 max-[360px]:justify-center max-[360px]:p-0
          ${
            paused
              ? 'border-line-strong bg-surface text-muted'
              : 'border-assist-line bg-assist text-assist-on'
          }
        `}
      >
        <EthosIcon
          className={`size-6 rounded-md ${paused ? 'grayscale opacity-60' : ''}`}
        />
        <span className="max-[360px]:sr-only">{PRODUCT_NAME}</span>
      </button>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title={PRODUCT_NAME}
        description={`Assistenzschicht über ${platformMeta.name}. Sie gehört nicht zu dieser App.`}
        titleAdornment={<SimulatedBadge label="Systemerweiterung, simuliert" />}
      >
        <div className="flex flex-wrap gap-1.5">
          {/* Same three facts and the same wording as `StatusBar`. "Paused" and
              "analysis switched off" are different states and must not be
              collapsed into one label. */}
          <Chip tone={analysisActive ? 'assist' : paused ? 'caution' : 'neutral'}>
            {paused
              ? 'Assistent pausiert'
              : analysisActive
                ? 'Inhaltsanalyse aktiv'
                : 'Inhaltsanalyse aus'}
          </Chip>
          {/* Three states, not two: the estimates are always simulated, but
              the camera itself is either off or genuinely running. */}
          <Chip tone={settings.simulatedCameraCapture && !paused ? 'caution' : 'neutral'}>
            {!settings.simulatedCameraCapture || paused
              ? 'Kamera aus'
              : settings.liveCameraPreview
                ? 'Kamerabild live, Analyse simuliert'
                : 'Simulierte Kamera aktiv'}
          </Chip>
          <Chip tone="neutral">
            {settings.storeReactionHistory
              ? 'Speicherung: nur lokal'
              : 'Keine Speicherung'}
          </Chip>
        </div>

        <div className="mt-4">
          <Toggle
            label="Assistenzschicht aktiv"
            description={`Aus bedeutet: keine Hinweise, keine Schätzungen, kein Symbol über ${platformMeta.name}. Deine Einstellungen bleiben erhalten.`}
            checked={!paused}
            onChange={(next) => updateSetting('assistantPaused', !next)}
          />
        </div>

        <h3 className="mt-5 text-xs font-bold uppercase tracking-wide text-faint">
          {PRODUCT_NAME} öffnen
        </h3>
        <ul className="mt-2 space-y-1.5">
          {SHORTCUTS.map(({ to, label, hint, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl border border-line bg-surface px-3 py-2.5 hover:bg-surface-2"
              >
                <Icon aria-hidden="true" className="size-5 shrink-0 text-assist" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-ink">
                    {label}
                  </span>
                  <span className="block text-xs text-muted">{hint}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-5 rounded-xl bg-surface-2 p-3 text-xs leading-relaxed text-muted">
          So wäre es gedacht: Die Erweiterung liest nur, was gerade auf dem
          Bildschirm sichtbar ist, und wertet es lokal aus. In diesem Prototyp
          passiert auch das nicht – die Einschätzungen sind vorab geschrieben,
          und dieser {platformMeta.name}-Mock hat keine Verbindung nach außen.
        </p>
      </Sheet>
    </>
  );
}

/**
 * One-line system strip under the platform's header.
 *
 * The bubble is easy to overlook and a panel that has to be opened cannot
 * answer "is the camera on right now?" at a glance. This strip is always
 * visible while the participant is inside the foreign app, and it is styled as
 * assistance-layer chrome so it never reads as part of the feed.
 */
export function PluginStatusStrip() {
  const { settings, updateSetting } = useAppState();

  const paused = settings.assistantPaused;
  const analysisActive = settings.contentAnalysis && !paused;
  const cameraActive = settings.simulatedCameraCapture && !paused;

  return (
    <div className="border-b border-assist-line bg-assist-tint">
      <div className="mx-auto flex max-w-[30rem] items-center gap-2 px-3 py-1.5">
        <EthosIcon
          className={`size-5 rounded-md ${paused ? 'grayscale opacity-60' : ''}`}
        />

        {/*
          Each fact is its own element with nothing but its own text in it.
          That keeps the wording identical to the ETHOS status bar and
          lets both be asserted on by exact text.
        */}
        <p className="flex min-w-0 flex-1 items-baseline gap-1 overflow-hidden text-xs">
          <span className="sr-only">Status der Assistenzschicht:</span>
          <span
            className={`shrink-0 font-semibold ${
              analysisActive ? 'text-assist-strong' : 'text-muted'
            }`}
          >
            {paused
              ? 'Assistent pausiert'
              : analysisActive
                ? 'Inhaltsanalyse aktiv'
                : 'Inhaltsanalyse aus'}
          </span>
          <Separator />
          <span className="shrink-0 text-muted">
            {!cameraActive
              ? 'Kamera aus'
              : settings.liveCameraPreview
                ? 'Kamerabild live'
                : 'Simulierte Kamera aktiv'}
          </span>
          <Separator />
          <span className="truncate text-muted">
            {settings.storeReactionHistory ? 'nur lokal' : 'keine Speicherung'}
          </span>
        </p>

        <button
          type="button"
          onClick={() => updateSetting('assistantPaused', !paused)}
          className="
            flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs
            font-bold text-assist-strong hover:bg-assist-tint-2
          "
        >
          {paused ? (
            <Play aria-hidden="true" className="size-3.5" />
          ) : (
            <Pause aria-hidden="true" className="size-3.5" />
          )}
          {paused ? 'Fortsetzen' : 'Pausieren'}
        </button>
      </div>

      {/*
        The strip above is a summary; the full wording lives in the status bar
        of the ETHOS app. Screen reader users get the same three facts
        spelled out here rather than as a truncated line.
      */}
      <p className="sr-only">
        {analysisActive
          ? 'Die Analyse der Inhalte läuft.'
          : 'Es werden derzeit keine Hinweise angezeigt.'}{' '}
        {cameraActive
          ? settings.liveCameraPreview
            ? 'Die Kamera läuft und ihr Bild wird oben links angezeigt. Ausgewertet wird es nicht; die Reaktionsschätzungen sind simuliert.'
            : 'Die simulierte Reaktionserfassung ist eingeschaltet.'
          : 'Die Kamera ist aus.'}{' '}
        {settings.storeReactionHistory
          ? 'Gespeichert wird ausschließlich lokal in diesem Browser.'
          : 'Es wird nichts gespeichert.'}
      </p>
    </div>
  );
}

function Separator() {
  return (
    <span aria-hidden="true" className="shrink-0 text-faint">
      ·
    </span>
  );
}
