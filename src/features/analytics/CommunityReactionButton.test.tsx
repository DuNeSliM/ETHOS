import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { COMMUNITY } from '@/data/community';
import { CommunityReactionButton } from '@/features/analytics/CommunityReactionButton';
import {
  headlineReaction,
  isSmallSample,
  rankReactions,
} from '@/features/analytics/communitySummary';
import { REACTION_EMOJI } from '@/lib/labels';
import { renderWithProviders, seedSettings } from '@/test/utils';

/**
 * The emoji is the most compressed statement the prototype makes. These tests
 * hold it to the same rules as every other one: it must be consented to, it
 * must say which of the two sources it came from, and it must never let a
 * plurality read as a consensus.
 */
describe('community reaction derivation', () => {
  it('ranks by share and breaks ties by the fixed vocabulary order', () => {
    const ranked = rankReactions(COMMUNITY['v-ragebait'], 'self-reported');

    expect(ranked.map((row) => row.key)).toEqual([
      'annoyed',
      'angry',
      'amused',
      'uncomfortable',
      'confused',
      'interested',
      'neutral',
    ]);
    expect(ranked[0].value).toBe(34);
  });

  it('takes the headline from the self reports, not the camera estimates', () => {
    // The scripted mismatch: cameras "see" amusement most often, people say
    // they were annoyed. The button has to show what people said.
    expect(rankReactions(COMMUNITY['v-ragebait'], 'estimated')[0].key).toBe('amused');
    expect(headlineReaction(COMMUNITY['v-ragebait'])?.key).toBe('annoyed');
  });

  it('gives every reaction key an emoji', () => {
    for (const summary of Object.values(COMMUNITY)) {
      for (const source of ['estimated', 'self-reported'] as const) {
        for (const row of rankReactions(summary, source)) {
          expect(REACTION_EMOJI[row.key], `missing emoji for ${row.key}`).toBeDefined();
        }
      }
    }
  });

  it('flags a distribution built on a handful of people', () => {
    expect(isSmallSample(COMMUNITY['v-lowcontext'], 'self-reported')).toBe(true);
    expect(isSmallSample(COMMUNITY['v-ragebait'], 'self-reported')).toBe(false);
  });
});

describe('CommunityReactionButton', () => {
  it('renders nothing when community reactions are switched off', () => {
    seedSettings({ showCommunityReactions: false });
    const { container } = renderWithProviders(
      <CommunityReactionButton postId="v-ragebait" />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing while the assistance layer is paused', () => {
    seedSettings({ assistantPaused: true });
    const { container } = renderWithProviders(
      <CommunityReactionButton postId="v-ragebait" />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing for a post without scripted community data', () => {
    const { container } = renderWithProviders(
      <CommunityReactionButton postId="d-sarcasm-c1" />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('spells the whole claim out in the accessible name', () => {
    renderWithProviders(<CommunityReactionButton postId="v-ragebait" />);

    // Reaction word, share, sample size, source and "simuliert" - none of
    // which an emoji can carry on its own.
    const button = screen.getByRole('button', {
        name: /am häufigsten genervt, 34 prozent von 742 selbstauskünften\. simulierte werte/i,
      });
    expect(button).toBeInTheDocument();
    expect(within(button).getByText(/am häufigsten:/i)).toBeVisible();
    expect(within(button).getByText(/genervt/i)).toBeVisible();
  });

  it('opens the full breakdown and names the source of the number', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CommunityReactionButton postId="v-ragebait" />);

    await user.click(screen.getByRole('button', { name: /reaktionen anderer/i }));

    const dialog = screen.getByRole('dialog', { name: /so haben andere reagiert/i });
    // Opens on the self reports, because that is what the emoji showed.
    expect(
      screen.getByRole('radio', { name: /aktive selbstauskünfte/i }),
    ).toHaveAttribute('aria-checked', 'true');
    // A plurality must not read as everyone.
    expect(dialog).toHaveTextContent(/66 % haben etwas anderes angegeben/i);
    expect(dialog).toHaveTextContent(/erfundene werte/i);
  });

  it('withholds the percentage when almost nobody answered', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CommunityReactionButton postId="v-lowcontext" />);

    await user.click(screen.getByRole('button', { name: /reaktionen anderer/i }));

    expect(
      screen.getByRole('dialog', { name: /so haben andere reagiert/i }),
    ).toHaveTextContent(/sehr wenige angaben/i);
  });
});
