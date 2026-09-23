import { orderBurgerApi } from '@/utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { resetConstructor } from './burgerConstructorSlice';

import type { TOrderCreateState } from '@/utils/types';

const initialState: TOrderCreateState = {
  orderModalData: null,
  orderRequest: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData: string[], { dispatch }) => {
    const data = await orderBurgerApi(orderData);

    dispatch(resetConstructor());

    return data;
  }
);

export const orderCreateSlice = createSlice({
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
    getOrderCreateSelector: (state) => state,
  },
  extraReducers: (builder) => {
    builder
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

export const { resetOrder } = orderCreateSlice.actions;
export const { getOrderCreateSelector } = orderCreateSlice.selectors;
