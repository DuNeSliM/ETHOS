import { ArrowLeft, EyeOff, Settings2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useAppState } from '@/app/AppStateProvider';
import { Button, Panel, SimulatedBadge } from '@/components/primitives';
import { getPost } from '@/data/posts';
import { AssistantCardBody } from '@/features/context-assistant/AssistantCardBody';
import { CommunityReactions } from '@/features/analytics/CommunityReactions';
import { ReactionTimeline } from '@/features/analytics/ReactionTimeline';
import { DiscussionPostCard } from '@/features/feed/DiscussionPostCard';
import { MediaPlaceholder } from '@/features/feed/MediaPlaceholder';
import { OwnReactionControl } from '@/features/reactions/OwnReactionControl';
import {
  resolveAnalysis,
  resolveCommunity,
  resolveTimeline,
} from '@/features/simulation/mockEngine';
import { getCommunity } from '@/data/community';
import type { SocialPlatform } from '@/types';

/**
 * ETHOS detail view for one post.
 *
 * This route is reached from the clearly separated ETHOS strip, never from a
 * host platform's ordinary comment controls. The four layers of the concept
 * appear together on one screen,
 * in a fixed order: the content, the analysis of the content, the participant's
 * own reaction over time, and finally what other people reported. Keeping that
 * order stable is what makes the distinction learnable.
 */
