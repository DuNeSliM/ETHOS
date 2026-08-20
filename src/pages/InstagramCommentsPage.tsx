import { ArrowLeft, CircleUserRound, Heart, Send } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Button, Panel } from '@/components/primitives';
import {
  getInstagramComments,
  type InstagramMockComment,
} from '@/data/instagramComments';
import { getPost } from '@/data/posts';
import { Caption } from '@/features/feed/Caption';

/** Native comment screen of the Instagram mock, separate from ETHOS analysis. */
export function InstagramCommentsPage() {
  const { postId = '' } = useParams();
  const post = getPost(postId);
  const [draft, setDraft] = useState('');
  const [addedComments, setAddedComments] = useState<InstagramMockComment[]>([]);
  const [status, setStatus] = useState('');

  if (!post || post.platform !== 'instagram') {
    return (
      <div className="px-3 pt-3">
        <Panel variant="muted" className="p-5">
          <h1 className="text-xl font-bold text-ink">Dieser Beitrag existiert nicht</h1>
          <p className="mt-1.5 text-sm text-muted">
            Im Instagram-Mock gibt es keinen Beitrag mit der Kennung „{postId}“.
          </p>
          <Link to="/instagram" className="mt-4 inline-block">
            <Button variant="assist">Zurück zu Instagram</Button>
          </Link>
        </Panel>
      </div>
    );
  }

  const comments = [...getInstagramComments(post.id), ...addedComments];

  function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = draft.trim();
    if (!body) return;

    setAddedComments((current) => [
      ...current,
      {
        id: `local-${postId}-${current.length + 1}`,
        authorHandle: 'du',
        body,
        postedAgo: 'gerade eben',
        likes: 0,
      },
    ]);
    setDraft('');
    setStatus('Dein Kommentar wurde nur für diese geöffnete Mock-Ansicht hinzugefügt.');
  }

  return (
    <div className="bg-surface">
      <header className="flex items-center gap-3 border-b border-line px-3 py-2.5">
        <Link
          to="/instagram"
          aria-label="Zurück zum Instagram-Feed"
          className="rounded-md p-1.5 text-ink hover:bg-surface-2"
        >
          <ArrowLeft aria-hidden="true" className="size-6" />
        </Link>
        <h1 className="text-lg font-bold text-ink">Kommentare</h1>
      </header>

      <p className="border-b border-sim-line bg-sim-tint px-3 py-1.5 text-center text-[0.6875rem] font-semibold text-sim">
        Erfundenes Konto, erfundene Kommentare und Zahlen · inoffizieller Mock
      </p>

      <section aria-label="Bildunterschrift des Beitrags" className="border-b border-line px-4 py-4">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs font-bold text-muted"
          >
            {post.authorHandle.replace(/^@/, '').slice(0, 2).toUpperCase()}
          </span>
          <p className="min-w-0 text-sm leading-relaxed text-ink">
            <span className="font-semibold">{post.authorHandle.replace(/^@/, '')}</span>{' '}
            <Caption text={post.body} />
            <span className="mt-1 block text-xs text-faint">{post.postedAgo}</span>
          </p>
        </div>
      </section>

      <section aria-labelledby="comment-list-heading">
        <h2 id="comment-list-heading" className="sr-only">
          Simulierte Kommentare
        </h2>
        <ul className="divide-y divide-line">
          {comments.map((comment) => (
            <li key={comment.id} className="flex items-start gap-3 px-4 py-3.5">
              <CircleUserRound aria-hidden="true" className="size-8 shrink-0 text-faint" />
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-relaxed text-ink">
                  <span className="font-semibold">{comment.authorHandle}</span>{' '}
                  {comment.body}
                </p>
                <p className="mt-1.5 text-xs font-medium text-faint">
                  {comment.postedAgo}
                  {comment.likes > 0
                    ? ` · ${comment.likes.toLocaleString('de-DE')} „Gefällt mir“-Angaben`
                    : ''}
                  {' · Antworten'}
                </p>
              </div>
              <span className="mt-1 inline-flex items-center gap-1 text-xs text-faint">
                <Heart aria-hidden="true" className="size-3.5" />
                <span className="sr-only">Gefällt-mir-Angaben:</span>
                {comment.likes > 0 ? comment.likes.toLocaleString('de-DE') : ''}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <form onSubmit={submitComment} className="sticky bottom-16 border-t border-line bg-surface/98 p-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <label htmlFor="instagram-comment" className="sr-only">
            Kommentar hinzufügen
          </label>
          <input
            id="instagram-comment"
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              setStatus('');
            }}
            placeholder="Kommentar hinzufügen …"
            className="min-w-0 flex-1 rounded-full border border-line bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-faint"
          />
          <Button type="submit" size="sm" variant="ghost" disabled={!draft.trim()}>
            <Send aria-hidden="true" className="size-4" />
            Posten
          </Button>
        </div>
        <p role="status" className={status ? 'mt-2 text-xs text-muted' : 'sr-only'}>
          {status}
        </p>
      </form>
    </div>
  );
}
