import { getIngredientsApi } from '@/utils/burger-api';
import type { TIngredientsState } from '@/utils/types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const getIngredients = createAsyncThunk('ingredients/get', async () => {
  return await getIngredientsApi();
});

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null,
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    getIngredientsSelector: (state) => state,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error ?? null;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      });
  },
});

export const { getIngredientsSelector } = ingredientsSlice.selectors;
