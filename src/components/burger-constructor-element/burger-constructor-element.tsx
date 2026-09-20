import { BurgerConstructorElementUI } from '@ui';
import { memo } from 'react';

import type { BurgerConstructorElementProps } from './type';
import { useDispatch } from '@/services/store';
import { changeOrder, removeIngredient } from '@/services/slices/burgerConstructorSlice';

export const BurgerConstructorElement = memo(function BurgerConstructorElement({
  ingredient,
  index,
  totalItems,
}: BurgerConstructorElementProps): React.JSX.Element {
  const dispatch = useDispatch();

  const handleMoveDown = (): void => {
    dispatch(changeOrder({ id: ingredient.id, direction: 'down' }));
  };

  const handleMoveUp = (): void => {
    dispatch(changeOrder({ id: ingredient.id, direction: 'up' }));
  };

  const handleClose = (): void => {
    dispatch(removeIngredient(ingredient.id));
  };

  return (
    <BurgerConstructorElementUI
      ingredient={ingredient}
      index={index}
      totalItems={totalItems}
      handleMoveUp={handleMoveUp}
      handleMoveDown={handleMoveDown}
      handleClose={handleClose}
    />
  );
});
