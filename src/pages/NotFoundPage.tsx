import { Link } from 'react-router-dom';

import { Logo } from '@/components/Logo';
import { Button } from '@/components/primitives';

export function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-canvas px-4 text-center">
      <Logo asLink={false} />
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          Diese Seite gibt es nicht
        </h1>
        <p className="mt-2 text-muted">
          Der Prototyp kennt diese Adresse nicht. Zurück zum Feed?
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/feed/visual">
          <Button variant="assist">Zum Feed</Button>
        </Link>
        <Link to="/">
          <Button variant="secondary">Zur Startseite</Button>
        </Link>
      </div>
    </div>
  );
}
