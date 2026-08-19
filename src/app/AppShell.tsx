import {
  ClipboardList,
  LayoutList,
  Moon,
  ScanFace,
  Settings2,
  ShieldCheck,
  Sun,
} from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import { useAppState } from '@/app/AppStateProvider';
import { StatusBar } from '@/components/StatusBar';
import { Logo } from '@/components/Logo';
import { ResearchBanner } from '@/features/research-mode/ResearchBanner';
import { PLATFORM_NAME } from '@/features/social-app/platform';
import { scrollAppToTop } from '@/lib/viewport';

/**
 * `match` is the path prefix that keeps a nav item highlighted. The feed entry
 * points at the visual feed but must stay active in the discussion feed and on
 * a post detail page too, otherwise the whole nav reads as "nothing selected".
 */
const NAV_ITEMS = [
  { to: '/feed/visual', match: ['/feed', '/post'], label: 'Feed', icon: LayoutList },
  { to: '/overview', match: ['/overview'], label: 'Übersicht', icon: ClipboardList },
  { to: '/privacy', match: ['/privacy'], label: 'Datenschutz', icon: ShieldCheck },
  { to: '/settings', match: ['/settings'], label: 'Einstellungen', icon: Settings2 },
  { to: '/research', match: ['/research'], label: 'Research', icon: ScanFace },
] as const;

/**
 * Chrome of the ContextLens app itself.
 *
 * Two apps run on the simulated phone. `SocialAppShell` is the platform the
 * assistance layer lies over; this one is where the participant manages the
 * assistance layer - history, privacy, consent switches, research mode. It
 * wears the teal `assist` family throughout, so switching between the two is
 * unmistakable even at a glance from the back of a room.
 *
 * Laid out phone-first: one column, controls at thumb height, a tab bar that
 * does not change between breakpoints. The first tab leads back out into the
 * platform.
 */
export function AppShell() {
  const { settings, updateSetting } = useAppState();
  const location = useLocation();

  // Move the view to the top on navigation - the phone screen scrolls, not the
  // window, so this cannot be left to the browser.
  useEffect(() => {
    scrollAppToTop();
  }, [location.pathname]);

  const isDark =
    settings.theme === 'dark' ||
    (settings.theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-color-scheme: dark)').matches);

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

      <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-[34rem] items-center gap-2 px-3 py-2">
          <Logo />

          <button
            type="button"
            onClick={() => updateSetting('theme', isDark ? 'light' : 'dark')}
            aria-pressed={isDark}
            className="
              ml-auto flex shrink-0 items-center gap-1.5 rounded-lg border
              border-line px-2.5 py-2 text-xs font-medium text-muted
              hover:bg-surface-2 hover:text-ink
            "
          >
            {isDark ? (
              <Sun aria-hidden="true" className="size-4" />
            ) : (
              <Moon aria-hidden="true" className="size-4" />
            )}
            {isDark ? 'Hell' : 'Dunkel'}
          </button>
        </div>

        <StatusBar />
        <ResearchBanner />
      </header>

      <main id="main" className="flex-1 pb-24">
        <div className="mx-auto w-full max-w-[34rem] px-3 pt-4">
          <Outlet />
        </div>
      </main>

      {/*
        Tab bar. Labels stay visible - icons alone are not enough - and the
        active tab carries a bar under it so the state is not colour-only.
      */}
      <nav
        aria-label="Navigation von ContextLens"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-assist-line bg-surface/98 backdrop-blur"
      >
        <ul className="mx-auto flex max-w-[34rem] items-stretch">
          {NAV_ITEMS.map(({ to, match, label, icon: Icon }) => {
            const isActive = match.some((prefix) =>
              location.pathname.startsWith(prefix),
            );
            return (
              <li key={to} className="flex-1">
                <NavLink
                  to={to}
                  aria-current={isActive ? 'page' : undefined}
                  className={`
                    flex h-full flex-col items-center gap-0.5 px-0.5 py-2
                    text-center text-[0.625rem] font-medium leading-tight
                    ${isActive ? 'text-assist-strong' : 'text-muted'}
                  `}
                >
                  <Icon
                    aria-hidden="true"
                    className={`size-5 ${isActive ? 'text-assist' : ''}`}
                  />
                  <span>{label}</span>
                  {/* Non-colour indicator of the active tab. */}
                  <span
                    aria-hidden="true"
                    className={`h-0.5 w-6 rounded-full ${
                      isActive ? 'bg-assist' : 'bg-transparent'
                    }`}
                  />
                </NavLink>
              </li>
            );
          })}
        </ul>

        <p className="sr-only">
          Der erste Eintrag führt zurück in die simulierte App {PLATFORM_NAME}.
        </p>
      </nav>
    </div>
  );
}
