import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
  Timer,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useAppState } from '@/app/AppStateProvider';
import { ContextAssistantButton } from '@/features/context-assistant/ContextAssistantButton';
import { MediaPlaceholder } from '@/features/feed/MediaPlaceholder';
import { OwnReactionControl } from '@/features/reactions/OwnReactionControl';
import { getTimeline } from '@/data/timelines';
import type { Post } from '@/types';

/**
 * A post in the visual feed.
 *
 * Deliberately follows the conventions of a photo-sharing feed - avatar row,
 * full-bleed media, action row, likes line, caption prefixed with the handle -
 * because a participant should recognise the format instantly and spend their
 * attention on the assistance layer instead of on learning a novel UI.
 *
 * It copies the *structure*, never a specific product: no logos, no brand
 * names, no lifted iconography, invented accounts and invented numbers.
 *
 * The assistance controls sit in their own tinted strip at the bottom, visually
 * separated from the simulated platform chrome above them.
 */
export function VisualPostCard({ post }: { post: Post }) {
  const { recordView } = useAppState();
  const viewLogged = useRef(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [captionExpanded, setCaptionExpanded] = useState(false);

  // Log the view once per mount. In a real product this would be tied to
  // viewport visibility; for a prototype the simpler rule is easier to explain
  // to a participant reading their own history afterwards.
  useEffect(() => {
    if (viewLogged.current) return;
    viewLogged.current = true;
    recordView(post.id, false);
  }, [post.id, recordView]);

  const hasTimeline = getTimeline(post.id) !== undefined;
  const noop = useCallback(() => {}, []);

  const likeCount = post.likes + (liked ? 1 : 0);
  const isLongCaption = post.body.length > 120;

  return (
    <article className="border-b border-line bg-surface">
      {/* ---- author row ---------------------------------------------- */}
      <header className="flex items-center gap-3 px-3 py-2.5">
        {/*
          Decorative avatar: a gradient ring around the author's initials. No
          invented likeness, and it keeps the row readable without images.
        */}
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-full p-[2px]"
          style={{
            background: `linear-gradient(135deg, ${post.media?.palette[0] ?? '#9aa6ae'}, ${post.media?.palette[1] ?? '#6b7681'})`,
          }}
        >
          <span className="flex size-full items-center justify-center rounded-full bg-surface text-[0.6875rem] font-bold text-muted">
            {post.author
              .split(' ')
              .map((part) => part[0])
              .slice(0, 2)
              .join('')}
          </span>
        </span>

        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-semibold text-ink">
            {post.authorHandle.replace(/^@/, '')}
          </p>
          <p className="truncate text-xs text-faint">{post.author}</p>
        </div>

        <button
          type="button"
          aria-label={`Weitere Optionen für den Beitrag von ${post.author} (im Prototyp ohne Funktion)`}
          className="rounded-md p-1.5 text-muted hover:bg-surface-2 hover:text-ink"
        >
          <MoreHorizontal aria-hidden="true" className="size-5" />
        </button>
      </header>

      {/* ---- media --------------------------------------------------- */}
      {post.media ? (
        <MediaPlaceholder media={post.media} onTimeChange={noop} variant="feed">
          <OwnReactionControl postId={post.id} placement="overlay" />
        </MediaPlaceholder>
      ) : null}

      {/* ---- action row ---------------------------------------------- */}
      <div className="flex items-center gap-1 px-2 pt-2">
        <button
          type="button"
          onClick={() => setLiked((value) => !value)}
          aria-pressed={liked}
          aria-label={liked ? 'Gefällt mir zurücknehmen' : 'Gefällt mir'}
          className={`
            flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium
            hover:bg-surface-2
            ${liked ? 'text-alert' : 'text-ink'}
          `}
        >
          <Heart
            aria-hidden="true"
            className="size-6"
            fill={liked ? 'currentColor' : 'none'}
          />
          <span className="tabular-nums">{likeCount.toLocaleString('de-DE')}</span>
        </button>

        <Link
          to={`/post/${post.id}`}
          aria-label={`${post.commentCount} Kommentare ansehen`}
          className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-ink hover:bg-surface-2"
        >
          <MessageCircle aria-hidden="true" className="size-6" />
          <span className="tabular-nums">
            {post.commentCount.toLocaleString('de-DE')}
          </span>
        </Link>

        <button
          type="button"
          aria-label="Beitrag teilen (im Prototyp ohne Funktion)"
          className="rounded-md px-2 py-1.5 text-ink hover:bg-surface-2"
        >
          <Send aria-hidden="true" className="size-6" />
        </button>

        <button
          type="button"
          onClick={() => setSaved((value) => !value)}
          aria-pressed={saved}
          aria-label={saved ? 'Aus Sammlung entfernen' : 'Beitrag speichern'}
          className="ml-auto rounded-md px-2 py-1.5 text-ink hover:bg-surface-2"
        >
          <Bookmark
            aria-hidden="true"
            className="size-6"
            fill={saved ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      {/* ---- caption ------------------------------------------------- */}
      <div className="px-3 pb-2.5 pt-1">
        <p className="text-sm leading-snug text-ink">
          <span className="font-semibold">
            {post.authorHandle.replace(/^@/, '')}
          </span>{' '}
          <span className={!captionExpanded && isLongCaption ? 'line-clamp-2' : ''}>
            {post.body}
          </span>
        </p>

        {isLongCaption && !captionExpanded ? (
          <button
            type="button"
            onClick={() => setCaptionExpanded(true)}
            className="mt-0.5 text-sm font-medium text-faint hover:text-muted"
          >
            … mehr anzeigen
          </button>
        ) : null}

        <Link
          to={`/post/${post.id}`}
          className="mt-1.5 block text-sm text-faint hover:text-muted"
        >
          Alle {post.commentCount.toLocaleString('de-DE')} Kommentare ansehen
        </Link>

        <p className="mt-1 text-[0.6875rem] uppercase tracking-wide text-faint">
          {post.postedAgo}
        </p>
      </div>

      {/* ---- assistance strip ---------------------------------------- */}
      <div className="border-t border-assist-line bg-assist-tint/50 px-3 py-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <ContextAssistantButton
            postId={post.id}
            onOpened={() => recordView(post.id, true)}
          />

          <Link
            to={`/post/${post.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-assist-strong hover:bg-assist-tint"
          >
            <Timer aria-hidden="true" className="size-4" />
            {hasTimeline ? 'Reaktionsverlauf' : 'Reaktionen'}
          </Link>

          {/* Inline chip when there is no media to overlay it onto. */}
          {post.media ? null : (
            <OwnReactionControl postId={post.id} placement="inline" />
          )}
        </div>
      </div>
    </article>
  );
}
