import { AppRouter } from './providers/router/AppRouter'
import { StoreProvider } from './providers/store/StoreProvider'
import './styles/index.css'

export const App = () => (
  <StoreProvider>
    <div className="app-shell">
      <AppRouter />
    </div>
  </StoreProvider>
)
