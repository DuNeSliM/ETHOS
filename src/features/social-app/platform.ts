/**
 * Identity of the simulated platform.
 *
 * ContextLens only makes sense on top of someone else's app, so the prototype
 * needs a plausible host. `Momento` is invented: it borrows the *conventions*
 * of photo-sharing apps (wordmark, stories strip, full-bleed media, action row,
 * tab bar) so participants recognise the genre in a second, and borrows nothing
 * from any real product - no real name, no real logo, no lifted icons, invented
 * accounts, invented numbers.
 *
 * Kept in one constant so the name can be changed in a single place if a study
 * needs a different framing.
 */
export const PLATFORM_NAME = 'Momento';

export const PLATFORM_TAGLINE = 'Simulierte Foto-App';
