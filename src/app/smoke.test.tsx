import { describe, expect, it } from 'vitest';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AppRoutes } from '@/app/App';
import { DEFAULT_SETTINGS } from '@/app/AppStateProvider';
import { renderWithProviders, seedSettings } from '@/test/utils';
import { STORAGE_KEYS } from '@/lib/storage';

/**
 * End-to-end smoke tests through the real route table.
 *
 * These walk the paths a moderated session actually takes, so a broken route or
 * a crashing screen fails here rather than in front of a participant.
 */

describe('consent defaults', () => {
  it('never enables camera capture or sharing by default', () => {
    expect(DEFAULT_SETTINGS.simulatedCameraCapture).toBe(false);
    expect(DEFAULT_SETTINGS.liveCameraPreview).toBe(false);
    expect(DEFAULT_SETTINGS.shareAnonymousReaction).toBe(false);
  });

  it('defaults hints to on-demand rather than always visible', () => {
    expect(DEFAULT_SETTINGS.hintVisibility).toBe('on-demand');
  });
});

describe('landing page', () => {
  it('explains the product and marks it as a simulation', () => {
    renderWithProviders(<AppRoutes />, { route: '/' });

    expect(
      screen.getByRole('heading', { level: 1, name: /assistenzschicht/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/keine echte ki/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /demo starten/i }),
    ).toBeInTheDocument();
  });

  it('goes to the onboarding from "Demo starten"', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppRoutes />, { route: '/' });

    await user.click(screen.getByRole('button', { name: /demo starten/i }));

    expect(screen.getByText(/schritt 1 von 5/i)).toBeInTheDocument();
  });
});

describe('onboarding', () => {
  it('walks through every step and ends on the consent screen', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppRoutes />, { route: '/onboarding' });

    for (let step = 0; step < 4; step += 1) {
      await user.click(screen.getByRole('button', { name: /^weiter$/i }));
    }

    expect(
      screen.getByRole('heading', { name: /was möchtest du aktivieren/i }),
    ).toBeInTheDocument();

    // The camera switch must be off when the participant first sees it.
    const cameraSwitch = screen.getByRole('switch', {
      name: /simulierte eigene reaktionserfassung/i,
    });
    expect(cameraSwitch).not.toBeChecked();

    // Sharing stays locked until capture is enabled.
    expect(
      screen.getByRole('switch', { name: /anonym weitergeben/i }),
    ).toBeDisabled();
  });
});

describe('simulated phone', () => {
  it('ends the setup on the home screen, not inside the feed', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppRoutes />, { route: '/onboarding' });

    for (let step = 0; step < 4; step += 1) {
      await user.click(screen.getByRole('button', { name: /^weiter$/i }));
    }
    await user.click(
      screen.getByRole('button', { name: /aktivieren und telefon öffnen/i }),
    );

    expect(
      screen.getByRole('heading', { name: /apps auf diesem simulierten telefon/i }),
    ).toBeInTheDocument();
  });

  it('offers Instagram, Reddit and ETHOS as three separate apps', () => {
    renderWithProviders(<AppRoutes />, { route: '/phone' });

    expect(
      screen.getAllByRole('link', { name: /^instagram$/i }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole('link', { name: /^reddit$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /^ethos$/i }),
    ).toBeInTheDocument();

    // Wallpaper icons are scenery, not dead controls in the keyboard path.
    expect(screen.queryByRole('link', { name: /wetter/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /wetter/i })).not.toBeInTheDocument();
  });

  it('states what the extension is currently doing on the home screen', () => {
    renderWithProviders(<AppRoutes />, { route: '/phone' });

    expect(screen.getByText(/erklärt beiträge auf antippen/i)).toBeInTheDocument();
    expect(screen.getByText(/kamera aus\. keine reaktionserfassung/i)).toBeInTheDocument();
  });

  it('offers a focused phone view that hides the desktop explanation', () => {
    const { container } = renderWithProviders(<AppRoutes />, { route: '/reddit' });

    expect(
      screen.getByRole('heading', { name: /ethos läuft als erweiterung/i }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', {
        name: /handy im vollbild anzeigen/i,
        hidden: true,
      }),
    );

    expect(
      screen.queryByRole('heading', { name: /ethos läuft als erweiterung/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /handy-vollbild beenden/i, hidden: true }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(container.querySelector('.device-screen')).toHaveClass(
      'lg:w-[min(28.5rem,calc(100vw-4rem))]',
    );
  });
});

