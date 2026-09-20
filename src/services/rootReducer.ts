import { combineSlices } from '@reduxjs/toolkit';
import { ingredientsSlice } from './slices/ingredientSlice';
import { feedSlice } from './slices/feedSlice';
import { constructorSlice } from './slices/burgerConstructorSlice';
import { userSlice } from './slices/userSlice';
import { ordersSlice } from './slices/ordersSlise';

export const rootReducer = combineSlices(
  ingredientsSlice,
  constructorSlice,
  feedSlice,
  userSlice,
  ordersSlice
);
