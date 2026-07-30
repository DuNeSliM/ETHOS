import { getPostsForMode } from '@/data/posts';
import { FeedModeSwitch } from '@/features/feed/FeedModeSwitch';
import { StoriesRow } from '@/features/feed/StoriesRow';
import { VisualPostCard } from '@/features/feed/VisualPostCard';
import { SimulatedBadge } from '@/components/primitives';

/**
 * Visual feed: short videos and images with captions.
 *
 * The column is capped at the width a photo-sharing feed conventionally uses
 * (~30rem) and centred, so the layout works from a 320px phone up to a wide
 * desktop without a separate mobile design. Cards run edge to edge on small
 * screens and gain rounded corners from `sm` upward.
 */
export function VisualFeedPage() {
  const posts = getPostsForMode('visual');

  return (
    <div className="mx-auto max-w-[30rem]">
      <FeedModeSwitch />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <h1 className="text-xl font-bold tracking-tight text-ink">Visual Feed</h1>
        <SimulatedBadge label="Erfundene Beiträge" />
      </div>
      <p className="mt-1 text-sm text-muted">
        Diese Beiträge, Konten und Zahlen sind erfunden. Tippe an einem Beitrag
        auf „Kontext erklären“, um die Einschätzung der Assistenzschicht zu
        sehen.
      </p>

      {/* Full-bleed on phones, contained from `sm` upward. */}
      <div className="-mx-4 mt-4 sm:mx-0">
        <StoriesRow />

        <ul className="mt-4 space-y-4 sm:space-y-5">
          {posts.map((post) => (
            <li key={post.id}>
              <VisualPostCard post={post} />
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-8 text-center text-sm text-faint">
        Ende des simulierten Feeds. Es gibt {posts.length} Beispielbeiträge in
        dieser Ansicht.
      </p>
    </div>
  );
}