describe('assistance layer over a foreign app', () => {
  it('marks the feed as someone else’s app and keeps the extension visible', () => {
    renderWithProviders(<AppRoutes />, { route: '/instagram' });

    // Platform chrome.
    expect(screen.getByRole('link', { name: /^start/i })).toBeInTheDocument();
    // Assistance layer, on top of it.
    expect(
      screen.getByRole('button', { name: /ethos öffnen/i }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/keine verbindung zu instagram/i)[0],
    ).toBeInTheDocument();
  });

  it('pauses the whole layer from the overlay panel', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppRoutes />, { route: '/instagram' });

    expect(screen.getByText(/^inhaltsanalyse aktiv$/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /ethos öffnen/i }));
    await user.click(screen.getByRole('switch', { name: /assistenzschicht aktiv/i }));

    expect(screen.getAllByText(/pausiert/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/^inhaltsanalyse aktiv$/i)).not.toBeInTheDocument();
  });

  it('never reports the analysis as running when it is switched off', () => {
    // "Paused" and "analysis off" are different states. The strip over the
    // foreign app is the only status a participant sees while browsing, so it
    // must not collapse the two.
    seedSettings({ contentAnalysis: false });
    renderWithProviders(<AppRoutes />, { route: '/instagram' });

    expect(screen.getByText(/^inhaltsanalyse aus$/i)).toBeInTheDocument();
    expect(screen.queryByText(/assistent pausiert/i)).not.toBeInTheDocument();
  });

  it('says so when a platform control does not exist in the prototype', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppRoutes />, { route: '/instagram' });

    await user.click(
      screen.getByRole('button', { name: /suche \(im prototyp ohne funktion\)/i }),
    );

    expect(screen.getByRole('status')).toHaveTextContent(
      /gibt es in diesem prototyp nicht/i,
    );
  });
});

