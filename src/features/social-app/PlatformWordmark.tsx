import { PLATFORM_NAME } from '@/features/social-app/platform';

/**
 * Wordmark of the simulated platform.
 *
 * A gradient-filled italic serif: the genre's visual shorthand, drawn from our
 * own colour ramp rather than copied from a product. In forced-colours mode the
 * gradient fill is dropped, otherwise the clipped text would disappear.
 */
export function PlatformWordmark() {
  return (
    <span className="flex items-baseline gap-1.5">
      <span
        className="
          platform-gradient bg-clip-text text-[1.375rem] font-bold italic
          leading-none tracking-tight text-transparent
          [font-family:Georgia,'Times_New_Roman',serif]
          forced-colors:bg-none forced-colors:text-ink
        "
      >
        {PLATFORM_NAME}
      </span>
      <span className="text-[0.625rem] font-bold uppercase tracking-wide text-sim">
        simuliert
      </span>
    </span>
  );
}
