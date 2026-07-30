import { CameraOff, Pencil, ScanFace, Trash2, UserCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useAppState } from '@/app/AppStateProvider';
import { Sheet } from '@/components/Sheet';
import {
  Button,
  Chip,
  DefinitionRow,
  FieldLabel,
  Panel,
  SimulatedBadge,
} from '@/components/primitives';
import { estimateViewerExpression } from '@/features/simulation/mockEngine';
import {
  EXPRESSION_LABEL,
  SELF_REPORT_LABEL,
  SELF_REPORT_ORDER,
} from '@/lib/labels';
import type { SelfReportedReaction } from '@/types';

/**
 * The participant's own reaction: a quiet chip plus a correction sheet.
 *
 * Two rules this component exists to enforce:
 *
 *  1. The machine estimate and the self report are ALWAYS shown as two
 *     separate labelled rows. A correction never overwrites or hides the
 *     original guess - it sits next to it.
 *  2. The estimate describes what a camera would *see* ("sichtbares Lächeln"),
 *     while only the self report uses emotion words. The wording comes from
 *     `EXPRESSION_LABEL` and `SELF_REPORT_LABEL` respectively so the two
 *     vocabularies cannot drift into each other.
 *
 * Renders nothing when the participant has not switched simulated capture on.
 */
