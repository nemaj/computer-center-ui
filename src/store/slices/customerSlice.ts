import { Customer } from '@/app/(admin)/customers/page'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type CustomerTable = {
  customer: Customer[]
  page: number
  totalCount: number
  totalPages: number
}

export type CustomerState = {
  customerTableData: CustomerTable
  isCustomerRefresh: boolean
}

export const SLICE_NAME = 'customers'

const initialState: CustomerState = {
  customerTableData: {
    customer: [],
    page: 1,
    totalCount: 0,
    totalPages: 1
  },
  isCustomerRefresh: false
}

export const customerSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setCustomerTableData: (
      state,
      action: PayloadAction<CustomerState['customerTableData']>,
    ) => {
      state.customerTableData = action.payload
    },
    setCustomerRefresh: (
      state,
      action: PayloadAction<CustomerState['isCustomerRefresh']>,
    ) => {
      state.isCustomerRefresh = action.payload
    },
  },
})

export const {
  setCustomerTableData,
  setCustomerRefresh
} = customerSlice.actions
export default customerSlice.reducer
