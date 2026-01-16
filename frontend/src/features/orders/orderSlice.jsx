import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// Backend base URL loaded from Vite environment variables
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Async thunk: Create a new order from the current cart
 * Backend is responsible for:
 * - Creating the order
 * - Moving cart items into order items
 * - Clearing the cart
 */
export const createOrder = createAsyncThunk("order/createOrder", async () => {
  await fetch(`${API_URL}/orders/newOrder`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  // No payload returned to reducer
  return;
});

/**
 * Async thunk: Fetch all orders for the logged-in user
 */
export const fetchOrderList = createAsyncThunk(
  "order/fetchOrderList",
  async () => {
    const response = await fetch(`${API_URL}/orders/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    // Expected: array of order summaries
    const orderList = await response.json();

    return orderList;
  }
);

/**
 * Async thunk: Fetch a specific order by ID
 * Returns the list of items belonging to that order
 */
export const fetchOrder = createAsyncThunk(
  "order/fetchOrder",
  async ({ orderId }) => {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    // Expected: array of order items
    const order = await response.json();

    return order;
  }
);

/*
  Slice for managing order state
 */
export const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: [], // Items in a single order
    orderList: [], // List of all orders
  },
  extraReducers: (builder) => {
    builder
      /**
       * After creating an order:
       * - Clear orderList (forces refetch)
       * - Clear order (no order selected)
       */
      .addCase(createOrder.fulfilled, (state) => {
        state.orderList = [];
        state.order = {};
      })
      // Store fetched list of orders
      .addCase(fetchOrderList.fulfilled, (state, action) => {
        state.orderList = action.payload;
      })
      // Store fetched order details
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.order = action.payload;
      });
  },
});

//Selectors for accessing the order slice state
export const selectOrder = (state) => state.order.order;
export const selectOrderList = (state) => state.order.orderList;

// Export the order slice reducer
export default orderSlice.reducer;
