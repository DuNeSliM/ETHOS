import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { OwnReactionControl } from '@/features/reactions/OwnReactionControl';
import { renderWithProviders, seedSettings } from '@/test/utils';

/**
 * These tests encode the product's central promise: an automatic estimate and
 * a person's own statement about themselves are never merged, and the estimate
 * never appears without consent.
 */
describe('OwnReactionControl', () => {
  it('renders nothing while simulated capture is off', () => {
    const { container } = renderWithProviders(
      <OwnReactionControl postId="v-ragebait" />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing while the assistant is paused', () => {
    seedSettings({ simulatedCameraCapture: true, assistantPaused: true });
    const { container } = renderWithProviders(
      <OwnReactionControl postId="v-ragebait" />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('describes a visible expression rather than an emotion', async () => {
    seedSettings({ simulatedCameraCapture: true });
    renderWithProviders(<OwnReactionControl postId="v-ragebait" />);

    // "sichtbares Lächeln", not "du bist glücklich".
    expect(
      screen.getByRole('button', { name: /geschätzt: sichtbares lächeln/i }),
    ).toBeInTheDocument();
  });

  it('keeps estimate and self report as two separate labelled rows', async () => {
    const user = userEvent.setup();
    seedSettings({ simulatedCameraCapture: true });
    renderWithProviders(<OwnReactionControl postId="v-ragebait" />);

    await user.click(screen.getByRole('button', { name: /geschätzt/i }));

    const dialog = screen.getByRole('dialog');
    expect(
      within(dialog).getByText(/automatisch geschätzter ausdruck/i),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(/von dir angegebene reaktion/i),
    ).toBeInTheDocument();
    expect(within(dialog).getByText(/noch keine angabe gemacht/i)).toBeInTheDocument();
  });

  it('records a correction without discarding the original estimate', async () => {
    const user = userEvent.setup();
    seedSettings({ simulatedCameraCapture: true });
    renderWithProviders(<OwnReactionControl postId="v-ragebait" />);

    await user.click(screen.getByRole('button', { name: /geschätzt/i }));
    await user.click(screen.getByRole('button', { name: /^genervt$/i }));

    // Sheet closes and the chip now leads with the person's own answer.
    expect(
      screen.getByRole('button', { name: /deine angabe: genervt/i }),
    ).toBeInTheDocument();

    // Reopening still shows both values side by side.
    await user.click(screen.getByRole('button', { name: /deine angabe/i }));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/sichtbares lächeln/i)).toBeInTheDocument();
    expect(
      within(dialog).getByText(/deine angabe hat vorrang/i),
    ).toBeInTheDocument();
  });

  it('lets a participant remove their own statement again', async () => {
    const user = userEvent.setup();
    seedSettings({ simulatedCameraCapture: true });
    renderWithProviders(<OwnReactionControl postId="v-ragebait" />);

    await user.click(screen.getByRole('button', { name: /geschätzt/i }));
    await user.click(screen.getByRole('button', { name: /^verwirrt$/i }));
    await user.click(screen.getByRole('button', { name: /deine angabe/i }));
    await user.click(screen.getByRole('button', { name: /meine angabe entfernen/i }));

    expect(screen.getByText(/noch keine angabe gemacht/i)).toBeInTheDocument();
  });

  it('offers all nine self-report options from the brief', async () => {
    const user = userEvent.setup();
    seedSettings({ simulatedCameraCapture: true });
    renderWithProviders(<OwnReactionControl postId="v-humor" />);

    await user.click(screen.getByRole('button', { name: /geschätzt/i }));

    [
      'amüsiert',
      'interessiert',
      'überrascht',
      'verwirrt',
      'genervt',
      'verärgert',
      'unangenehm berührt',
      'neutral',
      'andere Reaktion',
    ].forEach((label) => {
      expect(
        screen.getByRole('button', { name: new RegExp(`^${label}$`, 'i') }),
      ).toBeInTheDocument();
    });
  });

  it('states that no real camera is involved', async () => {
    const user = userEvent.setup();
    seedSettings({ simulatedCameraCapture: true });
    renderWithProviders(<OwnReactionControl postId="v-humor" />);

    await user.click(screen.getByRole('button', { name: /geschätzt/i }));

    expect(
      screen.getByText(/keine echte kamera ausgewertet/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/anonyme weitergabe ist ausgeschaltet/i),
    ).toBeInTheDocument();
  });
});
