import { ArrowBigUp, BarChart3, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

import { useAppState } from '@/app/AppStateProvider';
import { CommunityReactionButton } from '@/features/analytics/CommunityReactionButton';
import { ContextAssistantButton } from '@/features/context-assistant/ContextAssistantButton';
import { OwnReactionControl } from '@/features/reactions/OwnReactionControl';
import type { Post } from '@/types';

/**
 * A post in the discussion feed, with its comment thread.
 *
 * Structure borrows the general shape of forum software - community label,
 * headline, body, ranked comments - without reproducing any particular site's
 * design or terminology.
 *
 * Individual comments can carry their own assistant button when the scripted
 * data provides an analysis for them (`comment.hasAnalysis`), which is how we
 * test hints on short, ambiguous replies.
 */
export function DiscussionPostCard({
  post,
  /** Feed view truncates the thread; the detail page shows all of it. */
  showAllComments = false,
}: {
  post: Post;
  showAllComments?: boolean;
}) {
  const { recordView } = useAppState();
  const viewLogged = useRef(false);

  useEffect(() => {
    if (viewLogged.current) return;
    viewLogged.current = true;
    recordView(post.id, false);
  }, [post.id, recordView]);

  const comments = post.comments ?? [];
  const visibleComments = showAllComments ? comments : comments.slice(0, 2);
  const hiddenCount = comments.length - visibleComments.length;

  return (
    <article className="overflow-hidden rounded-[var(--radius-panel)] border border-line bg-surface">
      <header className="px-4 pt-3">
        <p className="text-xs text-faint">
          <span className="font-semibold text-muted">{post.community}</span>
          {' · '}
          {post.authorHandle}
          {' · '}
          {post.postedAgo}
        </p>
        {post.title ? (
          <h2 className="mt-1.5 text-lg font-bold leading-snug tracking-tight text-ink">
            {post.title}
          </h2>
        ) : null}
      </header>

      <div className="px-4 pt-2">
        <p className="text-[0.9375rem] leading-relaxed text-ink">{post.body}</p>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 pb-3 pt-2.5 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <ArrowBigUp aria-hidden="true" className="size-4" />
          {post.likes.toLocaleString('de-DE')}
          <span className="sr-only">Zustimmungen</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MessageCircle aria-hidden="true" className="size-3.5" />
          {post.commentCount.toLocaleString('de-DE')}
          <span className="sr-only">Kommentare</span>
        </span>
      </div>

      {/* ---- assistance strip -------------------------------------- */}
      <div className="border-y border-assist-line bg-assist-tint/50 px-4 py-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <ContextAssistantButton
            postId={post.id}
            onOpened={() => recordView(post.id, true)}
          />
          <CommunityReactionButton postId={post.id} />
          <Link
            to={`/post/${post.id}`}
            className="
              inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm
              font-medium text-assist-strong hover:bg-assist-tint
            "
          >
            <BarChart3 aria-hidden="true" className="size-4" />
            Alles zum Beitrag
          </Link>
          <OwnReactionControl postId={post.id} placement="inline" />
        </div>
      </div>

      {visibleComments.length > 0 ? (
        <section aria-label="Kommentare" className="divide-y divide-line">
          {visibleComments.map((comment) => (
            <div key={comment.id} className="px-4 py-3">
              <p className="text-xs text-faint">{comment.author}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink">{comment.body}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs text-muted">
                  <ArrowBigUp aria-hidden="true" className="size-3.5" />
                  {comment.upvotes.toLocaleString('de-DE')}
                </span>
                {comment.hasAnalysis ? (
                  <ContextAssistantButton
                    postId={comment.id}
                    label="Kontext erklären"
                    size="inline"
                  />
                ) : null}
              </div>
            </div>
          ))}

          {hiddenCount > 0 ? (
            <div className="px-4 py-2.5">
              <Link
                to={`/post/${post.id}`}
                className="text-sm font-semibold text-assist-strong hover:underline"
              >
                {hiddenCount} weitere{hiddenCount === 1 ? 'r' : ''} Kommentar
                {hiddenCount === 1 ? '' : 'e'} anzeigen
              </Link>
            </div>
          ) : null}
        </section>
      ) : null}
    </article>
  );
}
