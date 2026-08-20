import {
  Bell,
  CircleUser,
  Flame,
  House,
  MessageCircle,
  Plus,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import { PluginOverlay, PluginStatusStrip } from '@/features/plugin/PluginOverlay';
import { LiveSelfView } from '@/features/reactions/LiveSelfView';
import { ResearchBanner } from '@/features/research-mode/ResearchBanner';
import { SOCIAL_PLATFORMS } from '@/lib/identity';
import { scrollAppToTop } from '@/lib/viewport';

const UNAVAILABLE_TABS = [
  { label: 'Beliebt', icon: Flame },
  { label: 'Erstellen', icon: Plus },
  { label: 'Chat', icon: MessageCircle },
  { label: 'Postfach', icon: Bell },
] as const;

export function RedditAppShell() {
  const location = useLocation();
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number | undefined>(undefined);

  useEffect(() => scrollAppToTop(), [location.pathname]);
  useEffect(() => () => window.clearTimeout(noticeTimer.current), []);

  function reportUnavailable(label: string) {
    setNotice(`„${label}“ gibt es in diesem Prototyp nicht.`);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 4000);
  }

  return (
    <div className="reddit-skin app-min-h flex flex-col bg-canvas">
      <a
        href="#main"
        className="sr-only-focusable absolute left-4 top-4 z-50 rounded-lg bg-assist px-4 py-2 text-sm font-semibold text-assist-on"
      >
        Direkt zum Inhalt springen
      </a>

      <div className="sticky top-0 z-30">
        <header className="border-b border-line bg-surface/95 backdrop-blur">
          <div className="mx-auto flex max-w-[30rem] items-center gap-2 px-3 py-2">
            <Link
              to="/phone"
              aria-label="Zum Smartphone-Startbildschirm"
              className="rounded-md p-1.5 text-ink hover:bg-surface-2"
            >
              <House aria-hidden="true" className="size-5" />
            </Link>
            <span aria-hidden="true" className="flex size-8 items-center justify-center rounded-full bg-alert text-inverse">
              <MessageCircle className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-lg font-bold leading-none text-ink">Reddit</p>
              <p className="text-[0.625rem] font-semibold uppercase tracking-wide text-faint">
                inoffizieller Mock
              </p>
            </div>
            <button
              type="button"
              onClick={() => reportUnavailable('Profil')}
              aria-label="Profil (im Prototyp ohne Funktion)"
              className="ml-auto rounded-md p-1.5 text-muted hover:bg-surface-2"
            >
              <CircleUser aria-hidden="true" className="size-6" />
            </button>
          </div>
        </header>
        <PluginStatusStrip />
        <ResearchBanner />
      </div>

      <main id="main" className="flex-1 pb-24">
        <div className="mx-auto w-full max-w-[30rem]">
          <Outlet />
        </div>
      </main>

      <LiveSelfView />
      <PluginOverlay platform="reddit" />

      <nav aria-label="Navigation des Reddit-Mocks" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/98 backdrop-blur">
        <ul className="mx-auto flex max-w-[30rem] items-stretch">
          <li className="flex-1">
            <Link to="/reddit" aria-current="page" className="flex h-full flex-col items-center gap-0.5 px-1 py-2 text-[0.625rem] font-semibold text-alert">
              <House aria-hidden="true" className="size-5" fill="currentColor" />
              Start
            </Link>
          </li>
          {UNAVAILABLE_TABS.map(({ label, icon: Icon }) => (
            <li key={label} className="flex-1">
              <button
                type="button"
                onClick={() => reportUnavailable(label)}
                aria-label={`${label} (im Prototyp ohne Funktion)`}
                className="flex h-full w-full flex-col items-center gap-0.5 px-1 py-2 text-[0.625rem] font-medium text-faint hover:text-muted"
              >
                <Icon aria-hidden="true" className="size-5" />
                <span aria-hidden="true">{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <p role="status" className={notice ? 'fixed bottom-32 left-1/2 z-40 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-center text-xs font-semibold text-inverse panel-shadow' : 'sr-only'}>
        {notice}
      </p>
      <p className="sr-only">{SOCIAL_PLATFORMS.reddit.mockNotice}.</p>
    </div>
  );
}
