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
  { to: '/research', match: ['/research'], label: 'Research Mode', icon: ScanFace },
] as const;

/**
 * Application chrome shared by every screen inside the demo.
 *
 * The chrome belongs to the ASSISTANCE LAYER, not to the simulated platform,
 * and is styled accordingly - the feed content inside `<Outlet />` deliberately
 * looks like a different product.
 */
export function AppShell() {
  const { settings, updateSetting } = useAppState();
  const location = useLocation();

  // Move the viewport to the top on navigation. Without this, going from a
  // long feed into a settings screen can open scrolled halfway down.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  const isDark =
    settings.theme === 'dark' ||
    (settings.theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-color-scheme: dark)').matches);

  return (
    <div className="min-h-dvh bg-canvas">
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
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
          <Logo />

          <nav aria-label="Hauptnavigation" className="ml-auto hidden md:block">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map(({ to, match, label, icon: Icon }) => {
                const isActive = match.some((prefix) =>
                  location.pathname.startsWith(prefix),
                );
                return (
                  <li key={to}>
                    <NavLink
                      to={to}
                      aria-current={isActive ? 'page' : undefined}
                      className={`
                        flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium
                        transition-colors
                        ${
                          isActive
                            ? 'bg-assist-tint text-assist-strong'
                            : 'text-muted hover:bg-surface-2 hover:text-ink'
                        }
                      `}
                    >
                      <Icon aria-hidden="true" className="size-4" />
                      {label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => updateSetting('theme', isDark ? 'light' : 'dark')}
            aria-pressed={isDark}
            className="
              ml-auto flex items-center gap-1.5 rounded-lg border border-line px-2.5
              py-2 text-xs font-medium text-muted hover:bg-surface-2 hover:text-ink
              md:ml-0
            "
          >
            {isDark ? (
              <Sun aria-hidden="true" className="size-4" />
            ) : (
              <Moon aria-hidden="true" className="size-4" />
            )}
            {isDark ? 'Helles Design' : 'Dunkles Design'}
          </button>
        </div>

        <StatusBar />
        <ResearchBanner />
      </header>

      <main id="main" className="mx-auto max-w-6xl px-4 pb-28 pt-4 md:pb-12">
        <Outlet />
      </main>

      {/* Mobile navigation. Labels stay visible - icons alone are not enough. */}
      <nav
        aria-label="Hauptnavigation"
        className="
          fixed bottom-0 left-0 right-0 z-30 border-t border-line
          bg-surface/98 backdrop-blur md:hidden
        "
      >
        <ul className="mx-auto flex max-w-2xl items-stretch">
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
                    flex h-full flex-col items-center gap-0.5 px-1 py-2 text-center
                    text-[0.6875rem] font-medium leading-tight
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
      </nav>
    </div>
  );
}
