import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AppRoutes } from '@/app/App';
import { DEFAULT_SETTINGS } from '@/app/AppStateProvider';
import { renderWithProviders, seedSettings } from '@/test/utils';

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

  it('offers the platform and ContextLens as two separate apps', () => {
    renderWithProviders(<AppRoutes />, { route: '/phone' });

    expect(
      screen.getAllByRole('link', { name: /momento/i }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole('link', { name: /^contextlens$/i }),
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
});

describe('assistance layer over a foreign app', () => {
  it('marks the feed as someone else’s app and keeps the extension visible', () => {
    renderWithProviders(<AppRoutes />, { route: '/feed/visual' });

    // Platform chrome.
    expect(screen.getByRole('link', { name: /^start/i })).toBeInTheDocument();
    // Assistance layer, on top of it.
    expect(
      screen.getByRole('button', { name: /contextlens öffnen/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/beiträge, konten und zahlen sind erfunden/i),
    ).toBeInTheDocument();
  });

  it('pauses the whole layer from the overlay panel', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppRoutes />, { route: '/feed/visual' });

    expect(screen.getByText(/^inhaltsanalyse aktiv$/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /contextlens öffnen/i }));
    await user.click(screen.getByRole('switch', { name: /assistenzschicht aktiv/i }));

    expect(screen.getAllByText(/pausiert/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/^inhaltsanalyse aktiv$/i)).not.toBeInTheDocument();
  });

  it('never reports the analysis as running when it is switched off', () => {
    // "Paused" and "analysis off" are different states. The strip over the
    // foreign app is the only status a participant sees while browsing, so it
    // must not collapse the two.
    seedSettings({ contentAnalysis: false });
    renderWithProviders(<AppRoutes />, { route: '/feed/visual' });

    expect(screen.getByText(/^inhaltsanalyse aus$/i)).toBeInTheDocument();
    expect(screen.queryByText(/assistent pausiert/i)).not.toBeInTheDocument();
  });

  it('says so when a platform control does not exist in the prototype', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppRoutes />, { route: '/feed/visual' });

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
    renderWithProviders(<AppRoutes />, { route: '/feed/visual' });

    expect(
      screen.getByRole('heading', { level: 1, name: /visual feed/i }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: /kontext erklären/i }).length,
    ).toBeGreaterThanOrEqual(4);
    expect(screen.getByText(/absolut perfekter start in den tag/i)).toBeInTheDocument();
  });

  it('switches to the discussion feed', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppRoutes />, { route: '/feed/visual' });

    await user.click(screen.getByRole('link', { name: /discussion feed/i }));

    expect(
      screen.getByRole('heading', { level: 1, name: /discussion feed/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/der neue fahrplan ist ein echter gewinn/i),
    ).toBeInTheDocument();
  });

  it('uses photo-feed conventions: action row, likes line, inline caption', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppRoutes />, { route: '/feed/visual' });

    const like = screen.getAllByRole('button', { name: /^gefällt mir$/i })[0];
    expect(like).toHaveAttribute('aria-pressed', 'false');
    await user.click(like);
    expect(
      screen.getAllByRole('button', { name: /gefällt mir zurücknehmen/i })[0],
    ).toHaveAttribute('aria-pressed', 'true');

    expect(
      screen.getAllByRole('button', { name: /beitrag speichern/i }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole('link', { name: /alle .* kommentare ansehen/i }).length,
    ).toBeGreaterThan(0);
  });

  it('labels the decorative platform controls as non-functional', () => {
    renderWithProviders(<AppRoutes />, { route: '/feed/visual' });

    expect(
      screen.getAllByRole('button', { name: /teilen \(im prototyp ohne funktion\)/i })
        .length,
    ).toBeGreaterThan(0);
    // The stories strip is scenery: no dead buttons in the keyboard path.
    expect(
      screen.queryByRole('button', { name: /dein beitrag/i }),
    ).not.toBeInTheDocument();
  });

  it('keeps every media placeholder marked as simulated', () => {
    renderWithProviders(<AppRoutes />, { route: '/feed/visual' });
    expect(screen.getAllByText(/simulierter platzhalter/i).length).toBeGreaterThan(0);
  });

  it('shows the status bar with the camera reported as off', () => {
    renderWithProviders(<AppRoutes />, { route: '/feed/visual' });
    expect(screen.getByText(/^kamera aus$/i)).toBeInTheDocument();
    expect(screen.getByText(/inhaltsanalyse aktiv/i)).toBeInTheDocument();
  });
});

