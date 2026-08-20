import { CameraOff, Pause, Play, RotateCcw, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAppState } from '@/app/AppStateProvider';
import { CameraPreview } from '@/features/reactions/CameraPreview';
import { Toggle } from '@/components/Toggle';
import { Button, Chip, Panel, SimulatedBadge } from '@/components/primitives';

/**
 * Consent and settings.
 *
 * Grouped by what the switch is *about* rather than by feature name, because
 * the distinction we most need participants to understand is "this is about the
 * post" versus "this is about me".
 */
export function SettingsPage() {
  const { settings, updateSetting, resetSettings } = useAppState();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight text-ink">
        Einwilligung und Einstellungen
      </h1>
      <p className="mt-2 text-muted">
        Jede Funktion ist einzeln schaltbar. Änderungen wirken sofort und bleiben
        nur in diesem Browser gespeichert.
      </p>

      {/* ---- master pause ------------------------------------------- */}
      <Panel
        variant={settings.assistantPaused ? 'muted' : 'assist'}
        className="mt-6 p-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-ink">
              {settings.assistantPaused
                ? 'Assistent ist pausiert'
                : 'Assistent ist aktiv'}
            </h2>
            <p className="mt-1 text-sm text-muted">
              Pausieren stoppt alle Hinweise auf einmal, ohne deine Einstellungen
              zu verlieren.
            </p>
          </div>
          <Button
            variant={settings.assistantPaused ? 'assist' : 'secondary'}
            onClick={() =>
              updateSetting('assistantPaused', !settings.assistantPaused)
            }
          >
            {settings.assistantPaused ? (
              <Play aria-hidden="true" className="size-4" />
            ) : (
              <Pause aria-hidden="true" className="size-4" />
            )}
            {settings.assistantPaused ? 'Fortsetzen' : 'Alles pausieren'}
          </Button>
        </div>
      </Panel>

      {/* ---- content analysis -------------------------------------- */}
      <section className="mt-8" aria-labelledby="group-content">
        <h2
          id="group-content"
          className="text-lg font-bold tracking-tight text-ink"
        >
          Analyse von Beiträgen
        </h2>
        <p className="mt-1 text-sm text-muted">
          Diese Einstellungen betreffen nur den Inhalt von Beiträgen – nicht
          dich.
        </p>

        <div className="mt-3 space-y-2.5">
          <Toggle
            label="Inhalts- und Kontextanalyse"
            description="Grundfunktion. Zeigt den Button „Kontext erklären“ an Beiträgen und Kommentaren."
            checked={settings.contentAnalysis}
            onChange={(value) => updateSetting('contentAnalysis', value)}
          />
          <Toggle
            label="Sarkasmus- und Ironiehinweise"
            description="Hinweise, wenn ein Beitrag wahrscheinlich nicht wörtlich gemeint ist."
            checked={settings.sarcasmHints}
            onChange={(value) => updateSetting('sarcasmHints', value)}
            disabled={!settings.contentAnalysis}
            disabledReason="Benötigt die Inhalts- und Kontextanalyse."
          />
          <Toggle
            label="Hinweise auf Ragebait und Polarisierung"
            description="Hinweise auf stark zuspitzende Formulierungen oder Beiträge, die auf Reaktionen ausgerichtet sein könnten."
            checked={settings.ragebaitHints}
            onChange={(value) => updateSetting('ragebaitHints', value)}
            disabled={!settings.contentAnalysis}
            disabledReason="Benötigt die Inhalts- und Kontextanalyse."
          />
        </div>

        <fieldset className="mt-4 rounded-xl border border-line bg-surface p-3">
          <legend className="px-1 text-sm font-semibold text-ink">
            Wie aufdringlich sollen Hinweise sein?
          </legend>
          <div className="mt-1.5 space-y-2">
            {(
              [
                {
                  value: 'on-demand',
                  label: 'Nur auf Anfrage (empfohlen)',
                  hint: 'Hinweise erscheinen erst, wenn du „Kontext erklären“ antippst.',
                },
                {
                  value: 'subtle-auto',
                  label: 'Dezenter Hinweis am Beitrag',
                  hint: 'Ein kleiner Marker zeigt, dass eine Einschätzung vorliegt. Der Text bleibt eingeklappt.',
                },
              ] as const
            ).map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-start gap-2.5 rounded-lg p-2 hover:bg-surface-2"
              >
                <input
                  type="radio"
                  name="hintVisibility"
                  value={option.value}
                  checked={settings.hintVisibility === option.value}
                  onChange={() => updateSetting('hintVisibility', option.value)}
                  className="mt-1 size-4 accent-[var(--cl-assist)]"
                />
                <span>
                  <span className="block text-sm font-medium text-ink">
                    {option.label}
                  </span>
                  <span className="block text-sm text-muted">{option.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      {/* ---- own reaction ------------------------------------------ */}
      <section className="mt-8" aria-labelledby="group-self">
        <h2 id="group-self" className="text-lg font-bold tracking-tight text-ink">
          Deine eigene Reaktion
        </h2>
        <div className="mt-2 flex flex-wrap gap-2">
          <Chip tone="neutral" icon={<CameraOff aria-hidden="true" className="size-3.5" />}>
            Standardmäßig ausgeschaltet
          </Chip>
          <SimulatedBadge label="Ergebnisse sind vorab geschrieben" />
        </div>
        <p className="mt-2 text-sm text-muted">
          Diese Einstellungen betreffen dich. Sie sind aus, bis du sie
          ausdrücklich einschaltest. In diesem Prototyp wird keine echte
          Emotionserkennung durchgeführt.
        </p>

        <div className="mt-3 space-y-2.5">
          <Toggle
            label="Simulierte eigene Reaktionserfassung"
            description="Zeigt an Beiträgen dezent eine geschätzte Beschreibung deines Gesichtsausdrucks. Du kannst sie jederzeit korrigieren."
            activeNote="Aktiv. Es werden keine Bilder erzeugt, gespeichert oder übertragen. Die Werte sind Beispielwerte."
            checked={settings.simulatedCameraCapture}
            onChange={(value) => updateSetting('simulatedCameraCapture', value)}
          />

          <Toggle
            label="Kamera-Vorschau anzeigen (nur Vorschau)"
            description="Zeigt das Bild deiner Kamera lokal auf diesem Gerät an, damit du siehst, was eine Kamera erfassen würde. Es wird nichts ausgewertet, aufgezeichnet oder gesendet."
            activeNote="Die Vorschau läuft nur in diesem Browserfenster. Beim Schließen der Seite endet sie."
            checked={settings.liveCameraPreview}
            onChange={(value) => updateSetting('liveCameraPreview', value)}
            disabled={!settings.simulatedCameraCapture}
            disabledReason="Erst möglich, wenn die eigene Reaktionserfassung aktiv ist."
          />

          {settings.liveCameraPreview ? <CameraPreview /> : null}

          <Toggle
            label="Eigene Reaktion anonym weitergeben"
            description="Deine Reaktion würde anonym in die Community-Auswertung einfließen. In diesem Prototyp wird nichts gesendet."
            checked={settings.shareAnonymousReaction}
            onChange={(value) => updateSetting('shareAnonymousReaction', value)}
            disabled={!settings.simulatedCameraCapture}
            disabledReason="Erst möglich, wenn die eigene Reaktionserfassung aktiv ist."
          />

          <Toggle
            label="Verlauf und Interaktionen lokal speichern"
            description="Speichert betrachtete Beiträge, eigene Angaben, Likes, Upvotes und gemerkte Beiträge in diesem Browser, damit die Sitzungsübersicht nach einem Neuladen erhalten bleibt. Ausgeschaltet funktionieren Interaktionen nur im Arbeitsspeicher."
            checked={settings.storeReactionHistory}
            onChange={(value) => updateSetting('storeReactionHistory', value)}
          />
        </div>
      </section>

      {/* ---- community --------------------------------------------- */}
      <section className="mt-8" aria-labelledby="group-community">
        <h2
          id="group-community"
          className="text-lg font-bold tracking-tight text-ink"
        >
          Reaktionen anderer
        </h2>
        <div className="mt-3">
          <Toggle
            label="Aggregierte Community-Reaktionen anzeigen"
            description="Anonyme Zusammenfassungen von Personen, die diese Funktion freiwillig aktiviert haben. Automatische Schätzungen und Selbstauskünfte werden getrennt gezeigt."
            checked={settings.showCommunityReactions}
            onChange={(value) => updateSetting('showCommunityReactions', value)}
          />
        </div>
      </section>

      {/* ---- appearance -------------------------------------------- */}
      <section className="mt-8" aria-labelledby="group-appearance">
        <h2
          id="group-appearance"
          className="text-lg font-bold tracking-tight text-ink"
        >
          Darstellung
        </h2>
        <fieldset className="mt-3 rounded-xl border border-line bg-surface p-3">
          <legend className="px-1 text-sm font-semibold text-ink">
            Farbschema
          </legend>
          <div className="mt-1.5 flex flex-wrap gap-3">
            {(
              [
                { value: 'system', label: 'Systemeinstellung' },
                { value: 'light', label: 'Hell' },
                { value: 'dark', label: 'Dunkel' },
              ] as const
            ).map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-ink"
              >
                <input
                  type="radio"
                  name="theme"
                  value={option.value}
                  checked={settings.theme === option.value}
                  onChange={() => updateSetting('theme', option.value)}
                  className="size-4 accent-[var(--cl-assist)]"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      {/* ---- footer actions ---------------------------------------- */}
      <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-5">
        <Button onClick={resetSettings}>
          <RotateCcw aria-hidden="true" className="size-4" />
          Einstellungen zurücksetzen
        </Button>
        <Link to="/ethos/privacy">
          <Button variant="assist">
            <ShieldCheck aria-hidden="true" className="size-4" />
            Zum Datenschutz-Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
