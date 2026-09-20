import { getConstructorSelector } from '@/services/slices/burgerConstructorSlice';
import {
  createOrder,
  getOrderCreateSelector,
  resetOrder,
} from '@/services/slices/orderCreateSlice';
import { getUserSelector } from '@/services/slices/userSlice';
import { useDispatch, useSelector } from '@/services/store';
import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import type { TConstructorIngredient, TConstructorState } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems: TConstructorState = useSelector(getConstructorSelector);
  const user = useSelector(getUserSelector);

  const { orderRequest, orderModalData } = useSelector(getOrderCreateSelector);

  const onOrderClick = (): void => {
    const { bun, ingredients } = constructorItems;

    if (!bun || orderRequest) return;

    if (!user) {
      void navigate('/login', { replace: true });
      return;
    }

    const ingredientsIds = ingredients.map((item) => item._id);
    const orderIds = [bun._id, ...ingredientsIds, bun._id];

    void dispatch(createOrder(orderIds));
  };

  const closeOrderModal = (): void => {
    void dispatch(resetOrder());
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
