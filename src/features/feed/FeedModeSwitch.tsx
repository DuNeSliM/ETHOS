import { Images, MessagesSquare } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const MODES = [
  {
    to: '/feed/visual',
    label: 'Visual Feed',
    hint: 'Kurzvideos und Bilder',
    icon: Images,
  },
  {
    to: '/feed/discussion',
    label: 'Discussion Feed',
    hint: 'Textbeiträge und Threads',
    icon: MessagesSquare,
  },
] as const;

/**
 * Switch between the two simulated content views, styled as the segmented
 * control such apps put under their header.
 *
 * A visible pair of tabs rather than a single toggle, so the second mode is
 * discoverable without interacting first - test participants should not have to
 * guess that a discussion feed exists.
 *
 * The active tab is marked three times over: a filled pill, a heavier weight
 * and `aria-current`. Never by colour alone.
 */
export function FeedModeSwitch() {
  return (
    <nav aria-label="Ansicht wechseln">
      <ul className="flex gap-1 rounded-full bg-surface-2 p-1">
        {MODES.map(({ to, label, hint, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className={({ isActive }) => `
                flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5
                text-sm transition-colors
                ${
                  isActive
                    ? 'bg-surface font-bold text-ink panel-shadow'
                    : 'font-medium text-muted hover:text-ink'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    aria-hidden="true"
                    className="size-4 shrink-0"
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className="truncate">{label}</span>
                  <span className="sr-only">
                    {isActive ? ` – aktive Ansicht. ${hint}.` : ` – ${hint}.`}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
