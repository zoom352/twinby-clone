export const ROUTES = {
  onboarding: '/onboarding',
  feed: '/',
  matches: '/matches',
  chat: (matchId = ':matchId') => `/chat/${matchId}`,
  profile: '/profile',
} as const
