import { NavLink, Outlet } from 'react-router-dom'
import { selectMatches } from '@/entities/match'
import { selectAllConversations } from '@/entities/message'
import { ROUTES } from '@/shared/config'
import { cn } from '@/shared/lib'
import { useAppSelector } from '@/shared/lib/store'
import { ChatIcon, FlameIcon, UserIcon } from '@/shared/ui'
import styles from './MainLayout.module.css'

const navClassName = ({ isActive }: { isActive: boolean }) => cn(styles.navItem, isActive && styles.navItemActive)

export const MainLayout = () => {
  const matches = useAppSelector(selectMatches)
  const conversations = useAppSelector(selectAllConversations)
  const newMatchesCount = matches.filter((match) => !conversations[match.id]?.length).length

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <span className={styles.logo}>twinby</span>
        <span className={styles.tagline}>знакомства по совместимости</span>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <nav className={styles.nav}>
        <NavLink to={ROUTES.feed} end className={navClassName}>
          <FlameIcon />
          <span>Анкеты</span>
        </NavLink>
        <NavLink to={ROUTES.matches} className={navClassName}>
          <span className={styles.iconWrap}>
            <ChatIcon />
            {newMatchesCount > 0 && <span className={styles.badge}>{newMatchesCount}</span>}
          </span>
          <span>Чаты</span>
        </NavLink>
        <NavLink to={ROUTES.profile} className={navClassName}>
          <UserIcon />
          <span>Профиль</span>
        </NavLink>
      </nav>
    </div>
  )
}
