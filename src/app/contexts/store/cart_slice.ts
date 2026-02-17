import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Menu } from "@/app/menus/menu_types";

type CartItem = {
  name: Menu["name"];
  price: Menu["price"];
  imagePath: Menu["imagePath"];
  quantity: number;
};

type ItemDetail = {
  imagePath: Menu["imagePath"];
  subtotal: Menu["price"];
  quantity: CartItem["quantity"];
};

export type CartState = Record<string, ItemDetail>;

const initialCart: CartState = {};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialCart,
  reducers: {
    include: (state, action: PayloadAction<CartItem>) => {
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
    exclude: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
    edit: (state, action: PayloadAction<CartItem>) => {
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
    increment: (state, action: PayloadAction<string>) => {
      const name = action.payload;
      if (!state[name]) {
        return;
      }

      state[name].subtotal += state[name].subtotal / state[name].quantity;
      state[name].quantity += 1;
    },
    decrement: (state, action: PayloadAction<string>) => {
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
