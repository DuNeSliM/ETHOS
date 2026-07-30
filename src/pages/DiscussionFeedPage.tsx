import { getPostsForMode } from '@/data/posts';
import { DiscussionPostCard } from '@/features/feed/DiscussionPostCard';
import { FeedModeSwitch } from '@/features/feed/FeedModeSwitch';
import { SimulatedBadge } from '@/components/primitives';

/**
 * Discussion feed: headlines, text posts and comment threads.
 *
 * This is where irony is hardest to read, because there is no tone of voice and
 * no facial expression to fall back on - which is exactly why the brief asks
 * for a text-first mode alongside the visual one.
 */
export function DiscussionFeedPage() {
  const posts = getPostsForMode('discussion');

  return (
    <div className="mx-auto max-w-2xl">
      <FeedModeSwitch />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <h1 className="text-xl font-bold tracking-tight text-ink">
          Discussion Feed
        </h1>
        <SimulatedBadge label="Erfundene Beiträge" />
      </div>
      <p className="mt-1 text-sm text-muted">
        Textbeiträge und Diskussionen. Hier fehlen Tonfall und Mimik – Ironie
        ist deshalb besonders schwer zu erkennen. Einzelne Kommentare haben
        eigene Hinweise.
      </p>

      <ul className="mt-5 space-y-5">
        {posts.map((post) => (
          <li key={post.id}>
            <DiscussionPostCard post={post} />
          </li>
        ))}
      </ul>

      <p className="mt-8 text-center text-sm text-faint">
        Ende des simulierten Feeds. Es gibt {posts.length} Beispielbeiträge in
        dieser Ansicht.
      </p>
    </div>
  );
}
