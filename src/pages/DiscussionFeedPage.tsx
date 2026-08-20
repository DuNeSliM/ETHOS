import { getPostsForPlatform } from '@/data/posts';
import { DiscussionPostCard } from '@/features/feed/DiscussionPostCard';
import { SOCIAL_PLATFORMS } from '@/lib/identity';

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
  const posts = getPostsForPlatform('reddit');
  const communityCount = new Set(posts.map((post) => post.community)).size;

  return (
    <div>
      <h1 className="sr-only">Reddit-Startseite</h1>

      <p className="border-b border-sim-line bg-sim-tint px-3 py-1.5 text-center text-[0.6875rem] font-semibold text-sim">
        {SOCIAL_PLATFORMS.reddit.mockNotice}
      </p>

      <div className="flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3">
        <div>
          <p className="text-sm font-bold text-ink">Dein Start-Feed</p>
          <p className="text-xs text-faint">Sortierung: Beste Beiträge · simuliert</p>
        </div>
        <span className="rounded-full bg-alert-tint px-2.5 py-1 text-xs font-semibold text-alert">
          {communityCount} Communities
        </span>
      </div>

      <p className="px-4 pt-3 text-sm text-muted">
        In Textbeiträgen fehlen Tonfall und Mimik. ETHOS markiert mögliche
        Ironie vorsichtig und zeigt freiwillige Reaktionen anderer getrennt an.
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
