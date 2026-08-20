import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

import { AppStateProvider } from '@/app/AppStateProvider';
import { AppShell } from '@/app/AppShell';
import { DeviceLayout } from '@/features/device/DeviceFrame';
import { SocialAppShell } from '@/features/social-app/SocialAppShell';
import { RedditAppShell } from '@/features/social-app/RedditAppShell';
import { getPost } from '@/data/posts';
import { DiscussionFeedPage } from '@/pages/DiscussionFeedPage';
import { HowItWorksPage } from '@/pages/HowItWorksPage';
import { InstagramCommentsPage } from '@/pages/InstagramCommentsPage';
import { LandingPage } from '@/pages/LandingPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { OnboardingPage } from '@/pages/OnboardingPage';
import { OverviewPage } from '@/pages/OverviewPage';
import { PhoneHomePage } from '@/pages/PhoneHomePage';
import { PostDetailPage } from '@/pages/PostDetailPage';
import { PrivacyPage } from '@/pages/PrivacyPage';
import { RedditPostPage } from '@/pages/RedditPostPage';
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
 *    ETHOS itself. All are reachable from the home screen; none
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
          <Route path="/instagram" element={<VisualFeedPage />} />
          <Route path="/instagram/post/:postId" element={<InstagramCommentsPage />} />
          <Route path="/instagram/post/:postId/ethos" element={<PostDetailPage expectedPlatform="instagram" />} />
        </Route>

        <Route element={<RedditAppShell />}>
          <Route path="/reddit" element={<DiscussionFeedPage />} />
          <Route path="/reddit/post/:postId" element={<RedditPostPage />} />
          <Route path="/reddit/post/:postId/ethos" element={<PostDetailPage expectedPlatform="reddit" />} />
        </Route>

        <Route element={<AppShell />}>
          <Route path="/ethos" element={<Navigate to="/ethos/overview" replace />} />
          <Route path="/ethos/overview" element={<OverviewPage />} />
          <Route path="/ethos/settings" element={<SettingsPage />} />
          <Route path="/ethos/privacy" element={<PrivacyPage />} />
          <Route path="/ethos/research" element={<ResearchModePage />} />
        </Route>

        <Route path="/feed" element={<Navigate to="/instagram" replace />} />
        <Route path="/feed/visual" element={<Navigate to="/instagram" replace />} />
        <Route path="/feed/discussion" element={<Navigate to="/reddit" replace />} />
        <Route path="/post/:postId" element={<LegacyPostRedirect />} />
        <Route path="/overview" element={<Navigate to="/ethos/overview" replace />} />
        <Route path="/settings" element={<Navigate to="/ethos/settings" replace />} />
        <Route path="/privacy" element={<Navigate to="/ethos/privacy" replace />} />
        <Route path="/research" element={<Navigate to="/ethos/research" replace />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function LegacyPostRedirect() {
  const { postId = '' } = useParams();
  const platform = getPost(postId)?.platform ?? 'instagram';
  return <Navigate to={`/${platform}/post/${postId}`} replace />;
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
