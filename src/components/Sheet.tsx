import { X } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from 'react';

import { getAppViewport } from '@/lib/viewport';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

type SheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Optional line under the title, announced as part of the dialog. */
  description?: string;
  children: ReactNode;
  /** Sticky action row at the bottom of the sheet. */
  footer?: ReactNode;
  /** Small element rendered next to the title, e.g. a "simuliert" badge. */
  titleAdornment?: ReactNode;
};

/**
 * Accessible dialog, always a bottom sheet.
 *
 * The whole app now lives on a phone-sized screen - either a real one or the
 * simulated device frame - so there is no wide layout left to design for, and
 * a sheet that slides up from the bottom edge is what that form factor
 * expects.
 *
 * Implemented by hand rather than with the native `<dialog>` element so the
 * focus behaviour is identical in the browser and in jsdom, where the tests
 * assert it.
 *
 * Behaviour: focus moves into the sheet on open, Tab cycles inside it, Escape
 * and the backdrop close it, and focus returns to the trigger afterwards.
 */
export function Sheet({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  titleAdornment,
}: SheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  const focusables = useCallback((): HTMLElement[] => {
    if (!panelRef.current) return [];
    return Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
    ).filter((el) => el.offsetParent !== null || el === document.activeElement);
  }, []);

  // Remember the trigger, move focus in, and restore it on close.
  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const first = focusables()[0];
    (first ?? panelRef.current)?.focus();

    return () => {
      previouslyFocused.current?.focus?.();
    };
  }, [open, focusables]);

  // Escape to close, Tab to cycle within the sheet.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const items = focusables();
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === panelRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [open, onClose, focusables]);

  // Keep the page behind the sheet from scrolling. Inside the simulated device
  // the scroll container is the phone screen rather than the document, so both
  // have to be locked.
  useEffect(() => {
    if (!open) return;

    const viewport = getAppViewport();
    const previousBody = document.body.style.overflow;
    const previousViewport = viewport?.style.overflow;

    document.body.style.overflow = 'hidden';
    if (viewport) viewport.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBody;
      if (viewport) viewport.style.overflow = previousViewport ?? '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/*
        Backdrop. `aria-hidden` because the dialog below carries the accessible
        name; the click target is duplicated by the explicit close button.
      */}
      <div
        className="absolute inset-0 bg-black/45"
        aria-hidden="true"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        // `max-h` in percent, not `dvh`: inside the device frame the sheet's
        // containing block is the phone screen, and 90dvh would overflow it.
        className="
          relative flex max-h-[90%] w-full max-w-[34rem] flex-col overflow-hidden
          rounded-t-[var(--radius-sheet)] border border-assist-line
          bg-surface panel-shadow
        "
      >
        {/*
          The assistance layer marks itself with a teal top edge so it is
          visually distinct from the simulated platform behind it.
        */}
        <div aria-hidden="true" className="h-1.5 w-full shrink-0 bg-assist" />

        <div className="flex items-start gap-3 border-b border-line px-4 py-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id={titleId}
                className="text-lg font-semibold tracking-tight text-ink"
              >
                {title}
              </h2>
              {titleAdornment}
            </div>
            {description ? (
              <p id={descriptionId} className="mt-1 text-sm text-muted">
                {description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              -mr-1 flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5
              text-sm font-medium text-muted
              hover:bg-surface-2 hover:text-ink
            "
          >
            <X aria-hidden="true" className="size-4" />
            Schließen
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {children}
        </div>

        {footer ? (
          <div className="shrink-0 border-t border-line bg-surface-2 px-4 py-3">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
