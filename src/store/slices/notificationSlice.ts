import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type ConfirmationProps = {
  selectedId: string | null,
  label: string,
  description?: string,
  type: 'PLAN' | 'CUSTOMER' | 'PRODUCT' | null
}

export type NotificationState = {
  message: String,
  confirmation: ConfirmationProps,
}

export const SLICE_NAME = 'notification'

const initialState: NotificationState = {
  message: '',
  confirmation: {
    selectedId: null,
    label: '',
    description: '',
    type: null
  }
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
    },
    setConfirmationModal: (
      state,
      action: PayloadAction<NotificationState['confirmation']>,
    ) => {
      state.confirmation = action.payload
    },
    closeConfirmation: (state) => {
      state.confirmation = {
        selectedId: null,
        label: '',
        description: '',
        type: null
      };
    }
  },
})

export const {
  setNotificationMessage,
  clearToast,
  setConfirmationModal,
  closeConfirmation,
} = notificationSlice.actions
export default notificationSlice.reducer
