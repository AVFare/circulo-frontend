import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import productReducer from "./productSlice";
import orderReducer from "./orderSlice";
import userReducer from "./userSlice";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
  cart: cartReducer,
    orders: orderReducer,
    users: userReducer,
  },
});
