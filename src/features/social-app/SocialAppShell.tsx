import { Heart, Send } from 'lucide-react';
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

import { FeedModeSwitch } from '@/features/feed/FeedModeSwitch';
import { PluginOverlay, PluginStatusStrip } from '@/features/plugin/PluginOverlay';
import { PlatformTabBar } from '@/features/social-app/PlatformTabBar';
import { PlatformWordmark } from '@/features/social-app/PlatformWordmark';
import { PLATFORM_NAME } from '@/features/social-app/platform';
import { LiveSelfView } from '@/features/reactions/LiveSelfView';
import { ResearchBanner } from '@/features/research-mode/ResearchBanner';
import { scrollAppToTop } from '@/lib/viewport';

/**
 * Chrome of the simulated platform: everything a photo-sharing app puts around
 * its content, and nothing of ContextLens.
 *
 * The separation is the point. The header, the tab bar and the feed underneath
 * belong to `Momento`; the strip below the header and the floating button
 * belong to the assistance layer and keep the teal token family in a screen
 * that is otherwise black on white. A participant should be able to say which
 * pixels belong to whom without being told.
 */
export function SocialAppShell() {
  const location = useLocation();
  const isFeed = location.pathname.startsWith('/feed');
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    scrollAppToTop();
  }, [location.pathname]);

  useEffect(() => () => window.clearTimeout(noticeTimer.current), []);

  function reportUnavailable(label: string) {
    setNotice(`„${label}“ gibt es in diesem Prototyp nicht.`);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 4000);
  }

  return (
    <div className="app-min-h flex flex-col bg-canvas">
      <a
        href="#main"
        className="
          sr-only-focusable absolute left-4 top-4 z-50 rounded-lg bg-assist
          px-4 py-2 text-sm font-semibold text-assist-on
        "
      >
        Direkt zum Inhalt springen
      </a>

      {/*
        Platform header and assistance strip are pinned together: "is the
        camera on right now?" has to be answerable at any scroll position, not
        only at the top of the feed.
      */}
      <div className="sticky top-0 z-30">
        <header className="bg-surface/95 backdrop-blur">
          <div className="mx-auto flex max-w-[30rem] items-center gap-1 px-3 py-2">
            <PlatformWordmark />

            <button
              type="button"
              onClick={() => reportUnavailable('Aktivität')}
              aria-label="Aktivität (im Prototyp ohne Funktion)"
              className="ml-auto rounded-md p-1.5 text-ink hover:bg-surface-2"
            >
              <Heart aria-hidden="true" className="size-6" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              onClick={() => reportUnavailable('Direktnachrichten')}
              aria-label="Direktnachrichten (im Prototyp ohne Funktion)"
              className="rounded-md p-1.5 text-ink hover:bg-surface-2"
            >
              <Send aria-hidden="true" className="size-6" strokeWidth={1.8} />
            </button>
          </div>

          {/* The view switch belongs to the feed. A detail page is one level
              deeper and carries its own way back. */}
          {isFeed ? (
            <div className="mx-auto max-w-[30rem] px-3 pb-2">
              <FeedModeSwitch />
            </div>
          ) : null}
        </header>

        {/* Assistance layer, between the platform and the participant. */}
        <PluginStatusStrip />
        <ResearchBanner />
      </div>

      <main id="main" className="flex-1 pb-24">
        <div className="mx-auto w-full max-w-[30rem]">
          <Outlet />
        </div>
      </main>

      {/*
        Both belong to the assistance layer, pinned over the platform: the
        self-view on the left says what the camera sees, the bubble on the
        right is the way into the extension.
      */}
      <LiveSelfView />
      <PluginOverlay />

      {/*
        One live region that is always mounted - swapping the element in and
        out would leave assistive technology nothing to observe. Only its
        content and its styling change.
      */}
      <p
        role="status"
        className={
          notice
            ? `
              fixed bottom-32 left-1/2 z-40 -translate-x-1/2 rounded-full bg-ink
              px-4 py-2 text-center text-xs font-semibold text-inverse
              panel-shadow
            `
            : 'sr-only'
        }
      >
        {notice}
      </p>

      <PlatformTabBar onUnavailable={reportUnavailable} />

      <p className="sr-only">
        {PLATFORM_NAME} ist eine erfundene App. Alle Beiträge, Konten und Zahlen
        darin sind Beispieldaten dieses Prototyps.
      </p>
    </div>
  );
}
