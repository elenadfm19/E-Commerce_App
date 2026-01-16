import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// Backend base URL loaded from Vite environment variables
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Async thunk: Create a new cart for the logged-in user
 * Flow:
 * 1. POST /cart/newCart → creates a cart server-side
 * 2. GET  /cart        → fetch the newly created cart status
 * 3. Normalize response into frontend-friendly shape
 */
export const createCart = createAsyncThunk("cart/createCart", async () => {
  // Create the cart
  await fetch(`${API_URL}/cart/newCart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  // Fetch cart status after creation
  const response = await fetch(`${API_URL}/cart`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const data = await response.json();

  // Normalize backend response
  const cartStatus = {
    id: data.id,
    totalItems: data.total_items,
    totalCost: data.total_cost,
    created: data.created,
  };

  return cartStatus; //This becomes the action.payload in .fulfilled
});

/**
 * Async thunk: Delete the current cart
 * Backend clears the cart server-side
 * Frontend resets cart state
 */
export const deleteCart = createAsyncThunk("cart/deleteCart", async () => {
  await fetch(`${API_URL}/cart/deleteCart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  // Reset cart state on success
  return {
    cartStatus: {},
    cart: [],
  };
});

/**
 * Async thunk: Fetch cart metadata (id, totals, creation date)
 */
export const fetchCartStatus = createAsyncThunk(
  "cart/fetchCartStatus",
  async () => {
    const response = await fetch(`${API_URL}/cart`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await response.json();
    const cartStatus = {
      id: data.id,
      totalItems: data.total_items,
      totalCost: data.total_cost,
      created: data.created,
    };

    return cartStatus; //This becomes the action.payload in .fulfilled
  }
);

/**
 * Async thunk: Fetch all items inside a cart
 * Receives cartId as argument
 */
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ cartId }) => {
    const response = await fetch(`${API_URL}/cart/${cartId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await response.json();

    return data.cart; //This becomes the action.payload in .fulfilled
  }
);

/**
 * Async thunk: Add one unit of an item to the cart
 * Flow:
 * 1. PUT /cart/addItem/:itemId
 * 2. GET /cart            → updated cart status
 * 3. GET /cart/:cartId   → updated cart items
 */
export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async ({ itemId }, thunkAPI) => {
    // Update cart server-side
    await fetch(`${API_URL}/cart/addItem/${itemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    // Get cartId from Redux state
    const state = thunkAPI.getState();
    const cartId = state.cart.cartStatus.id;

    // Fetch updated cart status
    const response2 = await fetch(`${API_URL}/cart`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data2 = await response2.json();
    const cartStatus = {
      id: data2.id,
      totalItems: data2.total_items,
      totalCost: data2.total_cost,
      created: data2.created,
    };

    // Fetch updated cart items
    const response3 = await fetch(`${API_URL}/cart/${cartId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data3 = await response3.json();

    return { cartStatus: cartStatus, cart: data3.cart };
  }
);

/**
 * Async thunk: Remove one unit of an item from the cart
 * Same flow as addItemToCart, but inverse action
 */
export const removeItemFromCart = createAsyncThunk(
  "cart/removeItemFromCart",
  async ({ itemId }, thunkAPI) => {
    // Update cart server-side
    await fetch(`${API_URL}/cart/deleteItem/${itemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    // Get cartId from Redux state
    const state = thunkAPI.getState();
    const cartId = state.cart.cartStatus.id;

    // Fetch updated cart status
    const response2 = await fetch(`${API_URL}/cart`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data2 = await response2.json();
    const cartStatus = {
      id: data2.id,
      totalItems: data2.total_items,
      totalCost: data2.total_cost,
      created: data2.created,
    };

    // Fetch updated cart items
    const response3 = await fetch(`${API_URL}/cart/${cartId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data3 = await response3.json();

    return { cartStatus: cartStatus, cart: data3.cart };
  }
);

/*
  Slice for managing cart state
 */
export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartStatus: {}, // metadata (id, totals, created)
    cart: [], // items in cart
  },
  reducers: {
    /**
     * Reset cart on logout / order completion
     */
    resetCart: (state) => {
      state.cartStatus = {};
      state.cart = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCart.fulfilled, (state, action) => {
        state.cartStatus = action.payload;
      })
      .addCase(deleteCart.fulfilled, (state, action) => {
        state.cartStatus = action.payload.cartStatus;
        state.cart = action.payload.cart;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.cartStatus = action.payload.cartStatus;
        state.cart = action.payload.cart;
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.cartStatus = action.payload.cartStatus;
        state.cart = action.payload.cart;
      })
      .addCase(fetchCartStatus.fulfilled, (state, action) => {
        state.cartStatus = action.payload;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      });
  },
});

//Selectors for accessing the cart slice state
export const selectCart = (state) => state.cart.cart;
export const selectCartStatus = (state) => state.cart.cartStatus;

// Export synchronous actions
export const { resetCart } = cartSlice.actions;

// Export the cart slice reducer
export default cartSlice.reducer;
