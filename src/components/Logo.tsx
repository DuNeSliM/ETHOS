import { Link } from 'react-router-dom';
import { EthosIcon } from '@/components/EthosIcon';
import { PRODUCT_NAME } from '@/lib/identity';

/**
 * Wordmark for the assistance layer.
 *
 * The canonical app icon is paired with a permanent "Prototyp" tag so
 * participants never lose track of the fact that this is a research build.
 */
export function Logo({
  asLink = true,
  /**
   * Where the wordmark leads. Defaults to the phone's home screen: inside the
   * demo the logo is the way back out of the ETHOS app, not the way out
   * of the demo.
   */
  to = '/phone',
}: {
  asLink?: boolean;
  to?: string;
}) {
  const content = (
    <>
      <EthosIcon className="size-8 rounded-lg" />
      <span className="min-w-0">
        <span className="block text-sm font-bold leading-tight tracking-tight text-ink">
          {PRODUCT_NAME}
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
