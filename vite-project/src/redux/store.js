import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import orderReducer from "./orderSlice";
import userReducer from "./userSlice";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    products: productReducer,
  cart: cartReducer,
    orders: orderReducer,
  },
});