describe('visual feed', () => {
  it('lists the example posts with assistant buttons', () => {
    renderWithProviders(<AppRoutes />, { route: '/instagram' });

    expect(
      screen.getByRole('heading', { level: 1, name: /visual feed/i }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: /kontext erklären/i }).length,
    ).toBeGreaterThanOrEqual(4);
    expect(screen.getByText(/absolut perfekter start in den tag/i)).toBeInTheDocument();
  });

  it('opens Reddit as a separate scrollable app', () => {
    renderWithProviders(<AppRoutes />, { route: '/reddit' });
    expect(
      screen.getByRole('heading', { level: 1, name: /reddit-startseite/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/keine verbindung zu reddit/i)[0]).toBeInTheDocument();
    expect(
      screen.getByText(/der neue fahrplan ist ein echter gewinn/i),
    ).toBeInTheDocument();
  });

  it('renders the Reddit video and meme in the requested feed order', () => {
    const { container } = renderWithProviders(<AppRoutes />, { route: '/reddit' });
    const articles = screen.getAllByRole('article');

    expect(within(articles[0]).getByText(/in 20 minuten aufgebaut/i)).toBeInTheDocument();
    expect(
      within(articles[1]).getByRole('heading', {
        name: 'Doctor Doom Wins in Avengers: Doomsday',
      }),
    ).toBeInTheDocument();
    expect(within(articles[1]).getByText('r/marvel')).toBeInTheDocument();
    expect(within(articles[2]).getByText('r/de')).toBeInTheDocument();
    expect(within(articles[2]).getByRole('img', { name: /schildkröte oder einem frosch/i })).toHaveAttribute(
      'src',
      '/media/kerle.jpg',
    );

    const video = within(articles[1]).getByLabelText(
      'Video: Doctor Doom Wins in Avengers: Doomsday',
    ) as HTMLVideoElement;
    expect(video).toHaveAttribute('controls');
    expect(video).toHaveAttribute('preload', 'metadata');
    expect(video).toHaveClass('aspect-[4/3]');
    expect(video.autoplay).toBe(false);
    expect(video.muted).toBe(false);
    expect(container.querySelector('source[src="/media/doom.mp4"]')).toBeInTheDocument();
    expect(
      screen.queryByText(/ein lokal eingebundener beispielclip/i),
    ).not.toBeInTheDocument();
  });

  it('uses photo-feed conventions: action row, likes line, inline caption', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppRoutes />, { route: '/instagram' });

    const like = screen.getAllByRole('button', { name: /^gefällt mir$/i })[0];
    expect(like).toHaveAttribute('aria-pressed', 'false');
    await user.click(like);
    expect(
      screen.getAllByRole('button', { name: /gefällt mir zurücknehmen/i })[0],
    ).toHaveAttribute('aria-pressed', 'true');

    expect(
      screen.getAllByRole('button', { name: /beitrag speichern/i }).length,
    ).toBeGreaterThan(0);
    const allCommentsLink = screen.getAllByRole('link', {
      name: /alle .* kommentare ansehen/i,
    })[0];
    expect(allCommentsLink).toHaveAttribute('href', '/instagram/post/v-humor');
    expect(
      screen.getByRole('link', { name: '233 Kommentare ansehen' }),
    ).toHaveAttribute('href', '/instagram/post/v-humor');
    expect(
      screen.getAllByRole('link', { name: 'ETHOS-Auswertung' })[0],
    ).toHaveAttribute('href', '/instagram/post/v-humor/ethos');
  });

  /** Matches the whole "Gefällt N Personen" paragraph, spans and all. */
  const likesLine = (count: string) => (_: string, element: Element | null) =>
    element?.tagName === 'P' &&
    element.textContent?.replace(/\s+/g, ' ').trim() === `Gefällt ${count} Personen`;

  it('likes a post on double tap and never un-likes it that way', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppRoutes />, { route: '/instagram' });

    // The gesture this genre trained everyone to expect. The keyboard path to
    // the same state is the labelled heart button, which is why the picture
    // itself stays out of the accessibility tree.
    const media = screen.getAllByText(/beispielclip|simulierter platzhalter/i)[0];
    await user.dblClick(media);
    expect(screen.getAllByRole('button', { name: /gefällt mir zurücknehmen/i })[0]).toBeDefined();
    // The count sits in its own `tabular-nums` span, so match the paragraph.
    expect(screen.getByText(likesLine('12.841'))).toBeInTheDocument();

    // A second double tap must not quietly take the like back.
    await user.dblClick(media);
    // The count sits in its own `tabular-nums` span, so match the paragraph.
    expect(screen.getByText(likesLine('12.841'))).toBeInTheDocument();
  });

  it('loads example imagery for each post instead of a grey box', () => {
    const { container } = renderWithProviders(<AppRoutes />, {
      route: '/instagram',
    });

    // The feed is now photo-backed: five posts point at usable media files or
    // their poster/still frames, so the DOM must carry real picture nodes.
    // Count images inside media figures, not decorative product/app icons in
    // the surrounding device and assistance chrome.
    expect(container.querySelectorAll('figure img').length).toBe(5);
    expect(container.querySelectorAll('.meme-caption').length).toBeGreaterThan(0);
    // Same words in the picture and in the caption below it, the way this
    // genre repeats its punchline.
    expect(screen.getAllByText(/die küche hat verloren/i).length).toBe(2);
  });

  it('follows an account without pretending an account exists', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppRoutes />, { route: '/instagram' });

    const follow = screen.getAllByRole('button', { name: /^abonnieren$/i })[0];
    expect(follow).toHaveAttribute('aria-pressed', 'false');
    await user.click(follow);

    expect(
      screen.getAllByRole('button', { name: /^abonniert$/i })[0],
    ).toHaveAttribute('aria-pressed', 'true');
  });

  it('names the most frequent community reaction in visible text', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppRoutes />, { route: '/instagram' });

    expect(screen.getAllByText(/am häufigsten:/i).length).toBeGreaterThan(0);

    await user.click(
      screen.getAllByRole('button', { name: /reaktionen anderer ansehen/i })[0],
    );

    expect(
      screen.getByRole('dialog', { name: /so haben andere reagiert/i }),
    ).toBeInTheDocument();
  });

  it('labels the decorative platform controls as non-functional', () => {
    renderWithProviders(<AppRoutes />, { route: '/instagram' });

    expect(
      screen.getAllByRole('button', { name: /teilen \(im prototyp ohne funktion\)/i })
        .length,
    ).toBeGreaterThan(0);
    // The stories strip is scenery: no dead buttons in the keyboard path.
    expect(
      screen.queryByRole('button', { name: /dein beitrag/i }),
    ).not.toBeInTheDocument();
  });

  it('keeps the media layer labelled as either an example clip or a simulated fallback', () => {
    renderWithProviders(<AppRoutes />, { route: '/instagram' });
    expect(
      screen.getAllByText(/beispielclip|simulierter platzhalter/i).length,
    ).toBeGreaterThan(0);
  });

  it('shows the status bar with the camera reported as off', () => {
    renderWithProviders(<AppRoutes />, { route: '/instagram' });
    expect(screen.getByText(/^kamera aus$/i)).toBeInTheDocument();
    expect(screen.getByText(/inhaltsanalyse aktiv/i)).toBeInTheDocument();
  });
});

