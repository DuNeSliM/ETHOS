import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { LiveSelfView } from '@/features/reactions/LiveSelfView';
import { renderWithProviders, seedSettings } from '@/test/utils';

/**
 * The self-view is the one element of this prototype that touches real
 * hardware. These tests hold the two promises made around it: it appears only
 * with explicit consent, and it never lets the real picture lend credibility
 * to the scripted estimates.
 *
 * jsdom has no `navigator.mediaDevices`, so the component runs its
 * no-camera-available path here. That is exactly the path a participant on a
 * machine without a webcam gets, and it must not break anything.
 */
describe('LiveSelfView', () => {
  it('renders nothing by default', () => {
    const { container } = renderWithProviders(<LiveSelfView />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when the preview is on but capture was never consented to', () => {
    seedSettings({ liveCameraPreview: true, simulatedCameraCapture: false });
    const { container } = renderWithProviders(<LiveSelfView />);
    expect(container).toBeEmptyDOMElement();
  });

  it('disappears while the assistance layer is paused', () => {
    seedSettings({
      simulatedCameraCapture: true,
      liveCameraPreview: true,
      assistantPaused: true,
    });
    const { container } = renderWithProviders(<LiveSelfView />);
    expect(container).toBeEmptyDOMElement();
  });

  it('appears with both switches on and says the picture is not evaluated', () => {
    seedSettings({ simulatedCameraCapture: true, liveCameraPreview: true });
    renderWithProviders(<LiveSelfView />);

    expect(screen.getByRole('button', { name: /kamerabild von dir/i })).toBeInTheDocument();
    expect(screen.getByText(/wird nicht ausgewertet/i)).toBeInTheDocument();
  });

  it('separates the real picture from the simulated reading in its panel', async () => {
    const user = userEvent.setup();
    seedSettings({ simulatedCameraCapture: true, liveCameraPreview: true });
    renderWithProviders(<LiveSelfView />);

    await user.click(screen.getByRole('button', { name: /kamerabild von dir/i }));

    const dialog = screen.getByRole('dialog', { name: /was die kamera sieht/i });
    expect(dialog).toHaveTextContent(/Echt:\s*das\s*Kamerabild/i);
    expect(dialog).toHaveTextContent(/Simuliert:\s*jede Reaktionsschätzung/i);
    expect(dialog).toHaveTextContent(/Nicht vorhanden:/i);
  });

  it('switches itself off from its own panel', async () => {
    const user = userEvent.setup();
    seedSettings({ simulatedCameraCapture: true, liveCameraPreview: true });
    renderWithProviders(<LiveSelfView />);

    await user.click(screen.getByRole('button', { name: /kamerabild von dir/i }));
    await user.click(screen.getByRole('button', { name: /kamerabild ausschalten/i }));

    expect(
      screen.queryByRole('button', { name: /kamerabild von dir/i }),
    ).not.toBeInTheDocument();
  });
});
