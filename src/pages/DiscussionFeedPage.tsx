import { getPostsForMode } from '@/data/posts';
import { DiscussionPostCard } from '@/features/feed/DiscussionPostCard';
import { PLATFORM_NAME } from '@/features/social-app/platform';

/**
 * Discussion feed: headlines, text posts and comment threads.
 *
 * This is where irony is hardest to read, because there is no tone of voice and
 * no facial expression to fall back on - which is exactly why the brief asks
 * for a text-first mode alongside the visual one.
 *
 * Same rule as the visual feed: the page contributes content only, the chrome
 * around it belongs to the simulated platform.
 */
export function DiscussionFeedPage() {
  const posts = getPostsForMode('discussion');

  return (
    <div>
      <h1 className="sr-only">Discussion Feed</h1>

      <p className="border-b border-sim-line bg-sim-tint px-3 py-1.5 text-center text-[0.6875rem] font-semibold text-sim">
        Simulierte Diskussionen in {PLATFORM_NAME} · Beiträge und Konten sind
        erfunden
      </p>

      <p className="px-4 pt-3 text-sm text-muted">
        Hier fehlen Tonfall und Mimik – Ironie ist deshalb besonders schwer zu
        erkennen. Einzelne Kommentare haben eigene Hinweise.
      </p>

      <ul className="mt-3 space-y-3 px-3">
        {posts.map((post) => (
          <li key={post.id}>
            <DiscussionPostCard post={post} />
          </li>
        ))}
      </ul>

      <p className="px-4 py-8 text-center text-sm text-faint">
        Ende des simulierten Feeds. Es gibt {posts.length} Beispielbeiträge in
        dieser Ansicht.
      </p>
    </div>
  );
}
