import { useNavigate } from 'react-router-dom'
import { OnboardingForm } from '@/features/auth'
import { ROUTES } from '@/shared/config'
import styles from './OnboardingPage.module.css'

export const OnboardingPage = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.logo}>twinby</h1>
        <p className={styles.slogan}>Нейросеть подберёт тех, с кем у вас действительно совпадает</p>
      </section>

      <section className={styles.card}>
        <h2 className={styles.title}>Создайте анкету</h2>
        <OnboardingForm onSuccess={() => navigate(ROUTES.feed, { replace: true })} />
      </section>
    </div>
  )
}
