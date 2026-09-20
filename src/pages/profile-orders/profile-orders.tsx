import { getOrders, getOrdersSelector } from '@/services/slices/ordersSlise';
import { useDispatch, useSelector } from '@/services/store';
import { ProfileOrdersUI } from '@ui-pages';

import type { TOrder } from '@utils-types';
import { useEffect } from 'react';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const orders: TOrder[] = useSelector(getOrdersSelector).orders;

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
