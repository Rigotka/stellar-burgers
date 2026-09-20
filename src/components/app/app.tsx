import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword,
} from '@pages';
import { Preloader } from '@ui';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import type { AppContentProps } from './type';

import '../../index.css';

import styles from './app.module.css';
import { useDispatch, useSelector } from '@/services/store';
import {
  getIngredients,
  getIngredientsSelector,
} from '@/services/slices/ingredientSlice';
import { useEffect } from 'react';
import { getFeed } from '@/services/slices/feedSlice';
import { ProtectedRoute } from '../protected-route';
import { checkUser } from '@/services/slices/userSlice';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { ingredients, isLoading, error } = useSelector(getIngredientsSelector);

  useEffect(() => {
    dispatch(checkUser());
    dispatch(getIngredients());
    dispatch(getFeed());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent ingredients={ingredients} isLoading={isLoading} error={error} />
    </div>
  );
};

export default App;

const AppContent = ({
  ingredients,
  isLoading,
  error,
}: AppContentProps): React.JSX.Element => {
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты
        {error.message ? `: ${error.message}` : '.'}
      </p>
    );
  }

  if (!ingredients.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>Нет ингредиентов</p>
    );
  }

  return <RouteComponent />;
};

const RouteComponent = (): React.JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();

  const background = location.state?.background;

  return (
    <>
      <Routes location={background || location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/ingredients/:id" element={<IngredientDetails />} />

        <Route element={<ProtectedRoute onlyUnAuth />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/orders" element={<ProfileOrders />} />
          <Route path="/profile/orders/:number" element={<OrderInfo />} />
        </Route>

        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path="/feed/:number"
            element={
              <Modal title="Детали заказа" onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path="/profile/orders/:number"
            element={
              <Modal title="Детали заказа" onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </>
  );
};
