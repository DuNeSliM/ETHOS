import { Navigate, Route, Routes } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

import { AppStateProvider } from '@/app/AppStateProvider';
import { AppShell } from '@/app/AppShell';
import { DeviceLayout } from '@/features/device/DeviceFrame';
import { SocialAppShell } from '@/features/social-app/SocialAppShell';
import { DiscussionFeedPage } from '@/pages/DiscussionFeedPage';
import { HowItWorksPage } from '@/pages/HowItWorksPage';
import { LandingPage } from '@/pages/LandingPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { OnboardingPage } from '@/pages/OnboardingPage';
import { OverviewPage } from '@/pages/OverviewPage';
import { PhoneHomePage } from '@/pages/PhoneHomePage';
import { PostDetailPage } from '@/pages/PostDetailPage';
import { PrivacyPage } from '@/pages/PrivacyPage';
import { ResearchModePage } from '@/pages/ResearchModePage';
import { SettingsPage } from '@/pages/SettingsPage';
import { VisualFeedPage } from '@/pages/VisualFeedPage';

/**
 * Route table.
 *
 * Three layers, and the nesting is the product argument:
 *
 *  - the project pages (landing, how it works) are a website about the concept
 *    and stay full width;
 *  - `<DeviceLayout>` is the simulated phone. Everything a participant
 *    navigates between during a test happens inside it;
 *  - inside the phone, `<SocialAppShell>` is a foreign app and `<AppShell>` is
 *    ContextLens itself. Both are reachable from the home screen, neither
 *    contains the other.
 *
 * The consent flow sits inside the device but outside both apps: it is the
 * extension's first-run screen, before any app is opened.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />

      <Route element={<DeviceLayout />}>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/phone" element={<PhoneHomePage />} />

        <Route element={<SocialAppShell />}>
          <Route path="/feed" element={<Navigate to="/feed/visual" replace />} />
          <Route path="/feed/visual" element={<VisualFeedPage />} />
          <Route path="/feed/discussion" element={<DiscussionFeedPage />} />
          <Route path="/post/:postId" element={<PostDetailPage />} />
        </Route>

        <Route element={<AppShell />}>
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/research" element={<ResearchModePage />} />
        </Route>
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
