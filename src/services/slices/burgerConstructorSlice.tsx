import type {
  TConstructorIngredient,
  TConstructorState,
  TDirection,
  TIngredient,
} from '@/utils/types';
import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const ingredient = action.payload;

        if (ingredient.type === 'bun') {
          state.bun = ingredient;
        } else {
          state.ingredients.push(ingredient);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() } as TConstructorIngredient,
      }),
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter((x) => x.id != action.payload);
    },
    changeOrder: (
      state,
      action: PayloadAction<{ id: string; direction: TDirection }>
    ) => {
      const { id, direction } = action.payload;

      const index = state.ingredients.findIndex((x) => x.id === id);
      const newIndex = direction === 'up' ? index - 1 : index + 1;

      const [item] = state.ingredients.splice(index, 1);
      state.ingredients.splice(newIndex, 0, item);
    },
    resetConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
  },
  selectors: {
    getConstructorSelector: (state) => state,
  },
});

export const { addIngredient, removeIngredient, changeOrder, resetConstructor } =
  constructorSlice.actions;
export const { getConstructorSelector } = constructorSlice.selectors;
