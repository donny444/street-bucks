"use client";

import axios from "axios";
import { AxiosResponse } from "axios";
import {
  OrderedMenu,
  MenuCategory,
  MenuResponse,
  SpecificMenuResponse,
  MakeOrderResponse,
} from "./menu_types";

export async function MakeOrder(
  cart: OrderedMenu[]
): Promise<AxiosResponse<MakeOrderResponse> | undefined> {
  try {
    const response = await axios.post<MakeOrderResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/orders`,
      cart,
      {
        headers: {
          "branch-token": localStorage.getItem("branch-token"),
        },
        validateStatus: () => true,
      }
    );
    return response;
  } catch (err) {
    console.error("Failed to make order:", err);
    return undefined;
  }
}

export async function FetchMenusByCategory(
  category: MenuCategory
): Promise<AxiosResponse<MenuResponse> | undefined> {
  try {
    const response = await axios.get<MenuResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/menus/${category}`,
      {
        validateStatus: () => true,
      }
    );
    return response;
  } catch (err) {
    console.error(`Failed to fetch ${category} menus:`, err);
    return undefined;
  }
}

export async function FetchSpecificMenu(
  id: number
): Promise<AxiosResponse<SpecificMenuResponse> | undefined> {
  try {
    const response = await axios.get<SpecificMenuResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/menus/${id}`,
      {
        validateStatus: () => true,
      }
    );
    return response;
  } catch (err) {
    console.error("Failed to fetch specific menu:", err);
    return undefined;
  }
}