describe('persistent social interactions', () => {
  it('keeps an Instagram like and saved post after remounting the app', async () => {
    const user = userEvent.setup();
    const first = renderWithProviders(<AppRoutes />, { route: '/instagram' });

    await user.click(screen.getAllByRole('button', { name: /^gefällt mir$/i })[0]);
    await user.click(screen.getAllByRole('button', { name: /beitrag speichern/i })[0]);
    await waitFor(() => expect(localStorage.getItem(STORAGE_KEYS.engagements)).toContain('v-humor'));
    first.unmount();

    renderWithProviders(<AppRoutes />, { route: '/instagram' });
    expect(screen.getAllByRole('button', { name: /gefällt mir zurücknehmen/i })[0]).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getAllByRole('button', { name: /aus sammlung entfernen/i })[0]).toHaveAttribute('aria-pressed', 'true');
  });

  it('keeps interactions in memory only when history storage is disabled', async () => {
    const user = userEvent.setup();
    seedSettings({ storeReactionHistory: false });
    const first = renderWithProviders(<AppRoutes />, { route: '/instagram' });

    await user.click(screen.getAllByRole('button', { name: /^gefällt mir$/i })[0]);
    await waitFor(() => expect(localStorage.getItem(STORAGE_KEYS.engagements)).toBeNull());
    first.unmount();

    renderWithProviders(<AppRoutes />, { route: '/instagram' });
    expect(screen.getAllByRole('button', { name: /^gefällt mir$/i })[0]).toHaveAttribute('aria-pressed', 'false');
  });

  it('updates the current-session dashboard from Instagram and Reddit actions', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppRoutes />, { route: '/instagram' });

    await user.click(screen.getAllByRole('button', { name: /^gefällt mir$/i })[0]);
    await user.click(screen.getByRole('link', { name: /zum smartphone-startbildschirm/i }));
    await user.click(screen.getByRole('link', { name: /^reddit$/i }));
    await user.click(screen.getAllByRole('button', { name: /zustimmungen/i })[0]);
    await user.click(screen.getByRole('button', { name: /ethos öffnen/i }));
    await user.click(screen.getByRole('link', { name: /persönliche übersicht/i }));
    await user.click(screen.getByRole('button', { name: /diese sitzung/i }));

    const likesMetric = screen.getByText(/likes oder upvotes/i).parentElement!;
    expect(within(likesMetric).getByText('2')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /likes nach app/i })).toBeInTheDocument();
    expect(
      screen.getByText(/noch keine freiwillige selbstauskunft/i),
    ).toBeInTheDocument();
  });
});

