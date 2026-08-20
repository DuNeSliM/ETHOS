/**
 * Compatibility exports for older social-shell imports. Product labels and
 * mock notices now live in the central identity module.
 */
export { PRODUCT_NAME, SOCIAL_PLATFORMS, getPlatformMeta } from '@/lib/identity';

/** Compatibility aliases for components that are specific to the photo app. */
export const PLATFORM_NAME = 'Instagram';
export const PLATFORM_TAGLINE = 'Inoffizieller Foto-App-Mock';
