import { Navigate, Outlet } from 'react-router-dom';
import { Preloader } from '../ui/preloader/preloader';
import { getUserSelector } from '@/services/slices/userSlice';
import { useSelector } from '@/services/store';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
}: ProtectedRouteProps): React.JSX.Element => {
  const { user, isAuthChecked } = useSelector(getUserSelector);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace to="/login" />;
  }

  if (onlyUnAuth && user) {
    return <Navigate replace to="/" />;
  }

  return <Outlet />;
};