describe('post detail', () => {
  it('opens ordinary Instagram controls in the native mock comment section', () => {
    renderWithProviders(<AppRoutes />, { route: '/instagram/post/v-ragebait' });

    expect(screen.getByRole('heading', { name: /^kommentare$/i })).toBeInTheDocument();
    expect(screen.getByText(/nicht alle haben morgens eine brauchbare alternative/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/kommentar hinzufügen/i)).toBeInTheDocument();
    expect(screen.queryByText(/assistenzschicht · analyse des inhalts/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /reaktionen der community/i }),
    ).not.toBeInTheDocument();
  });

  it('shows content, analysis and community reactions in order', () => {
    renderWithProviders(<AppRoutes />, { route: '/instagram/post/v-ragebait/ethos' });

    expect(screen.getByRole('heading', { name: /ethos-auswertung/i })).toBeInTheDocument();
    expect(screen.getByText(/assistenzschicht · analyse des inhalts/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /reaktionen der community/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/3\.178 Personen haben freiwillig teilgenommen/i)).toBeInTheDocument();
  });

  it('separates estimated and self-reported community data behind a switch', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppRoutes />, { route: '/instagram/post/v-ragebait/ethos' });

    const estimated = screen.getByRole('radio', { name: /automatische schätzungen/i });
    expect(estimated).toHaveAttribute('aria-checked', 'true');

    // The accessible table mirrors the chart; check the numbers move with it.
    expect(screen.getByRole('table')).toHaveTextContent('28 %');

    await user.click(screen.getByRole('radio', { name: /aktive selbstauskünfte/i }));

    expect(screen.getByRole('table')).toHaveTextContent('34 %');
    expect(screen.getByText(/742 Personen haben freiwillig teilgenommen/i)).toBeInTheDocument();
  });

  it('always warns that the group need not be representative', () => {
    renderWithProviders(<AppRoutes />, { route: '/instagram/post/v-ragebait/ethos' });
    expect(screen.getByText(/muss nicht repräsentativ sein/i)).toBeInTheDocument();
  });

  it('explains why no reaction timeline is shown without consent', () => {
    renderWithProviders(<AppRoutes />, { route: '/instagram/post/v-emotional/ethos' });
    expect(screen.getByText(/kein reaktionsverlauf verfügbar/i)).toBeInTheDocument();
  });

  it('shows the reaction timeline once capture is enabled', () => {
    seedSettings({ simulatedCameraCapture: true });
    renderWithProviders(<AppRoutes />, { route: '/instagram/post/v-emotional/ethos' });

    expect(
      screen.getByRole('heading', { name: /verlauf deiner geschätzten reaktion/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/00:19–00:27/)).toBeInTheDocument();
    expect(screen.getByText(/beweist nichts über dein empfinden/i)).toBeInTheDocument();
  });
});

describe('privacy dashboard', () => {
  it('states local-only processing and lists what is simulated', () => {
    renderWithProviders(<AppRoutes />, { route: '/ethos/privacy' });

    expect(
      screen.getByRole('heading', { name: /verarbeitung ausschließlich lokal/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/was in diesem prototyp simuliert ist/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /daten als json exportieren/i }),
    ).toBeInTheDocument();
  });

  it('asks for confirmation before deleting everything', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppRoutes />, { route: '/ethos/privacy' });

    await user.click(screen.getByRole('button', { name: /alle daten löschen/i }));

    expect(
      screen.getByRole('heading', { name: /alle gespeicherten daten löschen\?/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /abbrechen/i })).toBeInTheDocument();
  });
});

describe('settings', () => {
  it('unlocks the camera preview only after capture is enabled', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppRoutes />, { route: '/ethos/settings' });

    const preview = screen.getByRole('switch', { name: /kamera-vorschau/i });
    expect(preview).toBeDisabled();

    await user.click(
      screen.getByRole('switch', { name: /simulierte eigene reaktionserfassung/i }),
    );

    expect(screen.getByRole('switch', { name: /kamera-vorschau/i })).toBeEnabled();
  });

  it('turns the preview and sharing back off when capture is disabled again', async () => {
    const user = userEvent.setup();
    seedSettings({
      simulatedCameraCapture: true,
      liveCameraPreview: true,
      shareAnonymousReaction: true,
    });
    renderWithProviders(<AppRoutes />, { route: '/ethos/settings' });

    await user.click(
      screen.getByRole('switch', { name: /simulierte eigene reaktionserfassung/i }),
    );

    expect(screen.getByRole('switch', { name: /kamera-vorschau/i })).not.toBeChecked();
    expect(
      screen.getByRole('switch', { name: /anonym weitergeben/i }),
    ).not.toBeChecked();
  });

  it('pauses every hint at once', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppRoutes />, { route: '/ethos/settings' });

    await user.click(screen.getByRole('button', { name: /alles pausieren/i }));

    expect(screen.getByText(/assistent pausiert/i)).toBeInTheDocument();
  });
});

