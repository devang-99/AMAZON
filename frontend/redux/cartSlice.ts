"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* -------------------- TYPES -------------------- */

interface CartProduct {
  id: number;
  name: string;
  price: number;
  images: string[];
}

interface CartItem {
  product: CartProduct;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

/* -------------------- INITIAL STATE -------------------- */

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

/* -------------------- THUNKS -------------------- */

/* 🔹 ADD TO CART */
export const addToCartThunk = createAsyncThunk(
  "cart/add",
  async (
    data: { userId: number; productId: number; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(
        `${API_URL}/cart/${data.userId}`,
        {
          productId: data.productId,
          quantity: data.quantity,
        }
      );
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to add item to cart"
        );
      }
      return rejectWithValue("Unexpected error");
    }
  }
);

/* 🔹 GET USER CART */
export const getMyCartThunk = createAsyncThunk(
  "cart/get",
  async (userId: number, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/cart/${userId}`);
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch cart"
        );
      }
      return rejectWithValue("Unexpected error");
    }
  }
);

/* 🔹 REMOVE ITEM FROM CART */
export const removeItemThunk = createAsyncThunk(
  "cart/remove",
  async (
    data: { userId: number; productId: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.delete(
        `${API_URL}/cart/${data.userId}/${data.productId}`
      );
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to remove item"
        );
      }
      return rejectWithValue("Unexpected error");
    }
  }
);

/* -------------------- SLICE -------------------- */

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartState: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* GET CART */
      .addCase(getMyCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
      })
      .addCase(getMyCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* ADD TO CART */
      .addCase(addToCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
      })
      .addCase(addToCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* REMOVE ITEM */
      .addCase(removeItemThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeItemThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
      })
      .addCase(removeItemThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

/* -------------------- EXPORTS -------------------- */

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