export function OwnReactionControl({
  postId,
  /** `overlay` sits on the media, `inline` sits in the post footer. */
  placement = 'inline',
}: {
  postId: string;
  placement?: 'overlay' | 'inline';
}) {
  const { settings, reactions, recordEstimate, recordSelfReport, clearSelfReport } =
    useAppState();
  const [open, setOpen] = useState(false);
  const [draftNote, setDraftNote] = useState('');

  const estimate = estimateViewerExpression(postId, settings);
  const stored = reactions[postId];

  // Persist the scripted estimate the first time this post is shown with
  // capture enabled, so the personal overview can compare it later.
  // Depends on the primitive fields rather than the object, which is rebuilt
  // on every render and would re-run this effect each time.
  const estimatedExpression = estimate?.expression;
  const estimatedConfidence = estimate?.confidence;
  useEffect(() => {
    if (estimatedExpression !== undefined && estimatedConfidence !== undefined) {
      recordEstimate(postId, estimatedExpression, estimatedConfidence);
    }
  }, [estimatedExpression, estimatedConfidence, postId, recordEstimate]);

  if (!settings.simulatedCameraCapture || settings.assistantPaused) {
    return null;
  }

  const expression = stored?.estimatedExpression ?? estimate?.expression ?? 'unclear';
  const confidence = stored?.confidence ?? estimate?.confidence ?? 0;
  const selfReport = stored?.selfReportedReaction;

  function choose(reaction: SelfReportedReaction) {
    recordSelfReport(
      postId,
      reaction,
      reaction === 'other' ? draftNote.trim() || undefined : undefined,
    );
    // Keep the sheet open on "other" so the free-text field stays reachable.
    if (reaction !== 'other') setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          placement === 'overlay'
            ? `
              inline-flex max-w-full items-center gap-1.5 self-start rounded-full
              bg-black/60 px-2.5 py-1 text-left text-xs font-semibold text-white
              hover:bg-black/75
            `
            : `
              inline-flex max-w-full items-center gap-1.5 rounded-full border
              border-line bg-surface-2 px-2.5 py-1 text-left text-xs font-semibold
              text-muted hover:bg-surface-3 hover:text-ink
            `
        }
      >
        <ScanFace aria-hidden="true" className="size-3.5 shrink-0" />
        <span className="truncate">
          {selfReport
            ? `Deine Angabe: ${SELF_REPORT_LABEL[selfReport]}`
            : `Geschätzt: ${EXPRESSION_LABEL[expression].toLowerCase()}`}
        </span>
        <Pencil aria-hidden="true" className="size-3 shrink-0 opacity-80" />
      </button>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Deine Reaktion"
        description="Die automatische Schätzung und deine eigene Angabe bleiben getrennt sichtbar."
        titleAdornment={<SimulatedBadge label="simuliert" />}
      >
        <div className="space-y-5">
          <Panel variant="muted" className="p-4">
            <dl className="space-y-3">
              <DefinitionRow term="Automatisch geschätzter Ausdruck" tone="assist">
                {EXPRESSION_LABEL[expression]}
                <span className="ml-2 text-xs font-normal text-muted">
                  (Sicherheit {Math.round(confidence * 100)} %)
                </span>
              </DefinitionRow>

              <DefinitionRow term="Von dir angegebene Reaktion" tone="self">
                {selfReport ? (
                  <span className="text-info">
                    {SELF_REPORT_LABEL[selfReport]}
                    {stored?.selfReportedNote ? ` – „${stored.selfReportedNote}“` : ''}
                  </span>
                ) : (
                  <span className="font-normal text-faint">
                    Noch keine Angabe gemacht
                  </span>
                )}
              </DefinitionRow>
            </dl>

            {selfReport ? (
              <p className="mt-3 border-t border-line pt-3 text-sm text-muted">
                Deine Angabe hat Vorrang. Sie wird überall dort verwendet, wo
                eine Reaktion angezeigt wird – die Schätzung bleibt nur zum
                Vergleich sichtbar.
              </p>
            ) : null}
          </Panel>

          <section>
            <FieldLabel
              icon={<UserCheck aria-hidden="true" className="size-3.5" />}
            >
              Wie hast du den Beitrag tatsächlich empfunden?
            </FieldLabel>
            <p className="mt-1.5 text-sm text-muted">
              Du musst nichts angeben. Wenn du etwas auswählst, korrigiert das
              die Schätzung.
            </p>

            <ul className="mt-3 flex flex-wrap gap-2">
              {SELF_REPORT_ORDER.map((reaction) => {
                const isActive = selfReport === reaction;
                return (
                  <li key={reaction}>
                    <button
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => choose(reaction)}
                      className={`
                        rounded-full border px-3 py-1.5 text-sm font-medium
                        transition-colors
                        ${
                          isActive
                            ? 'border-info bg-info-tint font-semibold text-info'
                            : 'border-line bg-surface text-ink hover:bg-surface-2'
                        }
                      `}
                    >
                      {/* A check mark, so selection is not colour-only. */}
                      {isActive ? '✓ ' : ''}
                      {SELF_REPORT_LABEL[reaction]}
                    </button>
                  </li>
                );
              })}
            </ul>

            {selfReport === 'other' ? (
              <div className="mt-3">
                <label
                  htmlFor={`note-${postId}`}
                  className="block text-sm font-semibold text-ink"
                >
                  Andere Reaktion – eigene Beschreibung (optional)
                </label>
                <input
                  id={`note-${postId}`}
                  type="text"
                  value={draftNote}
                  maxLength={80}
                  onChange={(event) => setDraftNote(event.target.value)}
                  onBlur={() => recordSelfReport(postId, 'other', draftNote.trim() || undefined)}
                  placeholder="z. B. nachdenklich"
                  className="
                    mt-1.5 w-full rounded-lg border border-line bg-surface px-3 py-2
                    text-sm text-ink
                  "
                />
              </div>
            ) : null}
          </section>

          {selfReport ? (
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                clearSelfReport(postId);
                setDraftNote('');
              }}
            >
              <Trash2 aria-hidden="true" className="size-4" />
              Meine Angabe entfernen
            </Button>
          ) : null}

          <Panel className="p-3.5">
            <div className="flex items-start gap-2">
              <CameraOff aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted" />
              <p className="text-sm text-muted">
                In diesem Prototyp wird{' '}
                <strong className="font-semibold text-ink">
                  keine echte Kamera ausgewertet
                </strong>
                . Die Schätzung oben ist ein vorab geschriebener Beispielwert. Es
                entstehen keine Bilder, es wird nichts gespeichert außer deiner
                eigenen Angabe – und die nur lokal in diesem Browser.
              </p>
            </div>
          </Panel>

          {settings.shareAnonymousReaction ? (
            <Chip tone="caution">
              Anonyme Weitergabe ist aktiv (im Prototyp wird nichts gesendet)
            </Chip>
          ) : (
            <Chip tone="neutral">Anonyme Weitergabe ist ausgeschaltet</Chip>
          )}
        </div>
      </Sheet>
    </>
  );
}
