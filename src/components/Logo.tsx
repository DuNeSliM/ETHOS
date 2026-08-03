import { Link } from 'react-router-dom';

/**
 * Wordmark for the assistance layer.
 *
 * Drawn from tokens rather than an image file so it follows the colour scheme,
 * and paired with a permanent "Prototyp" tag - participants should never lose
 * track of the fact that they are looking at a research build.
 */
export function Logo({
  asLink = true,
  /**
   * Where the wordmark leads. Defaults to the phone's home screen: inside the
   * demo the logo is the way back out of the ContextLens app, not the way out
   * of the demo.
   */
  to = '/phone',
}: {
  asLink?: boolean;
  to?: string;
}) {
  const content = (
    <>
      <span
        aria-hidden="true"
        className="
          flex size-8 shrink-0 items-center justify-center rounded-lg
          bg-assist text-assist-on
        "
      >
        {/* A lens: outer ring plus focal dot. */}
        <svg viewBox="0 0 24 24" className="size-5" fill="none">
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="2.5" fill="currentColor" />
        </svg>
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold leading-tight tracking-tight text-ink">
          ContextLens
        </span>
        <span className="block text-[0.6875rem] font-medium leading-tight text-faint">
          Prototyp · simulierte Daten
        </span>
      </span>
    </>
  );

  if (!asLink) {
    return <span className="flex items-center gap-2">{content}</span>;
  }

  return (
    <Link
      to={to}
      className="flex items-center gap-2 rounded-lg py-0.5 pr-2 hover:opacity-80"
    >
      {content}
    </Link>
  );
}
