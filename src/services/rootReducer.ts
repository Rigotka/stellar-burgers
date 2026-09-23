import { combineSlices } from '@reduxjs/toolkit';

import { constructorSlice } from './slices/burgerConstructorSlice';
import { feedSlice } from './slices/feedSlice';
import { ingredientsSlice } from './slices/ingredientSlice';
import { orderCreateSlice } from './slices/orderCreateSlice';
import { orderInfoSlice } from './slices/orderInfoSlice';
import { ordersHistorySlice } from './slices/ordersHistorySlice';
import { userSlice } from './slices/userSlice';

export const rootReducer = combineSlices(
  ingredientsSlice,
  constructorSlice,
  feedSlice,
  userSlice,
  ordersHistorySlice,
  orderCreateSlice,
  orderInfoSlice
);