export function PostDetailPage({ expectedPlatform }: { expectedPlatform: SocialPlatform }) {
  const { postId = '' } = useParams();
  const { settings } = useAppState();
  const [currentTime, setCurrentTime] = useState(0);

  const post = getPost(postId);
  const handleTimeChange = useCallback((seconds: number) => {
    setCurrentTime(seconds);
  }, []);

  // Rendered inside the app shell, so this stays an inline panel rather than
  // the full-page 404 - nesting that would duplicate the header and nav.
  if (!post || post.platform !== expectedPlatform) {
    return (
      <div className="mx-auto max-w-2xl px-3 pt-3">
        <Panel variant="muted" className="p-5">
          <h1 className="text-xl font-bold tracking-tight text-ink">
            Dieser Beitrag existiert nicht
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Der Prototyp kennt keinen Beitrag mit der Kennung „{postId}“.
          </p>
          <Link to={`/${expectedPlatform}`} className="mt-4 inline-block">
            <Button variant="assist">Zurück zum Feed</Button>
          </Link>
        </Panel>
      </div>
    );
  }

  const analysis = resolveAnalysis(post.id, settings);
  const timeline = resolveTimeline(post.id, settings);
  const community = resolveCommunity(post.id, settings);
  const duration = post.media?.durationSeconds ?? 0;

  const backTo = `/${post.platform}`;

  return (
    // Padding lives here rather than in the shell: the feed above is
    // deliberately edge to edge, a detail page is not.
    <div className="mx-auto max-w-2xl px-3 pt-3">
      <Link to={backTo}>
        <Button variant="ghost" size="sm">
          <ArrowLeft aria-hidden="true" className="size-4" />
          Zurück zum Feed
        </Button>
      </Link>

      <h1 className="mt-3 text-xl font-bold tracking-tight text-ink">
        ETHOS-Auswertung: {post.title ?? `Beitrag von ${post.author}`}
      </h1>
      <p className="mt-1 text-sm text-muted">
        Analyse, eigene Reaktion und freiwillige Community-Reaktionen – klar
        getrennt von den Kommentaren der Plattform.
      </p>

      {/* ---- 1. the content ----------------------------------------- */}
      {post.platform === 'reddit' ? (
        <div className="mt-4">
          <DiscussionPostCard post={post} showAllComments />
        </div>
      ) : (
        <Panel as="article" className="mt-4 overflow-hidden p-4">
          <p className="text-xs text-faint">
            {post.author} · {post.authorHandle} · {post.postedAgo}
          </p>
          {post.media ? (
            <div className="mt-3">
              <MediaPlaceholder
                media={post.media}
                onTimeChange={handleTimeChange}
                variant="detail"
              >
                <OwnReactionControl postId={post.id} placement="overlay" />
              </MediaPlaceholder>
            </div>
          ) : null}
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink">
            {post.body}
          </p>
        </Panel>
      )}

      {/* ---- 2. analysis of the content ----------------------------- */}
      <section aria-labelledby="analysis-heading" className="mt-6">
        <h2 id="analysis-heading" className="sr-only">
          Einschätzung der Assistenzschicht
        </h2>

        {analysis.status === 'available' ? (
          <Panel variant="assist" className="p-4">
            <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-assist-line pb-3">
              <span className="text-xs font-bold uppercase tracking-wide text-assist-strong">
                Assistenzschicht · Analyse des Inhalts
              </span>
              <SimulatedBadge label="simuliert" />
            </div>
            <AssistantCardBody
              analysis={analysis.analysis}
              variant={analysis.variant}
            />
          </Panel>
        ) : (
          <Panel variant="muted" className="p-4">
            <div className="flex items-start gap-2.5">
              <EyeOff aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-muted" />
              <div>
                <h3 className="text-base font-semibold text-ink">
                  Für diesen Beitrag wird gerade keine Einschätzung angezeigt
                </h3>
                <p className="mt-1 text-sm text-muted">
                  {analysis.status === 'none'
                    ? 'Für diesen Beitrag ist im Prototyp keine Analyse vorbereitet.'
                    : 'Das liegt an einer deiner Einstellungen.'}
                </p>
                {analysis.status === 'disabled' ? (
                  <Link to="/ethos/settings" className="mt-3 inline-block">
                    <Button variant="assist" size="sm">
                      <Settings2 aria-hidden="true" className="size-4" />
                      Einstellungen öffnen
                    </Button>
                  </Link>
                ) : null}
              </div>
            </div>
          </Panel>
        )}
      </section>

      {/* ---- 3. own reaction over time ------------------------------ */}
      {timeline && duration > 0 ? (
        <div className="mt-6">
          <ReactionTimeline
            segments={timeline}
            durationSeconds={duration}
            currentTime={currentTime}
          />
        </div>
      ) : post.media?.kind === 'video' && !settings.simulatedCameraCapture ? (
        <Panel variant="muted" className="mt-6 p-4">
          <h2 className="text-base font-semibold text-ink">
            Kein Reaktionsverlauf verfügbar
          </h2>
          <p className="mt-1 text-sm text-muted">
            Ein Verlauf entsteht nur, wenn die simulierte eigene
            Reaktionserfassung aktiv ist. Sie ist derzeit ausgeschaltet.
          </p>
          <Link to="/ethos/settings" className="mt-3 inline-block">
            <Button size="sm">
              <Settings2 aria-hidden="true" className="size-4" />
              Einstellung ansehen
            </Button>
          </Link>
        </Panel>
      ) : null}

      {/* ---- 4. community ------------------------------------------- */}
      {community ? (
        <div className="mt-6">
          <CommunityReactions summary={community} />
        </div>
      ) : (
        // `resolveCommunity` returns null for three different reasons. Naming
        // the wrong one would be a false statement about the participant's own
        // settings, so work out which case this actually is.
        <Panel variant="muted" className="mt-6 p-4">
          {getCommunity(post.id) === undefined ? (
            <>
              <h2 className="text-base font-semibold text-ink">
                Keine Community-Daten vorhanden
              </h2>
              <p className="mt-1 text-sm text-muted">
                Für diesen Beitrag sind im Prototyp keine simulierten
                Community-Reaktionen hinterlegt.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-base font-semibold text-ink">
                Community-Reaktionen sind ausgeblendet
              </h2>
              <p className="mt-1 text-sm text-muted">
                {settings.assistantPaused
                  ? 'Der Assistent ist gerade pausiert. Solange er pausiert ist, werden keine Reaktionen anderer angezeigt.'
                  : 'Du hast die Anzeige aggregierter Reaktionen ausgeschaltet.'}
              </p>
              <Link to="/ethos/settings" className="mt-3 inline-block">
                <Button size="sm">
                  <Settings2 aria-hidden="true" className="size-4" />
                  Einstellung ansehen
                </Button>
              </Link>
            </>
          )}
        </Panel>
      )}
    </div>
  );
}
