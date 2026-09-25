import { getIngredientsApi } from '@/utils/burger-api';
import { expect, test, describe, jest } from '@jest/globals';

import store from '@services/store';

import {
  getIngredients,
  getIngredientsSelector,
  getIngredientsStateSelector,
  ingredientsSlice,
  initialState,
} from '../ingredientSlice';

import type { TIngredient, TIngredientsState } from '@/utils/types';

jest.mock('@/utils/burger-api', () => ({
  getIngredientsApi: jest.fn(),
}));

const mockedGetIngredientsApi = getIngredientsApi as jest.MockedFunction<
  typeof getIngredientsApi
>;

const ingredients: TIngredient[] = [
  {
    _id: 'test_id_1',
    name: 'ingredient_test_1',
    type: 'bun',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 0,
    image: 'string',
    image_large: 'string',
    image_mobile: 'string',
  },
  {
    _id: 'test_id_2',
    name: 'ingredient_test_2',
    type: 'bun',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 0,
    image: 'string',
    image_large: 'string',
    image_mobile: 'string',
  },
];

const newState = (state: TIngredientsState): { ingredients: TIngredientsState } => ({
  ingredients: { ...state },
});

describe('async actions', () => {
  test('getIngredients pending', () => {
    mockedGetIngredientsApi.mockReturnValue(
      new Promise(() => {
        // never loading
      })
    );

    void store.dispatch(getIngredients());

    const state = store.getState();
    expect(state.ingredients.ingredients).toStrictEqual([]);
    expect(state.ingredients.isLoading).toBe(true);
    expect(state.ingredients.error).toBeNull();
  });

  test('getIngredients rejected', async () => {
    const error = new Error('error');
    mockedGetIngredientsApi.mockRejectedValue(error);

    await store.dispatch(getIngredients());

    const state = store.getState();
    expect(state.ingredients.ingredients).toStrictEqual([]);
    expect(state.ingredients.isLoading).toBe(false);
    expect(state.ingredients.error?.message).toBe('error');
  });

  test('getIngredients fulfilled', async () => {
    mockedGetIngredientsApi.mockResolvedValue(ingredients);

    await store.dispatch(getIngredients());

    const state = store.getState();
    expect(state.ingredients.ingredients).toEqual(ingredients);
    expect(state.ingredients.isLoading).toBe(false);
    expect(state.ingredients.error).toBeNull();
  });
});

describe('actions', () => {
  test('unknown action', () => {
    const state = ingredientsSlice.reducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });
});

describe('selectors', () => {
  test('getIngredientsStateSelector', () => {
    const state = newState({ ingredients: ingredients, isLoading: false, error: null });
    expect(getIngredientsStateSelector(state)).toEqual(state.ingredients);
  });

  test('getIngredientsSelector', () => {
    const state = newState({ ingredients: ingredients, isLoading: false, error: null });
    expect(getIngredientsSelector(state)).toEqual(ingredients);
  });
});
