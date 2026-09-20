import { getFeed, getFeedSelector } from '@/services/slices/feedSlice';
import { useDispatch, useSelector } from '@/services/store';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

import type { TOrder } from '@utils-types';
import { useEffect } from 'react';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(getFeedSelector).orders;

  useEffect(() => {
    dispatch(getFeed());
  }, [dispatch]);

  const handleGetFeeds = (): void => {
    dispatch(getFeed());
  };

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
