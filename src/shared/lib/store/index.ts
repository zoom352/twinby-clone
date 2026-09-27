import { createAsyncThunk } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'

/**
 * Типизированные хуки и фабрика thunk'ов.
 * RootState и AppDispatch объявлены глобально в app/types/global.d.ts,
 * поэтому shared не импортирует ничего из вышележащего слоя app.
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: AppDispatch
  rejectValue: string
}>()
