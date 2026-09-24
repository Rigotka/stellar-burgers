import { TIngredient } from '@/utils/types';
import {
  addIngredient,
  changeOrder,
  constructorSlice,
  getConstructorSelector,
  initialState,
  removeIngredient,
} from '../burgerConstructorSlice';

import { expect, test, describe } from '@jest/globals';

const bun: TIngredient = {
  _id: 'bun_1',
  name: 'bun',
  type: 'bun',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 0,
  image: '',
  image_large: '',
  image_mobile: '',
};

const ingredients: TIngredient[] = [
  {
    _id: 'test_id_1',
    name: 'ingredient_test_1',
    type: 'main',
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
    type: 'main',
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
    _id: 'test_id_3',
    name: 'ingredient_test_3',
    type: 'sauce',
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

describe('actions', () => {
  test('addIngredient: add bun', () => {
    const state = constructorSlice.reducer(initialState, addIngredient(bun));
    expect(state.bun).toMatchObject(bun);
    expect(state.bun?.id).toBeDefined();
    expect(state.ingredients).toEqual([]);
  });

  test('addIngredient: add ingredient', () => {
    const ingredient = ingredients[0];

    const state = constructorSlice.reducer(initialState, addIngredient(ingredient));
    expect(state.ingredients[0]).toMatchObject(ingredient);
    expect(state.ingredients[0]?.id).toBeDefined();
    expect(state.bun).toBeNull();
  });

  test('addIngredient: replace bun', () => {
    const first = constructorSlice.reducer(initialState, addIngredient(bun));
    const second = constructorSlice.reducer(
      first,
      addIngredient({ ...bun, name: 'bun2' })
    );

    expect(second.bun?.name).toBe('bun2');
    expect(second.bun?.id).toBeDefined();
    expect(second.ingredients).toEqual([]);
  });

  test('removeIngredient', () => {
    const ingredient = ingredients[0];
    const stateWithIngredient = constructorSlice.reducer(
      initialState,
      addIngredient(ingredient)
    );

    expect(stateWithIngredient.ingredients).toHaveLength(1);

    const addedId = stateWithIngredient.ingredients[0].id;
    const stateAfterRemove = constructorSlice.reducer(
      stateWithIngredient,
      removeIngredient(addedId)
    );

    expect(stateAfterRemove.ingredients).toHaveLength(0);
    expect(stateAfterRemove.ingredients.find((x) => x.id === addedId)).toBeUndefined();
  });

  test('changeOrder: up', () => {
    let state = constructorSlice.reducer(initialState, addIngredient(ingredients[0]));
    state = constructorSlice.reducer(state, addIngredient(ingredients[1]));
    state = constructorSlice.reducer(state, addIngredient(ingredients[2]));

    const secondId = state.ingredients[1].id;

    state = constructorSlice.reducer(
      state,
      changeOrder({ id: secondId, direction: 'up' })
    );

    expect(state.ingredients[0]._id).toBe('test_id_2');
    expect(state.ingredients[1]._id).toBe('test_id_1');
    expect(state.ingredients[2]._id).toBe('test_id_3');
    expect(state.ingredients).toHaveLength(3);
  });

  test('changeOrder: down', () => {
    let state = constructorSlice.reducer(initialState, addIngredient(ingredients[0]));
    state = constructorSlice.reducer(state, addIngredient(ingredients[1]));
    state = constructorSlice.reducer(state, addIngredient(ingredients[2]));

    const firstId = state.ingredients[0].id;

    state = constructorSlice.reducer(
      state,
      changeOrder({ id: firstId, direction: 'down' })
    );

    expect(state.ingredients[0]._id).toBe('test_id_2');
    expect(state.ingredients[1]._id).toBe('test_id_1');
    expect(state.ingredients[2]._id).toBe('test_id_3');
    expect(state.ingredients).toHaveLength(3);
  });

  test('resetConstructor', () => {
    let state = constructorSlice.reducer(initialState, addIngredient(ingredients[0]));
    state = constructorSlice.reducer(state, addIngredient(ingredients[1]));
    state = constructorSlice.reducer(state, addIngredient(ingredients[2]));

    expect(state.ingredients).toMatchObject(ingredients);
    expect(state.ingredients).toHaveLength(3);
  });

  test('getIngredientsStateSelector', () => {
    let state = constructorSlice.reducer(initialState, addIngredient(ingredients[0]));
    state = constructorSlice.reducer(state, addIngredient(ingredients[1]));
    state = constructorSlice.reducer(state, addIngredient(ingredients[2]));
    state = constructorSlice.reducer(state, addIngredient(bun));

    expect(getConstructorSelector({ burgerConstructor: state }));

    const result = getConstructorSelector({ burgerConstructor: state });
    expect(result.bun).toMatchObject(bun);
    expect(result.ingredients).toHaveLength(3);
    expect(result.ingredients).toMatchObject(ingredients);
  });
});
