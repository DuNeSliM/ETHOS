import { Navigate, Route, Routes } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

import { AppStateProvider } from '@/app/AppStateProvider';
import { AppShell } from '@/app/AppShell';
import { DiscussionFeedPage } from '@/pages/DiscussionFeedPage';
import { HowItWorksPage } from '@/pages/HowItWorksPage';
import { LandingPage } from '@/pages/LandingPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { OnboardingPage } from '@/pages/OnboardingPage';
import { OverviewPage } from '@/pages/OverviewPage';
import { PostDetailPage } from '@/pages/PostDetailPage';
import { PrivacyPage } from '@/pages/PrivacyPage';
import { ResearchModePage } from '@/pages/ResearchModePage';
import { SettingsPage } from '@/pages/SettingsPage';
import { VisualFeedPage } from '@/pages/VisualFeedPage';

/**
 * Route table.
 *
 * The landing page and the onboarding sit outside the app shell so they can
 * use the full width; everything a participant navigates between during a test
 * lives inside `<AppShell>` and therefore always shows the status bar (what is
 * active, what is simulated, where data is stored).
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />

      <Route element={<AppShell />}>
        <Route path="/feed" element={<Navigate to="/feed/visual" replace />} />
        <Route path="/feed/visual" element={<VisualFeedPage />} />
        <Route path="/feed/discussion" element={<DiscussionFeedPage />} />
        <Route path="/post/:postId" element={<PostDetailPage />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/research" element={<ResearchModePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppStateProvider>
  );
}
