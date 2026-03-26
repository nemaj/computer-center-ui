import { Product } from '@/app/(admin)/products/page'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type ProductTable = {
  product: Product[]
  page: number
  totalCount: number
  totalPages: number
}

export type ProductState = {
  productTableData: ProductTable
  isProductRefresh: boolean
}

export const SLICE_NAME = 'products'

const initialState: ProductState = {
  productTableData: {
    product: [],
    page: 1,
    totalCount: 0,
    totalPages: 1
  },
  isProductRefresh: false
}

export const productSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setProductTableData: (
      state,
      action: PayloadAction<ProductState['productTableData']>,
    ) => {
      state.productTableData = action.payload
    },
    setProductRefresh: (
      state,
      action: PayloadAction<ProductState['isProductRefresh']>,
    ) => {
      state.isProductRefresh = action.payload
    },
  },
})

export const {
  setProductTableData,
  setProductRefresh
} = productSlice.actions
export default productSlice.reducer
