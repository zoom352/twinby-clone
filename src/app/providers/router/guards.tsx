import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { selectIsAuth } from '@/entities/user'
import { ROUTES } from '@/shared/config'
import { useAppSelector } from '@/shared/lib/store'

/** Только для пользователей с анкетой */
export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const isAuth = useAppSelector(selectIsAuth)
  return isAuth ? children : <Navigate to={ROUTES.onboarding} replace />
}

/** Только для гостей (онбординг) */
export const GuestGuard = ({ children }: { children: ReactNode }) => {
  const isAuth = useAppSelector(selectIsAuth)
  return isAuth ? <Navigate to={ROUTES.feed} replace /> : children
}
