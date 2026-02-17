import axios from "axios";
import { AxiosResponse } from "axios";
import {
  MenuCategory,
  MenuResponse,
  SpecificMenuResponse,
} from "../menus/menu_types";

export async function FetchMenusByCategory(
  category: MenuCategory
): Promise<AxiosResponse<MenuResponse> | undefined> {
  try {
    const response = await axios.get<MenuResponse>(
      `${process.env.NEXT_SERVER_BASE_URL}/menus/${category}`
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
      `${process.env.NEXT_SERVER_BASE_URL}/menus/${id}`
    );
    return response;
  } catch (err) {
    console.error("Failed to fetch specific menu:", err);
    return undefined;
  }
}
