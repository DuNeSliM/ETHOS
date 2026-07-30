import { Check, Minus } from 'lucide-react';
import { useId, type ReactNode } from 'react';

type ToggleProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: ReactNode;
  /** Extra warning shown when the switch is on, e.g. for the camera. */
  activeNote?: ReactNode;
  disabled?: boolean;
  disabledReason?: string;
};

/**
 * Consent switch.
 *
 * Built on a real `<input type="checkbox">` rather than a styled `div` so it is
 * keyboard operable and announced correctly for free. The knob carries a check
 * or minus glyph, so the on/off state is never communicated by position and
 * colour alone.
 */
export function Toggle({
  checked,
  onChange,
  label,
  description,
  activeNote,
  disabled = false,
  disabledReason,
}: ToggleProps) {
  const id = useId();
  const descriptionId = `${id}-description`;

  return (
    <div
      className={`
        flex items-start gap-3 rounded-xl border p-3 transition-colors
        ${checked ? 'border-assist-line bg-assist-tint' : 'border-line bg-surface'}
        ${disabled ? 'opacity-60' : ''}
      `}
    >
      <div className="relative mt-0.5 shrink-0">
        <input
          id={id}
          type="checkbox"
          role="switch"
          checked={checked}
          disabled={disabled}
          aria-describedby={description || disabledReason ? descriptionId : undefined}
          onChange={(event) => onChange(event.target.checked)}
          // Sized to match the decorative track below it, so the whole visible
          // switch is clickable and the focus ring surrounds all of it.
          className="peer h-6 w-11 cursor-pointer appearance-none disabled:cursor-not-allowed"
        />
        {/*
          Purely decorative track/knob drawn over the real checkbox, which
          stays in the accessibility tree and keeps native keyboard handling.
        */}
        <span
          aria-hidden="true"
          className={`
            pointer-events-none absolute left-0 top-0 flex size-6 w-11 items-center
            rounded-full border transition-colors
            ${checked ? 'border-assist bg-assist' : 'border-line-strong bg-surface-3'}
          `}
        >
          <span
            className={`
              flex size-5 items-center justify-center rounded-full bg-white
              text-[10px] transition-transform
              ${checked ? 'translate-x-[1.375rem] text-assist' : 'translate-x-0.5 text-neutral-ink'}
            `}
          >
            {checked ? (
              <Check className="size-3" strokeWidth={3.5} />
            ) : (
              <Minus className="size-3" strokeWidth={3.5} />
            )}
          </span>
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <label
          htmlFor={id}
          className="block cursor-pointer text-sm font-semibold text-ink"
        >
          {label}
        </label>

        <div id={descriptionId}>
          {description ? (
            <p className="mt-1 text-sm text-muted">{description}</p>
          ) : null}
          {disabled && disabledReason ? (
            <p className="mt-1 text-sm font-medium text-caution">{disabledReason}</p>
          ) : null}
          {checked && activeNote ? (
            <p className="mt-2 rounded-lg bg-surface px-2.5 py-2 text-xs text-muted">
              {activeNote}
            </p>
          ) : null}
        </div>

        {/* Redundant text state, so "on" is readable without seeing the knob. */}
        <p className="mt-1.5 text-xs font-semibold uppercase tracking-wide text-faint">
          {checked ? 'Aktiv' : 'Inaktiv'}
        </p>
      </div>
    </div>
  );
}
