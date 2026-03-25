import { configureStore } from '@reduxjs/toolkit'
import customerReducer from './slices/customerSlice'
import notificationSlice from './slices/notificationSlice'

export const store = configureStore({
  reducer: {
    notification: notificationSlice,
    customers: customerReducer,
  } as any,
})

// ✅ Types (VERY IMPORTANT)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch