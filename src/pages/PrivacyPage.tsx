import {
  Camera,
  CameraOff,
  Check,
  Download,
  HardDrive,
  Minus,
  RotateCcw,
  ScanText,
  Share2,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

import { useAppState } from '@/app/AppStateProvider';
import {
  Button,
  Chip,
  FieldLabel,
  Panel,
  SimulatedBadge,
} from '@/components/primitives';
import { downloadFile, snapshotAll, timestampSlug } from '@/lib/storage';

/**
 * Privacy dashboard.
 *
 * One screen that answers "what is on, where is it, and how do I get rid of
 * it" without the participant having to interpret settings toggles. The state
 * rows are read-only mirrors of the settings, deliberately phrased as claims
 * about the system rather than as controls.
 */
export function PrivacyPage() {
  const {
    settings,
    deleteAllData,
    resetDemo,
    history,
    reactions,
    engagements,
    research,
  } = useAppState();
  const [confirming, setConfirming] = useState<null | 'data' | 'demo'>(null);
  const [status, setStatus] = useState('');

  const rows = [
    {
      icon: ScanText,
      label: 'Inhaltsanalyse',
      active: settings.contentAnalysis && !settings.assistantPaused,
      detail:
        'Bewertet nur den Text und die beschriebenen Medien eines Beitrags. Keine Aussage über dich.',
    },
    {
      icon: Camera,
      label: 'Eigene Reaktionserfassung (simuliert)',
      active: settings.simulatedCameraCapture && !settings.assistantPaused,
      detail:
        'Wenn aktiv, zeigt der Prototyp vorab geschriebene Schätzungen. Es findet keine echte Erkennung statt.',
    },
    {
      icon: settings.liveCameraPreview ? Camera : CameraOff,
      label: 'Kamera-Vorschau (nur Anzeige)',
      active: settings.liveCameraPreview,
      detail:
        'Zeigt bei Bedarf das Kamerabild lokal an. Es werden keine Bilder gelesen, gespeichert oder gesendet.',
    },
    {
      icon: HardDrive,
      label: 'Lokale Speicherung von Verlauf und Interaktionen',
      active: settings.storeReactionHistory,
      detail:
        'Speichert Verlauf, eigene Angaben, Likes, Upvotes und gemerkte Beiträge im localStorage dieses Browsers. Kein Server beteiligt.',
    },
    {
      icon: Share2,
      label: 'Teilen aggregierter Reaktionen',
      active: settings.shareAnonymousReaction,
      detail:
        'Im Prototyp folgenlos: es gibt keinen Empfänger. In einem echten Produkt würde hier anonym aggregiert.',
    },
  ];

  function exportJson() {
    const payload = {
      exportedAt: new Date().toISOString(),
      note:
        'Export aus dem ETHOS-Prototyp. Alle Analyse- und Schätzwerte sind simuliert und wurden nicht gemessen.',
      settings,
      // The live values are included even when persistence is disabled. The
      // stored snapshot additionally retains feedback and onboarding metadata.
      data: {
        ...snapshotAll(),
        history,
        reactions,
        engagements,
        research,
      },
    };
    downloadFile(
      `ethos-daten-${timestampSlug()}.json`,
      JSON.stringify(payload, null, 2),
      'application/json',
    );
    setStatus('Export als JSON-Datei gestartet.');
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          Datenschutz-Dashboard
        </h1>
        <SimulatedBadge label="Prototyp" />
      </div>
      <p className="mt-2 text-muted">
        Was ist aktiv, wo liegen die Daten, und wie wirst du sie wieder los.
      </p>

      {/* ---- local processing claim --------------------------------- */}
      <Panel variant="assist" className="mt-5 p-4">
        <h2 className="text-base font-bold text-ink">
          Verarbeitung ausschließlich lokal
        </h2>
        <p className="mt-1.5 text-sm text-ink">
          Dieser Prototyp hat kein Backend, keine Datenbank, keine Anmeldung und
          keine Verbindung zu sozialen Netzwerken. Es verlässt nichts diesen
          Browser. Alles, was gespeichert wird, liegt im{' '}
          <code className="rounded bg-surface px-1 py-0.5 text-xs">
            localStorage
          </code>{' '}
          dieses Geräts.
        </p>
      </Panel>

      {/* ---- state rows -------------------------------------------- */}
      <section className="mt-6" aria-labelledby="state-heading">
        <h2
          id="state-heading"
          className="text-lg font-bold tracking-tight text-ink"
        >
          Aktueller Zustand
        </h2>
        <ul className="mt-3 space-y-2">
          {rows.map(({ icon: Icon, label, active, detail }) => (
            <li key={label}>
              <Panel className="p-3.5">
                <div className="flex items-start gap-3">
                  <Icon
                    aria-hidden="true"
                    className={`mt-0.5 size-5 shrink-0 ${
                      active ? 'text-assist-strong' : 'text-faint'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-ink">{label}</h3>
                      {/*
                        State is carried by an icon plus a word, never colour
                        alone.
                      */}
                      <Chip
                        tone={active ? 'assist' : 'neutral'}
                        icon={
                          active ? (
                            <Check aria-hidden="true" className="size-3.5" />
                          ) : (
                            <Minus aria-hidden="true" className="size-3.5" />
                          )
                        }
                      >
                        {active ? 'aktiv' : 'inaktiv'}
                      </Chip>
                    </div>
                    <p className="mt-1 text-sm text-muted">{detail}</p>
                  </div>
                </div>
              </Panel>
            </li>
          ))}
        </ul>

        <Link to="/ethos/settings" className="mt-3 inline-block">
          <Button>Einstellungen ändern</Button>
        </Link>
      </section>

      {/* ---- what is simulated ------------------------------------- */}
      <Panel variant="muted" as="section" className="mt-6 p-4">
        <FieldLabel>Was in diesem Prototyp simuliert ist</FieldLabel>
        <ul className="mt-2 space-y-1.5 text-sm text-muted">
          {[
            'Alle Inhaltsanalysen: Ton, Sarkasmus, Absicht, Polarisierung. Vorab geschrieben, nicht berechnet.',
            'Alle Schätzungen deines Gesichtsausdrucks. Es wird kein Kamerabild ausgewertet.',
            'Alle Community-Reaktionen und Teilnehmerzahlen. Frei erfunden.',
            'Alle Reaktionsverläufe unter Videos. Fest hinterlegte Beispiele.',
            'Alle Beiträge, Konten, Communities und Interaktionszahlen im Feed.',
          ].map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-sim" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted">
          Echt sind nur: deine Einstellungen, dein Verlauf, deine Likes,
          Upvotes und gespeicherten Beiträge, deine eigenen Angaben und deine
          Research-Mode-Antworten – alle lokal.
        </p>
      </Panel>

      {/* ---- stored volume ----------------------------------------- */}
      <Panel as="section" className="mt-6 p-4">
        <FieldLabel>Aktuell gespeichert</FieldLabel>
        <ul className="mt-2 space-y-1 text-sm text-muted">
          <li>{history.length} Verlaufseinträge</li>
          <li>{Object.keys(reactions).length} Reaktionsdatensätze</li>
          <li>{Object.keys(engagements).length} Interaktionsdatensätze</li>
          <li>{research.length} Research-Mode-Ergebnisse</li>
        </ul>
      </Panel>

      {/* ---- actions ------------------------------------------------ */}
      <section className="mt-6" aria-labelledby="actions-heading">
        <h2
          id="actions-heading"
          className="text-lg font-bold tracking-tight text-ink"
        >
          Deine Daten
        </h2>

        <div className="mt-3 flex flex-wrap gap-2.5">
          <Button variant="assist" onClick={exportJson}>
            <Download aria-hidden="true" className="size-4" />
            Daten als JSON exportieren
          </Button>

          <Button variant="danger" onClick={() => setConfirming('data')}>
            <Trash2 aria-hidden="true" className="size-4" />
            Alle Daten löschen
          </Button>

          <Button onClick={() => setConfirming('demo')}>
            <RotateCcw aria-hidden="true" className="size-4" />
            Demo zurücksetzen
          </Button>
        </div>

        <p role="status" className="mt-2 min-h-5 text-sm font-medium text-assist-strong">
          {status}
        </p>

        {confirming ? (
          <Panel variant="muted" className="mt-3 p-4">
            <h3 className="text-sm font-bold text-ink">
              {confirming === 'data'
                ? 'Alle gespeicherten Daten löschen?'
                : 'Demo vollständig zurücksetzen?'}
            </h3>
            <p className="mt-1.5 text-sm text-muted">
              {confirming === 'data'
                ? 'Verlauf, eigene Angaben, Likes, Upvotes, gemerkte Beiträge und Testergebnisse werden entfernt. Deine Einstellungen bleiben erhalten.'
                : 'Setzt zusätzlich alle Einstellungen auf die Standardwerte zurück und zeigt das Onboarding erneut. Damit ist die Kameraerfassung wieder ausgeschaltet.'}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                variant="danger"
                onClick={() => {
                  if (confirming === 'data') {
                    deleteAllData();
                    setStatus('Alle gespeicherten Daten wurden gelöscht.');
                  } else {
                    resetDemo();
                    setStatus(
                      'Die Demo wurde zurückgesetzt. Einstellungen stehen wieder auf den Standardwerten.',
                    );
                  }
                  setConfirming(null);
                }}
              >
                {confirming === 'data' ? 'Ja, löschen' : 'Ja, zurücksetzen'}
              </Button>
              <Button onClick={() => setConfirming(null)}>Abbrechen</Button>
            </div>
          </Panel>
        ) : null}
      </section>
    </div>
  );
}
