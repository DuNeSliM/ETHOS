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
 * Switch between the two simulated content views.
 *
 * A visible pair of tabs rather than a single toggle, so the second mode is
 * discoverable without interacting first - test participants should not have to
 * guess that a discussion feed exists.
 */
export function FeedModeSwitch() {
  return (
    <nav aria-label="Ansicht wechseln">
      <ul className="flex gap-2">
        {MODES.map(({ to, label, hint, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className={({ isActive }) => `
                flex h-full flex-col gap-0.5 rounded-xl border px-3 py-2.5
                transition-colors
                ${
                  isActive
                    ? 'border-assist bg-assist-tint'
                    : 'border-line bg-surface hover:bg-surface-2'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <span className="flex items-center gap-2">
                    <Icon
                      aria-hidden="true"
                      className={`size-4 ${isActive ? 'text-assist-strong' : 'text-muted'}`}
                    />
                    <span
                      className={`text-sm font-semibold ${
                        isActive ? 'text-assist-strong' : 'text-ink'
                      }`}
                    >
                      {label}
                    </span>
                    {/* Text marker so the active tab is not colour-only. */}
                    {isActive ? (
                      <span className="ml-auto text-[0.625rem] font-bold uppercase tracking-wide text-assist-strong">
                        aktiv
                      </span>
                    ) : null}
                  </span>
                  <span className="text-xs text-muted">{hint}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
