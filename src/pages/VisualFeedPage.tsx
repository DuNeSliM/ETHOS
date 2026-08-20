import { getPostsForPlatform } from '@/data/posts';
import { StoriesRow } from '@/features/feed/StoriesRow';
import { VisualPostCard } from '@/features/feed/VisualPostCard';
import { SOCIAL_PLATFORMS } from '@/lib/identity';

/**
 * Visual feed: short videos and images with captions.
 *
 * The page is only the content column - header, view switch, status strip and
 * tab bar belong to `SocialAppShell`, because they are chrome of the simulated
 * platform rather than of this screen.
 *
 * The heading is present but visually hidden: a photo feed does not carry a
 * page title, and inventing one would be the first thing that breaks the
 * illusion. Screen reader users still get it, and the simulation notice below
 * it is visible to everyone.
 */
export function VisualFeedPage() {
  const posts = getPostsForPlatform('instagram');

  return (
    <div>
      <h1 className="sr-only">Visual Feed</h1>

      <p className="border-b border-sim-line bg-sim-tint px-3 py-1.5 text-center text-[0.6875rem] font-semibold text-sim">
        {SOCIAL_PLATFORMS.instagram.mockNotice}
      </p>

      <StoriesRow />

      {/* No gaps between posts: the hairline under each card is the divider,
          the way this genre has always done it. */}
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <VisualPostCard post={post} />
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
