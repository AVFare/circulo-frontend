import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import productReducer from "./productSlice";
import orderReducer from "./orderSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    orders: orderReducer,
    users: userReducer,
  },
});
