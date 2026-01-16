import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// Backend base URL loaded from Vite environment variables
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Async thunk that fetches the menu from the backend.
 * This thunk:
 * 1. Sends a GET request to /menu
 * 2. Normalizes the response data
 * 3. Returns the menu array as action.payload
 */
export const fetchMenu = createAsyncThunk("menu/fetchMenu", async (args) => {
  const res = await fetch(`${API_URL}/menu`);
  const data = await res.json();
  // Normalize backend response into frontend-friendly objects
  const menu = [];
  for (let i = 0; i < data.length; i++) {
    menu.push({
      id: data[i].id,
      name: data[i].name,
      price: data[i].price,
      type: data[i].type,
    });
  }
  // Returned value becomes action.payload in fulfilled
  return menu;
});

/**
 * Redux slice that stores menu data and request status
 */
export const menuSlice = createSlice({
  name: "menu",
  initialState: {
    menu: [], // Array of menu items
    loading: false, // True while fetching menu
    error: false, // True if fetching fails
  },
  extraReducers: (builder) => {
    builder
      // Fired when fetchMenu is dispatched
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      // Fired when fetchMenu resolves successfully
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.menu = action.payload;
      })
      // Fired if fetchMenu fails
      .addCase(fetchMenu.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
  },
});

//Selectors for accessing the menu slice state
export const selectMenu = (state) => state.menu.menu;
export const selectLoading = (state) => state.menu.loading;
export const selectError = (state) => state.menu.error;

// Export the menu slice reducer
export default menuSlice.reducer;
