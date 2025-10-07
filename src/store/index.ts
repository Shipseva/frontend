import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
// import orderReducer from "./slices/orderSlice";
// import { userApi } from "./api/userApi";
// import { orderApi } from "./api/orderApi";
import { useDispatch } from "react-redux";
import { authApi, userApi } from "./api";

export const store = configureStore({
  reducer: {
    user: userReducer,
    // order: orderReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    // [orderApi.reducerPath]: orderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(userApi.middleware)
    //   .concat(orderApi.middleware)
      ,
  devTools: process.env.NODE_ENV !== "production",
});

// Infer the `RootState` and `AppDispatch` types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hook for dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();
