import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/config'
import { Button } from '@/shared/ui'
import styles from './NotFoundPage.module.css'

export const NotFoundPage = () => (
  <div className={styles.page}>
    <span className={styles.code}>404</span>
    <p>Такой страницы нет, но где-то есть ваш идеальный мэтч</p>
    <Link to={ROUTES.feed}>
      <Button>На главную</Button>
    </Link>
  </div>
)
