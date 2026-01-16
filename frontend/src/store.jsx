import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "./features/menu/menuSlice";
import cartReducer from "./features/cart/cartSlice";
import orderReducer from "./features/orders/orderSlice";

/*
  Redux store configuration for the app. 
  It combines 3 slices: menu, cart and order.
  
  Redux state shape reference:
    {
    menu: {
      menu: [],                // Array of items from the restaurant menu stored in the SQL database
      loading: false,          // true while API request is in progress
      error: false             // true if API request fails
    },
  {
    cart: {
      cartStatus:{},           // Object with general cart details
      cart: [],                // Array of items selected from the Menu and added to the cart

    },
    order: {
      order: {},                // Array with all the items from the restaurant menu in a specific order
      orderList: []             // Array of orders raised by a specific customer
    },
  }
*/
export default configureStore({
  reducer: {
    menu: menuReducer,
    cart: cartReducer,
    order: orderReducer,
  },
});
