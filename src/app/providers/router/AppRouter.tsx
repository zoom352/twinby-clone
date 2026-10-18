import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ChatPage } from '@/pages/chat'
import { FeedPage } from '@/pages/feed'
import { FeedProfilePage } from '@/pages/feed-profile'
import { MatchProfilePage } from '@/pages/match-profile'
import { MatchesPage } from '@/pages/matches'
import { NotFoundPage } from '@/pages/not-found'
import { OnboardingPage } from '@/pages/onboarding'
import { ProfilePage } from '@/pages/profile'
import { ROUTES } from '@/shared/config'
import { MainLayout } from '@/widgets/layout'
import { AuthGuard, GuestGuard } from './guards'

const router = createBrowserRouter([
  {
    path: ROUTES.onboarding,
    element: (
      <GuestGuard>
        <OnboardingPage />
      </GuestGuard>
    ),
  },
  {
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      { path: ROUTES.feed, element: <FeedPage /> },
      { path: ROUTES.matches, element: <MatchesPage /> },
      { path: ROUTES.profile, element: <ProfilePage /> },
    ],
  },
  {
    path: ROUTES.chat(),
    element: (
      <AuthGuard>
        <ChatPage />
      </AuthGuard>
    ),
  },
  {
    path: ROUTES.matchProfile(),
    element: (
      <AuthGuard>
        <MatchProfilePage />
      </AuthGuard>
    ),
  },
  {
    path: ROUTES.feedProfile(),
    element: (
      <AuthGuard>
        <FeedProfilePage />
      </AuthGuard>
    ),
  },
  { path: '*', element: <NotFoundPage /> },
])

export const AppRouter = () => <RouterProvider router={router} />
