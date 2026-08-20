import { getPostsForPlatform } from '@/data/posts';

/**
 * The horizontal "stories" strip at the top of the visual feed.
 *
 * Purely decorative scenery. It exists so the feed reads as a familiar
 * photo-sharing surface at a glance, which keeps a participant's attention on
 * the assistance layer rather than on an unfamiliar layout.
 *
 * Rendered as non-interactive elements on purpose: making these buttons would
 * add five dead controls to the keyboard path, and a control that does nothing
 * is worse than no control. The strip is marked `aria-hidden` and replaced by a
 * single explanatory sentence for screen reader users.
 */
export function StoriesRow() {
  const authors = getPostsForPlatform('instagram');

  return (
    <section className="border-b border-line bg-surface py-3">
      <p className="sr-only">
        Dekorativer Bereich: simulierte Kurzbeiträge anderer Konten. Er hat in
        diesem Prototyp keine Funktion.
      </p>

      <ul
        aria-hidden="true"
        className="flex gap-3.5 overflow-x-auto px-3 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* The viewer's own slot, styled as an empty ring like the real thing. */}
        <li className="flex w-16 shrink-0 flex-col items-center gap-1">
          <span className="flex size-16 items-center justify-center rounded-full border-2 border-dashed border-line-strong text-lg font-bold text-faint">
            +
          </span>
          <span className="w-full truncate text-center text-[0.6875rem] text-muted">
            Dein Beitrag
          </span>
        </li>

        {authors.map((post) => (
          <li
            key={post.id}
            className="flex w-16 shrink-0 flex-col items-center gap-1"
          >
            {/* The unread ring: the one piece of colour this strip carries. */}
            <span className="platform-gradient flex size-16 items-center justify-center rounded-full p-[2.5px]">
              <span className="flex size-full items-center justify-center rounded-full bg-surface p-[2px]">
                <span className="flex size-full items-center justify-center rounded-full bg-surface-2 text-xs font-bold text-muted">
                  {post.author
                    .split(' ')
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join('')}
                </span>
              </span>
            </span>
            <span className="w-full truncate text-center text-[0.6875rem] text-muted">
              {post.authorHandle.replace(/^@/, '')}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
