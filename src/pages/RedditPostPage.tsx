import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { Button, Panel } from '@/components/primitives';
import { getPost } from '@/data/posts';
import { DiscussionPostCard } from '@/features/feed/DiscussionPostCard';

/** Native Reddit-mock post view with the complete scripted comment thread. */
export function RedditPostPage() {
  const { postId = '' } = useParams();
  const post = getPost(postId);

  if (!post || post.platform !== 'reddit') {
    return (
      <div className="px-3 pt-3">
        <Panel variant="muted" className="p-5">
          <h1 className="text-xl font-bold text-ink">Dieser Beitrag existiert nicht</h1>
          <p className="mt-1.5 text-sm text-muted">
            Im Reddit-Mock gibt es keinen Beitrag mit der Kennung „{postId}“.
          </p>
          <Link to="/reddit" className="mt-4 inline-block">
            <Button variant="assist">Zurück zu Reddit</Button>
          </Link>
        </Panel>
      </div>
    );
  }

  return (
    <div className="px-3 pt-3">
      <Link
        to="/reddit"
        aria-label="Zurück zum Reddit-Feed"
        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-semibold text-muted hover:bg-surface-2 hover:text-ink"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Zurück
      </Link>
      <h1 className="sr-only">{post.title} – Kommentare</h1>
      <div className="mt-3">
        <DiscussionPostCard post={post} showAllComments />
      </div>
    </div>
  );
}
