import { Settings2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useAppState } from '@/app/AppStateProvider';
import { Sheet } from '@/components/Sheet';
import { Button, Panel, SimulatedBadge } from '@/components/primitives';
import { AssistantCardBody } from '@/features/context-assistant/AssistantCardBody';
import { resolveAnalysis } from '@/features/simulation/mockEngine';
import { VARIANT_TITLE } from '@/lib/labels';

const DISABLED_COPY: Record<string, { title: string; body: string }> = {
  paused: {
    title: 'Der Assistent ist pausiert',
    body:
      'Du hast alle Hinweise vorübergehend angehalten. Deine Einstellungen bleiben erhalten.',
  },
  'analysis-off': {
    title: 'Die Inhaltsanalyse ist ausgeschaltet',
    body:
      'Ohne Inhaltsanalyse gibt es keine Hinweise zu Ton oder Absicht eines Beitrags.',
  },
  'sarcasm-off': {
    title: 'Sarkasmus- und Ironiehinweise sind ausgeschaltet',
    body:
      'Für diesen Beitrag gäbe es einen Hinweis dieser Art. Du hast diese Kategorie deaktiviert.',
  },
  'ragebait-off': {
    title: 'Hinweise auf Polarisierung sind ausgeschaltet',
    body:
      'Für diesen Beitrag gäbe es einen Hinweis dieser Art. Du hast diese Kategorie deaktiviert.',
  },
};

/**
 * The "Kontext erklären" affordance.
 *
 * Kept deliberately small and quiet: the brief asks for hints on demand rather
 * than a permanent emotion banner over the content. Nothing about the analysis
 * is visible until the participant opens it.
 *
 * When a hint is withheld because of a setting, we say which setting and link
 * straight to it - one of the things the study wants to observe is whether
 * people can find their way back to the switches.
 */
export function ContextAssistantButton({
  postId,
  label = 'Kontext erklären',
  /** `inline` is the compact variant used on comments. */
  size = 'default',
  onOpened,
}: {
  postId: string;
  label?: string;
  size?: 'default' | 'inline';
  onOpened?: () => void;
}) {
  const { settings } = useAppState();
  const [open, setOpen] = useState(false);

  const result = resolveAnalysis(postId, settings);

  // No scripted analysis for this item: show nothing at all rather than an
  // empty affordance that leads to a dead end.
  if (result.status === 'none') return null;

  function handleOpen() {
    setOpen(true);
    onOpened?.();
  }

  const sheetTitle =
    result.status === 'available'
      ? VARIANT_TITLE[result.variant]
      : 'Hinweis nicht verfügbar';

  // "Dezenter Hinweis am Beitrag": name the reading next to the button, but
  // keep the reasoning, the confidence and the limits behind the sheet. This is
  // the most intrusive the assistant is ever allowed to be without being asked.
  const showSubtleMarker =
    settings.hintVisibility === 'subtle-auto' &&
    result.status === 'available' &&
    size === 'default';

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={
          size === 'inline'
            ? `
              inline-flex items-center gap-1.5 rounded-lg border border-assist-line
              bg-assist-tint px-2 py-1 text-xs font-semibold text-assist-strong
              hover:bg-assist-tint-2
            `
            : `
              inline-flex items-center gap-1.5 rounded-lg border border-assist-line
              bg-assist-tint px-3 py-1.5 text-sm font-semibold text-assist-strong
              hover:bg-assist-tint-2
            `
        }
      >
        <Sparkles
          aria-hidden="true"
          className={size === 'inline' ? 'size-3.5' : 'size-4'}
        />
        {label}
      </button>

      {showSubtleMarker && result.status === 'available' ? (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-assist" />
          {VARIANT_TITLE[result.variant]}
        </span>
      ) : null}

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title={sheetTitle}
        description="Einschätzung der Assistenzschicht zu diesem Beitrag."
        titleAdornment={<SimulatedBadge label="simuliert" />}
      >
        {result.status === 'available' ? (
          <AssistantCardBody analysis={result.analysis} variant={result.variant} />
        ) : (
          <div>
            <Panel variant="muted" className="p-4">
              <h3 className="text-base font-semibold text-ink">
                {DISABLED_COPY[result.reason].title}
              </h3>
              <p className="mt-1.5 text-sm text-muted">
                {DISABLED_COPY[result.reason].body}
              </p>
            </Panel>

            <div className="mt-4">
              <Link to="/ethos/settings">
                <Button variant="assist">
                  <Settings2 aria-hidden="true" className="size-4" />
                  Zu den Einstellungen
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Sheet>
    </>
  );
}
