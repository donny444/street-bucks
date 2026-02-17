import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Menu } from "./menu_types";

type CartItem = {
  name: Menu["name"];
  price: Menu["price"];
  imagePath: Menu["imagePath"];
  quantity: number;
};

type AddItem = {
  name: CartItem["name"];
  price: CartItem["price"];
  imagePath: CartItem["imagePath"];
  quantity: CartItem["quantity"];
};

type EditItem = {
  name: CartItem["name"];
  price: CartItem["price"];
  quantity: CartItem["quantity"];
};

export type ItemDetail = {
  imagePath: CartItem["imagePath"];
  subtotal: CartItem["price"];
  quantity: CartItem["quantity"];
};

export type CartState = Record<CartItem["name"], ItemDetail>;

const initialCart: CartState = {};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialCart,
  reducers: {
    include: (state, action: PayloadAction<AddItem>) => {
      const { name, price, imagePath, quantity } = action.payload;

      if (!state[name]) {
        state[name] = {
          imagePath,
          subtotal: price * quantity,
          quantity,
        };

        return;
      }

      const item = state[name];
      item.subtotal += price * quantity;
      item.quantity += quantity;
    },
    exclude: (state, action: PayloadAction<Menu["name"]>) => {
      delete state[action.payload];
    },
    edit: (state, action: PayloadAction<EditItem>) => {
      const { name, price, quantity } = action.payload;
      if (!state[name]) {
        return;
      }
      if (quantity < 1 || quantity > 10) {
        return;
      }

      state[name].subtotal = price * quantity;
      state[name].quantity = quantity;
    },
    increment: (state, action: PayloadAction<Menu["name"]>) => {
      const name = action.payload;
      if (!state[name]) {
        return;
      }

      state[name].subtotal += state[name].subtotal / state[name].quantity;
      state[name].quantity += 1;
    },
    decrement: (state, action: PayloadAction<Menu["name"]>) => {
      const name = action.payload;
      if (!state[name]) {
        return;
      }

      state[name].subtotal -= state[name].subtotal / state[name].quantity;
      state[name].quantity = Math.max(state[name].quantity - 1, 1);
    },
  },
});

export const { include, exclude, edit, increment, decrement } =
  cartSlice.actions;
export default cartSlice.reducer;
