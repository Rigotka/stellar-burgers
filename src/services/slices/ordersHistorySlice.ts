import { getOrdersApi } from '@/utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TOrdersHistoryState } from '@/utils/types';

const initialState: TOrdersHistoryState = {
  orders: [],
  isLoading: false,
  error: null,
};

export const getOrders = createAsyncThunk('ordersHistory/get', async () => {
  return await getOrdersApi();
});

export const ordersHistorySlice = createSlice({
  name: 'ordersHistory',
  initialState,
  reducers: {},
  selectors: {
    getOrdersHistorySelector: (state) => state.orders,
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
      });
  },
});

export const { getOrdersHistorySelector } = ordersHistorySlice.selectors;
