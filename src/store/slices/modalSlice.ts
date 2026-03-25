import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export type ModalState = {
  isBillingModalOpen: boolean
}

export const SLICE_NAME = 'modal'

const initialState: ModalState = {
  isBillingModalOpen: false
}

export const modalSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setBillingModalOpen: (
      state,
      action: PayloadAction<ModalState['isBillingModalOpen']>,
    ) => {
      state.isBillingModalOpen = action.payload
    },
    closeModals: (state) => {
      state.isBillingModalOpen = false;
    }
  },
})

export const {
  setBillingModalOpen,
  closeModals,
} = modalSlice.actions
export default modalSlice.reducer
