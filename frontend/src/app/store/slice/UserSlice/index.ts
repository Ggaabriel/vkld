import { createSlice } from '@reduxjs/toolkit';

export interface IUser {
  _id: string;
  login: string;
  name: string;
  passwordHash: string;

  image?: string;
}
interface IInitialState {
  user: IUser | null;
  isLogin: boolean;
}

const initialState: IInitialState = {
  user: null,
  isLogin: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isLogin = true;
    },
    logout(state) {
      state.user = null;
      state.isLogin = false;
    },
  },
});
export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
