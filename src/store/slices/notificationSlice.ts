import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export type NotificationState = {
  message: String
}

export const SLICE_NAME = 'notification'

const initialState: NotificationState = {
  message: ''
}

export const notificationSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setNotificationMessage: (
      state,
      action: PayloadAction<NotificationState['message']>,
    ) => {
      state.message = action.payload
    },
    clearToast: (state) => {
      state.message = '';
    }
  },
})

export const {
  setNotificationMessage,
  clearToast,
} = notificationSlice.actions
export default notificationSlice.reducer
