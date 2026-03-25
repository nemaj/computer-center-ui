import { configureStore } from '@reduxjs/toolkit'
import customerReducer from './slices/customerSlice'
import notificationSlice from './slices/notificationSlice'
import modalSlice from './slices/modalSlice'

export const store = configureStore({
  reducer: {
    notification: notificationSlice,
    modals: modalSlice,
    customers: customerReducer,
  } as any,
})

// ✅ Types (VERY IMPORTANT)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch