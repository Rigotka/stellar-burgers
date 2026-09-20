import { getOrdersApi, orderBurgerApi } from '@/utils/burger-api';
import type { TOrdersState } from '@/utils/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState: TOrdersState = {
  orders: [],
  orderModalData: null,
  isLoading: false,
  orderRequest: false,
  error: null,
};

export const getOrders = createAsyncThunk('orders/get', async () => {
  return await getOrdersApi();
});

export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData: string[]) => {
    return await orderBurgerApi(orderData);
  }
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.orderRequest = false;
      state.orderModalData = null;
      state.error = null;
    },
  },
  selectors: {
    getOrdersSelector: (state) => state,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error ?? null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })

      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error ?? null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      });
  },
});

export const { getOrdersSelector } = ordersSlice.selectors;
export const { resetOrder } = ordersSlice.actions;