describe('research mode', () => {
  it('offers exactly the three scenarios from the brief', () => {
    renderWithProviders(<AppRoutes />, { route: '/ethos/research' });

    expect(screen.getByText(/szenario 1: sarkasmus/i)).toBeInTheDocument();
    expect(screen.getByText(/szenario 2: community-reaktionen/i)).toBeInTheDocument();
    expect(screen.getByText(/szenario 3: eigene reaktion korrigieren/i)).toBeInTheDocument();
  });

  it('runs a scenario through to a saved rating', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppRoutes />, { route: '/ethos/research' });

    await user.click(
      within(
        screen.getByText(/szenario 1: sarkasmus/i).closest('div')!.parentElement!
          .parentElement!,
      ).getByRole('button', { name: /starten/i }),
    );

    expect(screen.getByText(/aufgabe läuft/i)).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /aufgabe erledigt – jetzt bewerten/i }),
    );

    // All four questions must be answered before saving is possible.
    const save = screen.getByRole('button', { name: /bewertung speichern/i });
    expect(save).toBeDisabled();

    for (const group of ['understandable', 'helpful', 'intrusive', 'trust']) {
      await user.click(document.querySelector(`input[name="${group}"][value="4"]`)!);
    }

    expect(save).toBeEnabled();
    await user.click(save);

    expect(screen.getByText(/wurde lokal gespeichert/i)).toBeInTheDocument();
    expect(screen.getByText(/ergebnisse \(1 von 3\)/i)).toBeInTheDocument();
  });
});

describe('personal overview', () => {
  it('shows a seeded profile but an honest empty current session', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppRoutes />, { route: '/ethos/overview' });
    expect(screen.getByText(/fiktives langzeitprofil/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /welche post-arten/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /diese sitzung/i }));
    expect(screen.getByText(/noch keine sitzungsstatistik/i)).toBeInTheDocument();
  });

  it('records viewed posts and allows deleting a single entry', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppRoutes />, { route: '/reddit' });

    // Visiting the feed logs the posts. The ETHOS app is not part of the
    // simulated platform, so it is reached through the floating extension
    // button that sits over it.
    await user.click(screen.getByRole('button', { name: /ethos öffnen/i }));
    await user.click(screen.getByRole('link', { name: /persönliche übersicht/i }));

    expect(
      screen.getByRole('heading', { name: /ethos-statistiken/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /diese sitzung/i }));

    const historySection = screen.getByRole('heading', { name: /zuletzt betrachtete beiträge/i }).parentElement!;
    const deleteButtons = within(historySection).getAllByRole('button', { name: /löschen$/i });
    const countBefore = deleteButtons.length;
    expect(countBefore).toBeGreaterThan(0);

    await user.click(deleteButtons[0]);

    expect(within(historySection).getAllByRole('button', { name: /löschen$/i })).toHaveLength(
      countBefore - 1,
    );
  });
});

describe('recovery and legacy routes', () => {
  it('shows a recovery page and preserves an old Reddit link', () => {
    const recovery = renderWithProviders(<AppRoutes />, { route: '/nope' });
    expect(
      screen.getByRole('heading', { name: /diese seite gibt es nicht/i }),
    ).toBeInTheDocument();

    recovery.unmount();
    renderWithProviders(<AppRoutes />, { route: '/feed/discussion' });
    expect(
      screen.getByRole('heading', { name: /reddit-startseite/i }),
    ).toBeInTheDocument();
  });
});
