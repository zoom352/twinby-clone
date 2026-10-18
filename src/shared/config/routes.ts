export const ROUTES = {
  onboarding: '/onboarding',
  feed: '/',
  matches: '/matches',
  chat: (matchId = ':matchId') => `/chat/${matchId}`,
  matchProfile: (matchId = ':matchId') => `/match/${matchId}/profile`,
  profile: '/profile',
} as const
