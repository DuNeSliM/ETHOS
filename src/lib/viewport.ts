/**
 * Scrolling helpers that work in both presentations of the prototype.
 *
 * On a phone the browser window scrolls. Inside the simulated device frame the
 * window does not move at all - the scroll container is the phone screen
 * (`#app-viewport`). Anything that wants to move the view has to address both,
 * otherwise navigating from a long feed into a settings screen opens it
 * halfway down.
 */
const VIEWPORT_ID = 'app-viewport';

export function getAppViewport(): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  return document.getElementById(VIEWPORT_ID);
}

export function scrollAppToTop(): void {
  // Optional calls: jsdom implements neither of these, and the tests must not
  // need a stub for a purely cosmetic effect.
  getAppViewport()?.scrollTo?.({ top: 0, behavior: 'auto' });
  window.scrollTo?.({ top: 0, behavior: 'auto' });
}
