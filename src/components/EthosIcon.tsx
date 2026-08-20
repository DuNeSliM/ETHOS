/**
 * The single canonical ETHOS product mark.
 *
 * Keeping the asset reference here prevents compact system surfaces from
 * drifting back to the retired ring-and-dot lens glyph.
 */
export function EthosIcon({ className = '' }: { className?: string }) {
  return (
    <img
      src="/ethos-app-icon.png"
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`shrink-0 object-cover ${className}`}
    />
  );
}
