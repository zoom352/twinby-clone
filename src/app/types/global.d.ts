/**
 * Глобальные типы стора. Объявлены здесь, чтобы нижние слои (shared)
 * могли типизировать хуки, не импортируя ничего из app напрямую.
 */
declare global {
  type RootState = import('../store/store').RootState
  type AppDispatch = import('../store/store').AppDispatch
}

export {}
