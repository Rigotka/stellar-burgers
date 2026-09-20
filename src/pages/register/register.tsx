import { getUserSelector, register } from '@/services/slices/userSlice';
import { useDispatch, useSelector } from '@/services/store';
import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';

export const Register = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const error = useSelector(getUserSelector).error;

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    dispatch(register({ email, password, name: userName }));
  };

  return (
    <RegisterUI
      errorText={error?.message ?? ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
