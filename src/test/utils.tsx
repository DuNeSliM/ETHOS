import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { ReactElement, ReactNode } from 'react';

import { AppStateProvider, DEFAULT_SETTINGS } from '@/app/AppStateProvider';
import { STORAGE_KEYS, writeJson } from '@/lib/storage';
import type { Settings } from '@/types';

/**
 * Seeds localStorage before mounting, which is how the provider picks up
 * non-default consent settings. Call before `renderWithProviders`.
 */
export function seedSettings(overrides: Partial<Settings>): void {
  writeJson(STORAGE_KEYS.settings, { ...DEFAULT_SETTINGS, ...overrides });
}

export function renderWithProviders(
  ui: ReactElement,
  {
    route = '/',
    path,
    ...options
  }: { route?: string; path?: string } & Omit<RenderOptions, 'wrapper'> = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <AppStateProvider>
        <MemoryRouter initialEntries={[route]}>
          {path ? (
            <Routes>
              <Route path={path} element={children} />
            </Routes>
          ) : (
            children
          )}
        </MemoryRouter>
      </AppStateProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}
