import type { SocialPlatform } from '@/types';

/** User-facing product identity. Internal legacy names remain for storage compatibility. */
export const PRODUCT_NAME = 'ETHOS';

export type SocialPlatformMeta = {
  id: SocialPlatform;
  name: 'Instagram' | 'Reddit';
  homePath: '/instagram' | '/reddit';
  tagline: string;
  mockNotice: string;
};

export const SOCIAL_PLATFORMS: Record<SocialPlatform, SocialPlatformMeta> = {
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    homePath: '/instagram',
    tagline: 'Inoffizieller Foto-App-Mock',
    mockNotice:
      'Inoffizieller Instagram-Mock · keine Verbindung zu Instagram · Beiträge, Konten und Zahlen sind erfunden',
  },
  reddit: {
    id: 'reddit',
    name: 'Reddit',
    homePath: '/reddit',
    tagline: 'Inoffizieller Diskussions-App-Mock',
    mockNotice:
      'Inoffizieller Reddit-Mock · keine Verbindung zu Reddit · Beiträge, Konten und Zahlen sind erfunden',
  },
};

export function getPlatformMeta(platform: SocialPlatform): SocialPlatformMeta {
  return SOCIAL_PLATFORMS[platform];
}
