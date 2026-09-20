import { Preloader, OrderInfoUI } from '@ui';
import { useMemo } from 'react';

import type { TIngredient } from '@utils-types';
import { useSelector } from 'react-redux';
import { getFeedSelector } from '@/services/slices/feedSlice';
import { useParams } from 'react-router-dom';
import { getIngredientsSelector } from '@/services/slices/ingredientSlice';

export const OrderInfo = (): React.JSX.Element => {
  const ingredients: TIngredient[] = useSelector(getIngredientsSelector).ingredients;

  const orderSelectedId: string = useParams().number?.toString() ?? '';
  const orderData = useSelector(getFeedSelector).orders.find(
    (x) => x.number === +orderSelectedId
  );

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
