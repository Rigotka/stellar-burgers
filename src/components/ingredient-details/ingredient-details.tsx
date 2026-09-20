import { getIngredientsSelector } from '@/services/slices/ingredientSlice';
import { useSelector } from '@/services/store';
import type { TIngredient } from '@/utils/types';
import { Preloader, IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';

export const IngredientDetails = (): React.JSX.Element => {
  const ingredients: TIngredient[] = useSelector(getIngredientsSelector).ingredients;
  const ingredientSelectedId: string = useParams().id?.toString() ?? '';

  const ingredientData = ingredients.find((x) => x._id === ingredientSelectedId);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
