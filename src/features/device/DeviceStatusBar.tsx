import { useEffect, useState } from 'react';

import { useSettings } from '@/app/AppStateProvider';
import { EthosIcon } from '@/components/EthosIcon';

/**
 * The operating system's status bar of the simulated phone.
 *
 * Scenery, with one functional exception: the small ETHOS pill on the left is
 * how a system-wide extension announces itself on a real phone, and it is what
 * makes ETHOS legible as a *plugin over* the platform rather than as a
 * feature of it. It mirrors the same state the assistance layer reports
 * everywhere else, so it can never claim the analysis is running when it is
 * paused.
 */
export function DeviceStatusBar({ onWallpaper = false }: { onWallpaper?: boolean }) {
  const settings = useSettings();
  const [now, setNow] = useState(() => new Date());

  // A real clock rather than the frozen "9:41" of a marketing mockup - the
  // demo should feel like a device someone is holding.
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const ethosActive = settings.contentAnalysis && !settings.assistantPaused;
  const clock = now.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`
        relative z-40 hidden shrink-0 items-center px-6 pb-1 pt-2.5 text-xs
        font-semibold lg:flex
        ${onWallpaper ? 'text-white' : 'bg-surface text-ink'}
      `}
    >
      <span className="tabular-nums">{clock}</span>

      {/* Dynamic island. Sits in the flow so the clock and icons flank it. */}
      <span
        aria-hidden="true"
        className="mx-auto h-6 w-24 rounded-full bg-[#05070a]"
      />

      <span className="flex items-center gap-1.5">
        {ethosActive ? (
          <span
            className="flex items-center gap-1 rounded-full bg-assist-tint-2 px-1.5 py-0.5"
            title="ETHOS ist als Systemerweiterung aktiv"
          >
            <EthosIcon className="size-3 rounded-[0.2rem]" />
            <span className="sr-only">
              ETHOS ist als Systemerweiterung aktiv
            </span>
          </span>
        ) : null}

        {/* Signal, WLAN and battery, drawn rather than imported so they follow
            the text colour of the bar. */}
        <svg viewBox="0 0 18 12" className="h-3 w-[1.125rem]" aria-hidden="true">
          {[0, 1, 2, 3].map((bar) => (
            <rect
              key={bar}
              x={bar * 4.5}
              y={9 - bar * 3}
              width="3"
              height={3 + bar * 3}
              rx="1"
              fill="currentColor"
            />
          ))}
        </svg>

        <svg viewBox="0 0 16 12" className="h-3 w-4" aria-hidden="true">
          <path
            d="M1 4.2a10 10 0 0 1 14 0M3.6 7a6.4 6.4 0 0 1 8.8 0"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="8" cy="10" r="1.3" fill="currentColor" />
        </svg>

        <svg viewBox="0 0 26 12" className="h-3 w-6" aria-hidden="true">
          <rect
            x="0.75"
            y="0.75"
            width="21"
            height="10.5"
            rx="3"
            stroke="currentColor"
            strokeWidth="1.2"
            opacity="0.6"
            fill="none"
          />
          <rect x="2.5" y="2.5" width="15" height="7" rx="1.8" fill="currentColor" />
          <path
            d="M23.5 4.2v3.6a2 2 0 0 0 0-3.6Z"
            fill="currentColor"
            opacity="0.6"
          />
        </svg>
      </span>
    </div>
  );
}
