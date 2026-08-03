import {
  Calendar,
  Camera,
  Cloud,
  Compass,
  MessageCircle,
  Music,
  NotebookPen,
  Pause,
  Phone,
  ScanText,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAppState } from '@/app/AppStateProvider';
import { PLATFORM_NAME } from '@/features/social-app/platform';

/**
 * Home screen of the simulated phone.
 *
 * It exists for one reason: an assistance layer that is only ever seen inside
 * one app looks like a feature of that app. Starting on a home screen, with a
 * separate icon for the platform and a separate icon for ContextLens, makes
 * the two obviously different pieces of software before the feed is even open.
 *
 * Only two icons lead anywhere. The rest is scenery and is marked
 * `aria-hidden` rather than wired up as buttons that do nothing - the same
 * rule the stories strip in the feed follows.
 */
export function PhoneHomePage() {
  const { settings } = useAppState();

  const lensActive = settings.contentAnalysis && !settings.assistantPaused;
  const today = new Date().toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div
      className="app-min-h flex flex-col px-6 pb-6 pt-8"
      style={{
        background:
          'linear-gradient(165deg, #10203f 0%, #2a1a4d 42%, #6f2f6a 78%, #b0525a 100%)',
      }}
    >
      <p className="text-center text-sm font-medium text-white/70">{today}</p>

      {/* ---- ContextLens status widget ------------------------------- */}
      <section
        aria-labelledby="lens-widget-heading"
        className="mt-4 rounded-3xl border border-white/15 bg-black/35 p-4 backdrop-blur-md"
      >
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-assist text-assist-on"
          >
            <LensGlyph className="size-5" />
          </span>
          <h2
            id="lens-widget-heading"
            className="text-sm font-bold leading-tight text-white"
          >
            ContextLens
            <span className="block text-[0.6875rem] font-medium text-white/60">
              Systemerweiterung · simuliert
            </span>
          </h2>
        </div>

        <p className="mt-3 flex items-center gap-2 text-sm text-white">
          {lensActive ? (
            <ScanText aria-hidden="true" className="size-4 shrink-0 text-white/70" />
          ) : (
            <Pause aria-hidden="true" className="size-4 shrink-0 text-white/70" />
          )}
          {lensActive
            ? 'Aktiv. Erklärt Beiträge auf Antippen.'
            : 'Pausiert. Es werden keine Hinweise angezeigt.'}
        </p>

        <p className="mt-1 text-xs text-white/60">
          {settings.simulatedCameraCapture
            ? 'Simulierte Reaktionserfassung ist eingeschaltet.'
            : 'Kamera aus. Keine Reaktionserfassung.'}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            to="/feed/visual"
            className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#10203f] hover:bg-white/90"
          >
            {PLATFORM_NAME} öffnen
          </Link>
          <Link
            to="/settings"
            className="rounded-full border border-white/30 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
          >
            Erweiterung verwalten
          </Link>
        </div>
      </section>

      {/* ---- app grid ------------------------------------------------- */}
      <h2 className="sr-only">Apps auf diesem simulierten Telefon</h2>

      <div className="mt-7 grid grid-cols-4 gap-x-4 gap-y-6">
        <AppIcon
          to="/feed/visual"
          label={PLATFORM_NAME}
          className="platform-gradient text-white"
        >
          <Camera aria-hidden="true" className="size-7" />
        </AppIcon>

        <AppIcon to="/overview" label="ContextLens" className="bg-assist text-assist-on">
          <LensGlyph className="size-7" />
        </AppIcon>

        <DecorativeIcon label="Kamera" className="bg-[#3d4450] text-white">
          <Camera className="size-7" />
        </DecorativeIcon>
        <DecorativeIcon label="Nachrichten" className="bg-[#2fa84f] text-white">
          <MessageCircle className="size-7" />
        </DecorativeIcon>
        <DecorativeIcon label="Musik" className="bg-[#d6395c] text-white">
          <Music className="size-7" />
        </DecorativeIcon>
        <DecorativeIcon label="Karten" className="bg-[#2f7de0] text-white">
          <Compass className="size-7" />
        </DecorativeIcon>
        <DecorativeIcon label="Notizen" className="bg-[#e0a92f] text-white">
          <NotebookPen className="size-7" />
        </DecorativeIcon>
        <DecorativeIcon label="Wetter" className="bg-[#3b7bb5] text-white">
          <Cloud className="size-7" />
        </DecorativeIcon>
      </div>

      <p className="sr-only">
        Bis auf {PLATFORM_NAME} und ContextLens sind alle Symbole auf diesem
        Startbildschirm dekorativ und haben keine Funktion.
      </p>

      {/* ---- dock ----------------------------------------------------- */}
      <div className="mt-auto pt-8">
        <div className="flex items-center justify-around rounded-[1.75rem] border border-white/15 bg-black/30 p-3 backdrop-blur-md">
          <DecorativeIcon label="Telefon" inDock className="bg-[#2fa84f] text-white">
            <Phone className="size-7" />
          </DecorativeIcon>
          <DecorativeIcon label="Kalender" inDock className="bg-white text-[#d6395c]">
            <Calendar className="size-7" />
          </DecorativeIcon>
          <DecorativeIcon label="Musik" inDock className="bg-[#d6395c] text-white">
            <Music className="size-7" />
          </DecorativeIcon>
          <AppIcon
            to="/feed/visual"
            label={PLATFORM_NAME}
            inDock
            className="platform-gradient text-white"
          >
            <Camera aria-hidden="true" className="size-7" />
          </AppIcon>
        </div>

        <p className="mt-4 text-center">
          <Link
            to="/"
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white/70 underline underline-offset-4 hover:text-white"
          >
            Demo verlassen und zur Projektseite
          </Link>
        </p>
      </div>
    </div>
  );
}

/** A lens: outer ring plus focal dot. Matches the ContextLens wordmark. */
function LensGlyph({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </svg>
  );
}

const TILE =
  'flex size-14 items-center justify-center rounded-[1.15rem] shadow-lg shadow-black/30';

function AppIcon({
  to,
  label,
  className,
  children,
  inDock = false,
}: {
  to: string;
  label: string;
  className: string;
  children: React.ReactNode;
  inDock?: boolean;
}) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center gap-1.5 rounded-2xl hover:opacity-90"
    >
      <span aria-hidden="true" className={`${TILE} ${className}`}>
        {children}
      </span>
      <span
        className={`w-16 truncate text-center text-[0.6875rem] font-medium text-white ${
          inDock ? 'sr-only' : ''
        }`}
      >
        {label}
      </span>
    </Link>
  );
}

/**
 * Scenery icon. Not focusable, not announced: a control that does nothing is
 * worse than no control, and eight of them would bury the two that matter.
 */
function DecorativeIcon({
  label,
  className,
  children,
  inDock = false,
}: {
  label: string;
  className: string;
  children: React.ReactNode;
  inDock?: boolean;
}) {
  return (
    <div aria-hidden="true" className="flex flex-col items-center gap-1.5">
      <span className={`${TILE} ${className}`}>{children}</span>
      {inDock ? null : (
        <span className="w-16 truncate text-center text-[0.6875rem] font-medium text-white/70">
          {label}
        </span>
      )}
    </div>
  );
}
