import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
  type TLoginData,
  type TRegisterData,
} from '@/utils/burger-api';
import { deleteCookie, setCookie } from '@/utils/cookie';
import type { TUser, TUserState } from '@/utils/types';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

export const checkUser = createAsyncThunk('user/check', async () => {
  const response = await getUserApi();
  return response.user;
});

export const register = createAsyncThunk(
  'user/register',
  async (userData: TRegisterData) => {
    const response = await registerUserApi(userData);

    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    return response.user;
  }
);

export const login = createAsyncThunk('user/login', async (userData: TLoginData) => {
  const response = await loginUserApi(userData);

  setCookie('accessToken', response.accessToken);
  localStorage.setItem('refreshToken', response.refreshToken);

  return response.user;
});

export const update = createAsyncThunk(
  'user/update',
  async (userData: TLoginData & { password: string }) => {
    const response = await updateUserApi(userData);

    return response.user;
  }
);

export const logout = createAsyncThunk('user/logout', async () => {
  await logoutApi();

  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    getUserSelector: (state) => state,
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUser.rejected, (state) => {
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(checkUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload;
      })

      .addCase(login.pending, (state) => {
        state.isAuthChecked = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.error = action.error ?? null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = { ...action.payload };
      })

      .addCase(update.pending, (state) => {
        state.error = null;
      })
      .addCase(update.rejected, (state, action) => {
        state.error = action.error ?? null;
      })
      .addCase(update.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      .addCase(register.pending, (state) => {
        state.isAuthChecked = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.error = action.error ?? null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.isAuthChecked = true;
        state.user = action.payload;
      })

      .addCase(logout.fulfilled, (state) => {
        state.isAuthChecked = true;
        state.user = null;
      });
  },
});

export const { getUserSelector } = userSlice.selectors;
