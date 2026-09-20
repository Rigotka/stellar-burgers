import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';

import type { TConstructorIngredient, TConstructorState } from '@utils-types';
import { useDispatch, useSelector } from '@/services/store';
import {
  getConstructorSelector,
  resetConstructor,
} from '@/services/slices/burgerConstructorSlice';
import {
  createOrder,
  getOrdersSelector,
  resetOrder,
} from '@/services/slices/ordersSlise';
import { getUserSelector } from '@/services/slices/userSlice';
import { Navigate, useNavigate } from 'react-router-dom';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems: TConstructorState = useSelector(getConstructorSelector);
  const user = useSelector(getUserSelector).user;

  const { orderRequest, orderModalData } = useSelector(getOrdersSelector);

  const onOrderClick = (): void => {
    const { bun, ingredients } = constructorItems;

    if (!bun || orderRequest) return;

    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    const ingredientsIds = ingredients.map((item) => item._id);
    const orderIds = [bun._id, ...ingredientsIds, bun._id];

    dispatch(createOrder(orderIds));
  };

  const closeOrderModal = (): void => {
    dispatch(resetOrder());
    dispatch(resetConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
