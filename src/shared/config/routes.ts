export const ROUTES = {
  onboarding: '/onboarding',
  feed: '/',
  matches: '/matches',
  chat: (matchId = ':matchId') => `/chat/${matchId}`,
  matchProfile: (matchId = ':matchId') => `/match/${matchId}/profile`,
  profile: '/profile',
  /** Подробная анкета из ленты (до свайпа) */
  feedProfile: (profileId = ':profileId') => `/feed/${profileId}`,
} as const
