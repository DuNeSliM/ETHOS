import {
  ArrowLeft,
  ArrowRight,
  CameraOff,
  Check,
  Eye,
  MessageSquareQuote,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAppState } from '@/app/AppStateProvider';
import { Logo } from '@/components/Logo';
import { Toggle } from '@/components/Toggle';
import { Button, Chip, Panel, SimulatedBadge } from '@/components/primitives';

type Step = {
  icon: typeof Eye;
  title: string;
  body: string;
  points: string[];
};

const STEPS: Step[] = [
  {
    icon: Eye,
    title: 'Emotionale und soziale Signale verständlicher machen',
    body:
      'ETHOS liegt als zusätzliche Schicht über Instagram- und Reddit-Mocks. Zu jedem unterstützten Beitrag gibt es einen kleinen Button „Kontext erklären“. Erst wenn du ihn antippst, erscheint eine Erklärung.',
    points: [
      'Nichts wird automatisch über den Inhalt gelegt.',
      'Die Assistenz ist optisch klar von den Beiträgen getrennt.',
      'Du kannst sie jederzeit pausieren.',
    ],
  },
  {
    icon: MessageSquareQuote,
    title: 'Sarkasmus und mögliche Absichten erklären',
    body:
      'Die Assistenzkarte nennt einen wahrscheinlichen Ton, mögliche Absichten und woran sie das festmacht. Sie sagt außerdem, wie sicher die Einschätzung ist und was sie nicht wissen kann.',
    points: [
      'Formulierungen bleiben vorsichtig: „wahrscheinlich“, „möglicherweise“.',
      'Jede Karte zeigt eine Sicherheitsstufe und ihre Grenzen.',
      'Du kannst widersprechen: „Nicht hilfreich“ oder „Andere Interpretation“.',
    ],
  },
  {
    icon: Users,
    title: 'Freiwillige Community-Reaktionen darstellen',
    body:
      'Für manche Beiträge siehst du, wie andere reagiert haben – aber nur Personen, die diese Funktion selbst aktiviert haben. Automatische Schätzungen und aktive Selbstauskünfte werden immer getrennt angezeigt.',
    points: [
      'Anonym und aggregiert, keine einzelnen Personen.',
      'Die Gruppe muss nicht repräsentativ sein, das steht auch dabei.',
      'Für diesen Prototyp sind alle Werte erfunden.',
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Datenschutz und Kontrolle',
    body:
      'Alle Daten bleiben in diesem Browser. Es gibt keinen Server, keine Anmeldung und keine Übertragung. Du kannst jeden Eintrag einzeln oder alles auf einmal löschen.',
    points: [
      'Die simulierte Kameraerfassung ist standardmäßig ausgeschaltet.',
      'Speicherung nur lokal, jederzeit löschbar.',
      'Ein Datenschutz-Dashboard zeigt dir laufend, was aktiv ist.',
    ],
  },
];

/**
 * Four-step intro followed by an explicit consent step.
 *
 * The consent step is not skippable by pressing "next" past it: it is the last
 * step, and its switches start in the state we can defend by default (camera
 * off, sharing off).
 */
export function OnboardingPage() {
  const navigate = useNavigate();
  const { settings, updateSetting, setOnboardingDone } = useAppState();
  const [index, setIndex] = useState(0);

  const totalSteps = STEPS.length + 1;
  const isConsentStep = index === STEPS.length;
  const step = STEPS[index];

  function finish() {
    setOnboardingDone(true);
    navigate('/phone');
  }

  return (
    <div className="app-min-h bg-canvas">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-2 px-4 py-3">
          <Logo asLink={false} />
          <Link
            to="/phone"
            onClick={() => setOnboardingDone(true)}
            className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-surface-2 hover:text-ink"
          >
            Überspringen
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        {/*
          Framed as the extension's installation, because that is what it is:
          this screen runs once, before any app is opened, and it is the only
          place consent is granted.
        */}
        <p className="text-xs font-bold uppercase tracking-wide text-assist-strong">
          ETHOS einrichten
        </p>

        {/* Progress. Text first so it does not rely on the bar being visible. */}
        <p className="mt-1 text-sm font-semibold text-faint">
          Schritt {index + 1} von {totalSteps}
        </p>
        <div
          className="mt-2 flex gap-1.5"
          role="img"
          aria-label={`Fortschritt: Schritt ${index + 1} von ${totalSteps}`}
        >
          {Array.from({ length: totalSteps }, (_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i <= index ? 'bg-assist' : 'bg-surface-3'
              }`}
            />
          ))}
        </div>

        {isConsentStep ? (
          <section aria-labelledby="consent-heading" className="mt-8">
            <h1
              id="consent-heading"
              className="text-2xl font-bold tracking-tight text-ink"
            >
              Was möchtest du aktivieren?
            </h1>
            <p className="mt-2 text-muted">
              Du kannst alles später in den Einstellungen ändern. Die beiden
              Kamerafunktionen bleiben aus, bis du sie ausdrücklich einschaltest.
            </p>

            <div className="mt-5 space-y-2.5">
              <Toggle
                label="Inhalts- und Kontextanalyse"
                description="Zeigt den Button „Kontext erklären“ an Beiträgen."
                checked={settings.contentAnalysis}
                onChange={(value) => updateSetting('contentAnalysis', value)}
              />
              <Toggle
                label="Sarkasmus- und Ironiehinweise"
                description="Hinweise, wenn ein Beitrag vermutlich nicht wörtlich gemeint ist."
                checked={settings.sarcasmHints}
                onChange={(value) => updateSetting('sarcasmHints', value)}
              />
              <Toggle
                label="Hinweise auf Polarisierung und Ragebait"
                description="Hinweise auf stark zuspitzende oder reaktionsorientierte Formulierungen."
                checked={settings.ragebaitHints}
                onChange={(value) => updateSetting('ragebaitHints', value)}
              />
              <Toggle
                label="Aggregierte Community-Reaktionen anzeigen"
                description="Anonyme, freiwillige Reaktionen anderer Personen (im Prototyp erfunden)."
                checked={settings.showCommunityReactions}
                onChange={(value) => updateSetting('showCommunityReactions', value)}
              />

              <Panel variant="muted" className="p-3">
                <div className="flex items-center gap-2">
                  <CameraOff aria-hidden="true" className="size-4 text-muted" />
                  <h2 className="text-sm font-bold text-ink">
                    Eigene Reaktionserfassung (standardmäßig aus)
                  </h2>
                </div>
                <p className="mt-1.5 text-sm text-muted">
                  Diese Funktion schätzt simuliert, welcher Gesichtsausdruck bei
                  dir sichtbar wäre. Im Prototyp wird dafür{' '}
                  <strong className="font-semibold">keine echte Kamera</strong>{' '}
                  ausgewertet – die Ergebnisse sind vorab geschrieben.
                </p>
                <div className="mt-3">
                  <Toggle
                    label="Simulierte eigene Reaktionserfassung"
                    description="Zeigt dezent eine geschätzte Ausdrucksbeschreibung an Beiträgen. Du kannst sie immer korrigieren."
                    activeNote="Aktiv. Es werden keine Bilder erzeugt, gespeichert oder übertragen."
                    checked={settings.simulatedCameraCapture}
                    onChange={(value) =>
                      updateSetting('simulatedCameraCapture', value)
                    }
                  />
                </div>
              </Panel>

              <Toggle
                label="Eigene Reaktion anonym weitergeben"
                description="Deine Reaktion würde anonym in die Community-Auswertung einfließen. Im Prototyp wird nichts gesendet."
                checked={settings.shareAnonymousReaction}
                onChange={(value) => updateSetting('shareAnonymousReaction', value)}
                disabled={!settings.simulatedCameraCapture}
                disabledReason="Erst möglich, wenn die eigene Reaktionserfassung aktiv ist."
              />
            </div>
          </section>
        ) : (
          <section aria-labelledby="step-heading" className="mt-8">
            <span
              aria-hidden="true"
              className="flex size-12 items-center justify-center rounded-xl bg-assist-tint text-assist-strong"
            >
              <step.icon className="size-6" />
            </span>

            <h1
              id="step-heading"
              className="mt-4 text-2xl font-bold tracking-tight text-ink"
            >
              {step.title}
            </h1>
            <p className="mt-3 text-muted">{step.body}</p>

            <ul className="mt-5 space-y-2">
              {step.points.map((point) => (
                <li key={point} className="flex gap-2.5 text-sm text-ink">
                  <Check
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-assist"
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            {index === 2 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                <SimulatedBadge label="Community-Werte sind erfunden" />
                <Chip tone="neutral">Getrennte Anzeige der Quellen</Chip>
              </div>
            ) : null}
          </section>
        )}

        <div className="mt-8 flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Zurück
          </Button>

          <div className="ml-auto">
            {isConsentStep ? (
              <Button variant="assist" size="lg" onClick={finish}>
                Aktivieren und Telefon öffnen
                <ArrowRight aria-hidden="true" className="size-4" />
              </Button>
            ) : (
              <Button
                variant="assist"
                size="lg"
                onClick={() => setIndex((i) => Math.min(totalSteps - 1, i + 1))}
              >
                Weiter
                <ArrowRight aria-hidden="true" className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
