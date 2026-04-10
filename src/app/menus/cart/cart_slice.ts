import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Menu } from "../menu_types";

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

// Helper to load cart from sessionStorage
const loadCartFromStorage = (): CartState => {
  if (typeof window === "undefined") {
    return {};
  }
  try {
    const stored = sessionStorage.getItem("cart");
    return stored ? (JSON.parse(stored) as CartState) : {};
  } catch {
    return {};
  }
};

// Helper to save cart to sessionStorage
const saveCartToStorage = (state: CartState): void => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    sessionStorage.setItem("cart", JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
};

const initialCart: CartState = loadCartFromStorage();

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

        saveCartToStorage(state);
        return;
      }

      const item = state[name];
      item.subtotal += price * quantity;
      item.quantity += quantity;
      saveCartToStorage(state);
    },
    exclude: (state, action: PayloadAction<Menu["name"]>) => {
      delete state[action.payload];
      saveCartToStorage(state);
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
      saveCartToStorage(state);
    },
    increment: (state, action: PayloadAction<Menu["name"]>) => {
      const name = action.payload;
      if (!state[name] || state[name].quantity === 10) {
        return;
      }

      state[name].subtotal += state[name].subtotal / state[name].quantity;
      state[name].quantity += 1;
      saveCartToStorage(state);
    },
    decrement: (state, action: PayloadAction<Menu["name"]>) => {
      const name = action.payload;
      if (!state[name] || state[name].quantity === 1) {
        return;
      }

      state[name].subtotal -= state[name].subtotal / state[name].quantity;
      state[name].quantity = Math.max(state[name].quantity - 1, 1);
      saveCartToStorage(state);
    },
    // Action to clear entire cart after placing order
    clear: (state) => {
      Object.keys(state).forEach((key) => delete state[key]);
      saveCartToStorage({});
    },
    // Action to hydrate cart from sessionStorage on client side
    hydrate: (state) => {
      const stored = loadCartFromStorage();
      return { ...state, ...stored };
    },
  },
});

export const { include, exclude, edit, increment, decrement, clear, hydrate } =
  cartSlice.actions;

export const selectCartEntryCount = (state: { cart: CartState }) =>
  Object.keys(state.cart).length;

export default cartSlice.reducer;
