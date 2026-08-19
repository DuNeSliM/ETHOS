import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Logo } from '@/components/Logo';
import { Button, Panel, SimulatedBadge } from '@/components/primitives';

const LAYERS = [
  {
    label: '1. Analyse des Inhalts',
    body:
      'Was steht im Beitrag, und wie ist es formuliert? Wahrscheinlicher Ton, mögliche Absicht, Hinweise auf Sarkasmus, sichtbare Gesichtsausdrücke in Videos, Tonfall und zuspitzende Sprache.',
    note: 'Aussage über den Beitrag – nicht über dich.',
  },
  {
    label: '2. Geschätzte Reaktion von dir',
    body:
      'Optional und nur wenn du es einschaltest: eine Beschreibung, welcher Gesichtsausdruck bei dir sichtbar wäre. Im Prototyp vollständig simuliert.',
    note: 'Eine Schätzung über Sichtbares – keine Aussage über dein Empfinden.',
  },
  {
    label: '3. Deine eigene Angabe',
    body:
      'Du kannst jederzeit selbst angeben, wie ein Beitrag auf dich gewirkt hat. Diese Angabe hat immer Vorrang vor der Schätzung.',
    note: 'Deine Angabe ersetzt die Schätzung nicht heimlich – beide bleiben sichtbar.',
  },
  {
    label: '4. Reaktionen der Community',
    body:
      'Anonyme, aggregierte Reaktionen freiwillig teilnehmender Personen. Kamera-Schätzungen und aktive Selbstauskünfte werden getrennt ausgewiesen.',
    note: 'Die Gruppe muss nicht repräsentativ sein.',
  },
];

/** Static explainer reachable from the landing page. */
export function HowItWorksPage() {
  return (
    <div className="min-h-dvh bg-canvas">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Logo />
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft aria-hidden="true" className="size-4" />
              Zurück
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <SimulatedBadge label="Prototyp – alle Ergebnisse sind vorab geschrieben" />

        <h1 className="mt-5 text-3xl font-bold tracking-tight text-ink">
          So funktioniert es
        </h1>
        <p className="mt-3 text-lg text-muted">
          ContextLens unterscheidet strikt zwischen vier Ebenen. Diese Trennung
          ist der Kern der Idee: Eine Aussage über einen Beitrag ist etwas
          völlig anderes als eine Aussage über einen Menschen.
        </p>

        <ol className="mt-8 space-y-3">
          {LAYERS.map((layer) => (
            <li key={layer.label}>
              <Panel className="p-4">
                <h2 className="text-base font-bold text-ink">{layer.label}</h2>
                <p className="mt-1.5 text-sm text-muted">{layer.body}</p>
                <p className="mt-2 border-l-2 border-assist pl-3 text-sm font-medium text-assist-strong">
                  {layer.note}
                </p>
              </Panel>
            </li>
          ))}
        </ol>

        <Panel variant="muted" as="section" className="mt-8 p-5">
          <h2 className="text-base font-bold text-ink">Grenzen der Analyse</h2>
          <p className="mt-2 text-sm text-muted">
            Sarkasmus lässt sich im Text nicht sicher erkennen. Ein
            Gesichtsausdruck sagt nicht, was jemand fühlt. Ob ein Beitrag auf
            Empörung ausgelegt ist, lässt sich von außen nicht beweisen.
            Deshalb formuliert ContextLens Vermutungen und nennt bei jeder Karte,
            was sie nicht wissen kann.
          </p>
        </Panel>

        <div className="mt-8">
          <Link to="/onboarding">
            <Button variant="assist" size="lg">
              Demo starten
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
