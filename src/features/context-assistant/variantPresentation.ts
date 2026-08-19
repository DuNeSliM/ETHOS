import {
  Flame,
  HeartPulse,
  Laugh,
  MessageCircleQuestion,
  MessageSquareQuote,
  ScanSearch,
  Scale,
} from 'lucide-react';

import type { ChipTone } from '@/components/primitives';
import type { AssistantCardVariant } from '@/types';

/**
 * Icon and colour family per card variant.
 *
 * Colour is redundant here by design: the card always shows the variant title
 * as text and an icon with its own distinct silhouette, so the tone is never
 * the only carrier of meaning.
 */
export const VARIANT_PRESENTATION: Record<
  AssistantCardVariant,
  { icon: typeof Flame; tone: ChipTone }
> = {
  sarcasm: { icon: MessageSquareQuote, tone: 'caution' },
  irony: { icon: MessageCircleQuestion, tone: 'caution' },
  emotional: { icon: HeartPulse, tone: 'info' },
  exaggeration: { icon: Laugh, tone: 'positive' },
  ragebait: { icon: Flame, tone: 'alert' },
  ambiguous: { icon: Scale, tone: 'neutral' },
  'insufficient-context': { icon: ScanSearch, tone: 'neutral' },
};
