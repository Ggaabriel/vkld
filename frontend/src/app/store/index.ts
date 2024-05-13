import { configureStore } from "@reduxjs/toolkit";
import user from "./slice/UserSlice";

export const store = configureStore({
  reducer: {
    user,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