describe('post detail', () => {
  it('shows content, analysis and community reactions in order', () => {
    renderWithProviders(<AppRoutes />, { route: '/post/v-ragebait' });

    expect(screen.getByText(/assistenzschicht · analyse des inhalts/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /reaktionen der community/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/3\.178 Personen haben freiwillig teilgenommen/i)).toBeInTheDocument();
  });

  it('separates estimated and self-reported community data behind a switch', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppRoutes />, { route: '/post/v-ragebait' });

    const estimated = screen.getByRole('radio', { name: /automatische schätzungen/i });
    expect(estimated).toHaveAttribute('aria-checked', 'true');

    // The accessible table mirrors the chart; check the numbers move with it.
    expect(screen.getByRole('table')).toHaveTextContent('28 %');

    await user.click(screen.getByRole('radio', { name: /aktive selbstauskünfte/i }));

    expect(screen.getByRole('table')).toHaveTextContent('34 %');
    expect(screen.getByText(/742 Personen haben freiwillig teilgenommen/i)).toBeInTheDocument();
  });

  it('always warns that the group need not be representative', () => {
    renderWithProviders(<AppRoutes />, { route: '/post/v-ragebait' });
    expect(screen.getByText(/muss nicht repräsentativ sein/i)).toBeInTheDocument();
  });

  it('explains why no reaction timeline is shown without consent', () => {
    renderWithProviders(<AppRoutes />, { route: '/post/v-emotional' });
    expect(screen.getByText(/kein reaktionsverlauf verfügbar/i)).toBeInTheDocument();
  });

  it('shows the reaction timeline once capture is enabled', () => {
    seedSettings({ simulatedCameraCapture: true });
    renderWithProviders(<AppRoutes />, { route: '/post/v-emotional' });

    expect(
      screen.getByRole('heading', { name: /verlauf deiner geschätzten reaktion/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/00:19–00:27/)).toBeInTheDocument();
    expect(screen.getByText(/beweist nichts über dein empfinden/i)).toBeInTheDocument();
  });
});

describe('privacy dashboard', () => {
  it('states local-only processing and lists what is simulated', () => {
    renderWithProviders(<AppRoutes />, { route: '/privacy' });

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
    renderWithProviders(<AppRoutes />, { route: '/privacy' });

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
    renderWithProviders(<AppRoutes />, { route: '/settings' });

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
    renderWithProviders(<AppRoutes />, { route: '/settings' });

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
    renderWithProviders(<AppRoutes />, { route: '/settings' });

    await user.click(screen.getByRole('button', { name: /alles pausieren/i }));

    expect(screen.getByText(/assistent pausiert/i)).toBeInTheDocument();
  });
});

describe('research mode', () => {
  it('offers exactly the three scenarios from the brief', () => {
    renderWithProviders(<AppRoutes />, { route: '/research' });

    expect(screen.getByText(/szenario 1: sarkasmus/i)).toBeInTheDocument();
    expect(screen.getByText(/szenario 2: community-reaktionen/i)).toBeInTheDocument();
    expect(screen.getByText(/szenario 3: eigene reaktion korrigieren/i)).toBeInTheDocument();
  });

  it('runs a scenario through to a saved rating', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppRoutes />, { route: '/research' });

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
  it('shows an empty state before anything has been viewed', () => {
    renderWithProviders(<AppRoutes />, { route: '/overview' });
    expect(screen.getByText(/noch keine einträge/i)).toBeInTheDocument();
  });

  it('records viewed posts and allows deleting a single entry', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppRoutes />, { route: '/feed/discussion' });

    // Visiting the feed logs the posts. The ContextLens app is not part of the
    // simulated platform, so it is reached through the floating extension
    // button that sits over it.
    await user.click(screen.getByRole('button', { name: /contextlens öffnen/i }));
    await user.click(screen.getByRole('link', { name: /persönliche übersicht/i }));

    expect(
      screen.getByRole('heading', { name: /persönliche übersicht/i }),
    ).toBeInTheDocument();

    const deleteButtons = screen.getAllByRole('button', { name: /löschen$/i });
    const countBefore = deleteButtons.length;
    expect(countBefore).toBeGreaterThan(0);

    await user.click(deleteButtons[0]);

    expect(screen.getAllByRole('button', { name: /löschen$/i })).toHaveLength(
      countBefore - 1,
    );
  });
});

describe('unknown routes', () => {
  it('shows a recovery page rather than a blank screen', () => {
    renderWithProviders(<AppRoutes />, { route: '/nope' });
    expect(
      screen.getByRole('heading', { name: /diese seite gibt es nicht/i }),
    ).toBeInTheDocument();
  });
});
