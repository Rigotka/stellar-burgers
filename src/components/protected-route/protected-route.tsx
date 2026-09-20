import { getUserStateSelector } from '@/services/slices/userSlice';
import { useSelector } from '@/services/store';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { Preloader } from '../ui/preloader/preloader';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
};

type LocationState = {
  from?: {
    pathname: string;
  };
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
}: ProtectedRouteProps): React.JSX.Element => {
  const { user, isAuthChecked } = useSelector(getUserStateSelector);
  const location = useLocation();
  const state = location.state as LocationState | null;

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace to="/login" state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const from = state?.from?.pathname ?? '/';
    return <Navigate replace to={from} />;
  }

  return <Outlet />;
};
