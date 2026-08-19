import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ContextAssistantButton } from '@/features/context-assistant/ContextAssistantButton';
import { renderWithProviders, seedSettings } from '@/test/utils';

describe('ContextAssistantButton', () => {
  it('shows nothing about the analysis until it is opened', () => {
    renderWithProviders(<ContextAssistantButton postId="v-sarcasm" />);

    expect(
      screen.getByRole('button', { name: /kontext erklären/i }),
    ).toBeInTheDocument();
    // The brief forbids permanent emotion banners over the content.
    expect(screen.queryByText(/wahrscheinlich sarkastisch/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens a labelled dialog with the sarcasm reading', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContextAssistantButton postId="v-sarcasm" />);

    await user.click(screen.getByRole('button', { name: /kontext erklären/i }));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAccessibleName(/wahrscheinlich sarkastisch/i);
    // The card subtitle and the explanation both carry the phrase.
    expect(
      screen.getAllByText(/vermutlich nicht wörtlich gemeint/i).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByText(/stark positive formulierung steht im widerspruch/i),
    ).toBeInTheDocument();
  });

  it('states the uncertainty and the limits of the analysis', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContextAssistantButton postId="v-sarcasm" />);
    await user.click(screen.getByRole('button', { name: /kontext erklären/i }));

    expect(
      screen.getByText(/sicherheit der einschätzung: mittel/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/was diese analyse nicht wissen kann/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/ohne tonfall bleibt sarkasmus im text unsicher/i),
    ).toBeInTheDocument();
  });

  it('marks the result as an interpretation rather than a fact', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContextAssistantButton postId="v-sarcasm" />);
    await user.click(screen.getByRole('button', { name: /kontext erklären/i }));

    expect(screen.getByText(/interpretation, keine tatsache/i)).toBeInTheDocument();
    expect(screen.getAllByText(/simuliert/i).length).toBeGreaterThan(0);
  });

  it('reveals the indicators behind "Warum wird das so eingeschätzt?"', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContextAssistantButton postId="v-sarcasm" />);
    await user.click(screen.getByRole('button', { name: /kontext erklären/i }));

    const why = screen.getByRole('button', {
      name: /warum wird das so eingeschätzt/i,
    });
    expect(why).toHaveAttribute('aria-expanded', 'false');

    await user.click(why);

    expect(screen.getByText(/übertrieben positive wortwahl/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /erklärung ausblenden/i }),
    ).toHaveAttribute('aria-expanded', 'true');
  });

  it('offers alternative readings via "Andere Interpretation"', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContextAssistantButton postId="v-sarcasm" />);
    await user.click(screen.getByRole('button', { name: /kontext erklären/i }));

    expect(screen.queryByText(/andere mögliche lesarten/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /andere interpretation/i }));

    expect(screen.getByText(/andere mögliche lesarten/i)).toBeInTheDocument();
    expect(
      screen.getByText(/könnte es ernst meinen und den tag trotz verspätung/i),
    ).toBeInTheDocument();
  });

  it('acknowledges "Nicht hilfreich" feedback', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContextAssistantButton postId="v-sarcasm" />);
    await user.click(screen.getByRole('button', { name: /kontext erklären/i }));
    await user.click(screen.getByRole('button', { name: /nicht hilfreich/i }));

    expect(screen.getByRole('status')).toHaveTextContent(/nicht hilfreich war/i);
  });

  it('shows the ragebait card as a possibility, not a verdict', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContextAssistantButton postId="v-ragebait" />);
    await user.click(screen.getByRole('button', { name: /kontext erklären/i }));

    expect(screen.getByRole('dialog')).toHaveAccessibleName(
      /könnte auf reaktionen ausgerichtet sein/i,
    );
    expect(screen.getByText(/grad: hoch/i)).toBeInTheDocument();
    expect(
      screen.getByText(/vermutung über die formulierung, kein nachweis/i),
    ).toBeInTheDocument();
  });

  it('admits when there is not enough context instead of guessing', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContextAssistantButton postId="v-lowcontext" />);
    await user.click(screen.getByRole('button', { name: /kontext erklären/i }));

    expect(screen.getByRole('dialog')).toHaveAccessibleName(
      /zu wenig kontext für eine einschätzung/i,
    );
  });

  it('explains which setting is hiding a withheld hint', async () => {
    const user = userEvent.setup();
    seedSettings({ sarcasmHints: false });
    renderWithProviders(<ContextAssistantButton postId="v-sarcasm" />);

    await user.click(screen.getByRole('button', { name: /kontext erklären/i }));

    expect(
      screen.getByText(/sarkasmus- und ironiehinweise sind ausgeschaltet/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /zu den einstellungen/i }),
    ).toBeInTheDocument();
  });

  it('renders no affordance for content without a scripted analysis', () => {
    const { container } = renderWithProviders(
      <ContextAssistantButton postId="no-such-post" />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});

describe('assistant dialog accessibility', () => {
  it('moves focus into the dialog and closes on Escape', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContextAssistantButton postId="v-sarcasm" />);

    const trigger = screen.getByRole('button', { name: /kontext erklären/i });
    await user.click(trigger);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    await waitFor(() =>
      expect(dialog).toContainElement(document.activeElement as HTMLElement | null),
    );

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    // Focus must return to the trigger, not to the document body.
    expect(trigger).toHaveFocus();
  });

  it('can be opened with the keyboard alone', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContextAssistantButton postId="v-sarcasm" />);

    await user.tab();
    expect(screen.getByRole('button', { name: /kontext erklären/i })).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
