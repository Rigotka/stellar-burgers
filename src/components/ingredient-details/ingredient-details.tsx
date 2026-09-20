import { getIngredientsSelector } from '@/services/slices/ingredientSlice';
import { useSelector } from '@/services/store';
import { Preloader, IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';

import type { TIngredient } from '@/utils/types';

export const IngredientDetails = (): React.JSX.Element => {
  const ingredients: TIngredient[] = useSelector(getIngredientsSelector);
  const ingredientSelectedId: string = useParams().id ?? '';

  const ingredientData = ingredients.find((x) => x._id === ingredientSelectedId);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
