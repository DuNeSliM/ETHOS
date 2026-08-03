import { CircleUser, Clapperboard, House, Search, SquarePlus } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

/**
 * Tab bar of the simulated platform.
 *
 * Only "Start" leads anywhere. The other four are part of the illusion, and
 * saying so is better than either hiding them or letting them fail silently:
 * their accessible name ends in "(im Prototyp ohne Funktion)" and tapping one
 * reports that in a status message instead of doing nothing.
 *
 * Labels stay visible even though this genre usually ships an icon-only bar -
 * an icon alone is not a label, and this prototype does not trade that away
 * for resemblance.
 */
const DEAD_TABS = [
  { label: 'Suche', icon: Search },
  { label: 'Erstellen', icon: SquarePlus },
  { label: 'Reels', icon: Clapperboard },
  { label: 'Profil', icon: CircleUser },
] as const;

const ITEM =
  'flex h-full w-full flex-col items-center gap-0.5 px-1 py-2 text-[0.625rem] font-medium leading-tight';

export function PlatformTabBar({
  onUnavailable,
}: {
  onUnavailable: (label: string) => void;
}) {
  const { pathname } = useLocation();
  const homeActive = pathname.startsWith('/feed') || pathname.startsWith('/post');

  return (
    <nav
      aria-label="Navigation der simulierten App"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/98 backdrop-blur"
    >
      <ul className="mx-auto flex max-w-[30rem] items-stretch">
        <li className="flex-1">
          <NavLink
            to="/feed/visual"
            aria-current={homeActive ? 'page' : undefined}
            className={`${ITEM} ${homeActive ? 'text-ink' : 'text-faint'}`}
          >
            <House
              aria-hidden="true"
              className="size-6"
              strokeWidth={homeActive ? 2.6 : 1.8}
              fill={homeActive ? 'currentColor' : 'none'}
            />
            <span>Start</span>
          </NavLink>
        </li>

        {DEAD_TABS.map(({ label, icon: Icon }) => (
          <li key={label} className="flex-1">
            <button
              type="button"
              onClick={() => onUnavailable(label)}
              aria-label={`${label} (im Prototyp ohne Funktion)`}
              className={`${ITEM} text-faint hover:text-muted`}
            >
              <Icon aria-hidden="true" className="size-6" strokeWidth={1.8} />
              <span aria-hidden="true">{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
