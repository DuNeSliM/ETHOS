import {
  ArrowRight,
  BookOpen,
  HandHeart,
  MessageSquareQuote,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { useAppState } from '@/app/AppStateProvider';
import { Logo } from '@/components/Logo';
import { Button, Chip, Panel, SimulatedBadge } from '@/components/primitives';

const BENEFITS = [
  {
    icon: MessageSquareQuote,
    title: 'Sarkasmus und Ironie einordnen',
    body:
      'Wenn ein Beitrag wahrscheinlich nicht wörtlich gemeint ist, erklärt ETHOS auf Wunsch, woran das zu erkennen sein könnte.',
  },
  {
    icon: HandHeart,
    title: 'Emotionale Untertöne sichtbar machen',
    body:
      'Hinweise auf Tonfall, sichtbare Gesichtsausdrücke und emotionalisierende Sprache – als Beschreibung, nicht als Urteil.',
  },
  {
    icon: Users,
    title: 'Reaktionen anderer verstehen',
    body:
      'Anonyme, freiwillige Rückmeldungen zeigen, wie unterschiedlich derselbe Beitrag wirken kann.',
  },
  {
    icon: ShieldCheck,
    title: 'Du entscheidest, was aktiv ist',
    body:
      'Jede Funktion lässt sich einzeln einschalten, pausieren und wieder löschen. Nichts ist von Anfang an aktiv, was dich betrifft.',
  },
];

/**
 * Entry screen.
 *
 * Two jobs: explain the product in a few seconds, and set expectations about
 * what it is not (a mind reader, a finished product, a real platform).
 */
export function LandingPage() {
  const { onboardingDone } = useAppState();
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-canvas">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Logo asLink={false} />
          <Link
            to="/how-it-works"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-assist-strong hover:bg-assist-tint"
          >
            So funktioniert es
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:py-16">
        <div className="flex flex-wrap items-center gap-2">
          <SimulatedBadge label="Forschungsprototyp – alle Analysen sind simuliert" />
          <Chip tone="neutral">Keine echte KI</Chip>
          <Chip tone="neutral">Keine Verbindung zu sozialen Netzwerken</Chip>
        </div>

        <h1 className="mt-6 max-w-3xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Eine freiwillige Assistenzschicht, die soziale Signale in Beiträgen
          erklärt
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-muted">
          ETHOS legt sich auf Wunsch über Social-Media-Feeds und
          erklärt, was in einem Beitrag mitschwingen könnte: Sarkasmus, Ironie,
          emotionale Untertöne, Tonfall oder stark zuspitzende Formulierungen.
        </p>

        <Panel variant="assist" className="mt-6 max-w-2xl p-4">
          <p className="text-sm text-ink">
            <strong className="font-semibold">Für wen ist das gedacht?</strong>{' '}
            Vor allem für Menschen, denen das Deuten solcher Signale schwerfällt
            – zum Beispiel weil Ironie im Text keinen Tonfall hat oder weil
            Mimik in Videos schwer einzuordnen ist. ETHOS nimmt niemandem
            die Deutung ab. Es macht einen Vorschlag, der falsch sein kann, und
            sagt das auch.
          </p>
        </Panel>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button
            variant="assist"
            size="lg"
            // Skip the intro for a returning participant, but never skip the
            // consent screen that follows it.
            onClick={() => navigate(onboardingDone ? '/phone' : '/onboarding')}
          >
            Demo starten
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>

          <Link to="/how-it-works">
            <Button variant="secondary" size="lg">
              <BookOpen aria-hidden="true" className="size-4" />
              So funktioniert es
            </Button>
          </Link>
        </div>

        <p className="mt-3 text-sm text-faint">
          Die Demo läuft auf einem simulierten Telefon: Startbildschirm,
          inoffizielle Instagram- und Reddit-Mocks und ETHOS als Erweiterung
          darüber. Die
          Nutzung ist vollständig freiwillig – du kannst jederzeit pausieren und
          alle lokal gespeicherten Daten löschen.
        </p>

        <h2 className="mt-14 text-xl font-bold tracking-tight text-ink">
          Was die Assistenz leistet
        </h2>

        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {BENEFITS.map(({ icon: Icon, title, body }) => (
            <li key={title}>
              <Panel className="h-full p-4">
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-assist-tint text-assist-strong"
                  >
                    <Icon className="size-5" />
                  </span>
                  <h3 className="text-base font-semibold text-ink">{title}</h3>
                </div>
                <p className="mt-2 text-sm text-muted">{body}</p>
              </Panel>
            </li>
          ))}
        </ul>

        <Panel variant="muted" as="section" className="mt-10 p-5">
          <h2 className="text-base font-bold text-ink">
            Was dieser Prototyp ausdrücklich nicht ist
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li className="flex gap-2">
              <span aria-hidden="true" className="text-faint">
                –
              </span>
              <span>
                Keine echte Emotionserkennung. Alle Ergebnisse sind vorab
                geschriebene Beispiele.
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden="true" className="text-faint">
                –
              </span>
              <span>
                Keine Verbindung zu Instagram, TikTok, Reddit oder YouTube. Der
                Feed ist erfunden.
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden="true" className="text-faint">
                –
              </span>
              <span>
                Keine Aussage darüber, was eine Person wirklich denkt oder
                fühlt. Auch nicht über dich.
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden="true" className="text-faint">
                –
              </span>
              <span>
                Kein Server, keine Konten, keine Datenübertragung. Alles bleibt
                in diesem Browser.
              </span>
            </li>
          </ul>
        </Panel>
      </main>
    </div>
  );
}
