import { FlaskConical } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Small shared building blocks.
 *
 * Two conventions run through all of them:
 *  - every status is carried by an icon AND a text label, never colour alone;
 *  - the assistance layer uses the `assist` token family so participants can
 *    tell app chrome apart from simulated platform content at a glance.
 */

/* ------------------------------------------------------------------ */
/* Button                                                              */
/* ------------------------------------------------------------------ */

type ButtonVariant = 'primary' | 'assist' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  primary:
    'bg-ink text-inverse hover:opacity-90 border border-transparent',
  assist:
    'bg-assist text-assist-on hover:bg-assist-strong border border-transparent',
  secondary:
    'bg-surface text-ink border border-line-strong hover:bg-surface-2',
  ghost: 'bg-transparent text-ink border border-transparent hover:bg-surface-2',
  danger:
    'bg-surface text-alert border border-alert/50 hover:bg-alert-tint font-semibold',
};

const BUTTON_SIZE: Record<ButtonSize, string> = {
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2 gap-2',
  lg: 'text-base px-5 py-2.5 gap-2',
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export function Button({
  variant = 'secondary',
  size = 'md',
  fullWidth,
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`
        inline-flex items-center justify-center rounded-lg font-medium
        transition-colors disabled:cursor-not-allowed disabled:opacity-50
        ${BUTTON_VARIANT[variant]} ${BUTTON_SIZE[size]}
        ${fullWidth ? 'w-full' : ''} ${className}
      `}
      {...rest}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Chip                                                               */
/* ------------------------------------------------------------------ */

export type ChipTone =
  | 'assist'
  | 'info'
  | 'positive'
  | 'caution'
  | 'alert'
  | 'neutral'
  | 'sim';

const CHIP_TONE: Record<ChipTone, string> = {
  assist: 'bg-assist-tint text-assist-strong border-assist-line',
  info: 'bg-info-tint text-info border-info/30',
  positive: 'bg-positive-tint text-positive border-positive/30',
  caution: 'bg-caution-tint text-caution border-caution/40',
  alert: 'bg-alert-tint text-alert border-alert/40',
  neutral: 'bg-neutral-tint text-neutral-ink border-line-strong',
  sim: 'bg-sim-tint text-sim border-sim-line',
};

type ChipProps = {
  tone?: ChipTone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** Inline status pill. Always contains readable text, not just an icon. */
export function Chip({ tone = 'neutral', icon, children, className = '' }: ChipProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1
        text-xs font-semibold leading-tight ${CHIP_TONE[tone]} ${className}
      `}
    >
      {icon}
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Simulated-data marker                                              */
/* ------------------------------------------------------------------ */

/**
 * Marks anything invented by the prototype.
 *
 * Required by the brief: a test person must never be in doubt about whether a
 * number came from a real measurement. Used on media placeholders, analysis
 * cards, community charts and the reaction timeline.
 */
export function SimulatedBadge({
  label = 'Simuliert',
  className = '',
}: {
  label?: string;
  className?: string;
}) {
  return (
    <Chip
      tone="sim"
      className={className}
      icon={<FlaskConical aria-hidden="true" className="size-3.5" />}
    >
      {label}
    </Chip>
  );
}

/* ------------------------------------------------------------------ */
/* Panel                                                              */
/* ------------------------------------------------------------------ */

type PanelProps = {
  children: ReactNode;
  /** `assist` gives the panel the assistance-layer border treatment. */
  variant?: 'plain' | 'assist' | 'muted';
  className?: string;
  as?: 'div' | 'section' | 'article' | 'aside';
};

export function Panel({
  children,
  variant = 'plain',
  className = '',
  as: Tag = 'div',
}: PanelProps) {
  const variantClass = {
    plain: 'bg-surface border-line',
    assist: 'bg-assist-tint border-assist-line',
    muted: 'bg-surface-2 border-line',
  }[variant];

  return (
    <Tag
      className={`rounded-[var(--radius-panel)] border ${variantClass} ${className}`}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Section heading inside cards and sheets                            */
/* ------------------------------------------------------------------ */

export function FieldLabel({
  children,
  icon,
}: {
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-faint">
      {icon}
      {children}
    </h3>
  );
}

/**
 * Key/value row used wherever an estimate and a self report appear together.
 * Keeping it in one component is what guarantees the two never merge visually.
 */
export function DefinitionRow({
  term,
  children,
  tone = 'plain',
}: {
  term: string;
  children: ReactNode;
  tone?: 'plain' | 'assist' | 'self';
}) {
  const accent = {
    plain: 'border-line',
    assist: 'border-assist',
    self: 'border-info',
  }[tone];

  return (
    <div className={`border-l-2 ${accent} pl-3`}>
      <dt className="text-xs font-semibold uppercase tracking-wide text-faint">
        {term}
      </dt>
      <dd className="mt-0.5 text-sm font-medium text-ink">{children}</dd>
    </div>
  );
}
