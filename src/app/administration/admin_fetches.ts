import axios from "axios";
import { AxiosResponse } from "axios";
import {
  AdminSignInParams,
  AdminSignInResponse,
  BranchResponse,
  MenuResponse,
  RecipeResponse,
  UserResponse,
  OrderResponse,
} from "./admin_types";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export async function AdminSignin({
  email,
  password,
}: AdminSignInParams): Promise<AxiosResponse<AdminSignInResponse> | undefined> {
  try {
    const response = await axios.post<AdminSignInResponse>(
      `${SERVER_URL}/administrators/sign-in`,
      {
        email,
        password,
      }
    );
    return response;
  } catch (err) {
    console.error("Failed to sign into admin:", err);
    return undefined;
  }
}

export async function FetchBranches(): Promise<
  AxiosResponse<BranchResponse> | undefined
> {
  try {
    const response = await axios.get<BranchResponse>(`${SERVER_URL}/branches`);
    // Assuming backend returns { branch_ids: [...] } and we map to our Branch interface
    // But BranchResponse expects { branches: Branch[] }
    // If backend returns ID list, we might need to adjust or map here.
    // For now assuming backend returns structured list for admin or we adapt.
    return response;
  } catch (err) {
    console.error("Failed to fetch branches:", err);
    return undefined;
  }
}

export async function FetchAllMenus(): Promise<
  AxiosResponse<MenuResponse> | undefined
> {
  try {
    const response = await axios.get<MenuResponse>(`${SERVER_URL}/menus`);
    return response;
  } catch (err) {
    console.error("Failed to fetch menus:", err);
    return undefined;
  }
}

export async function FetchRecipes(): Promise<
  AxiosResponse<RecipeResponse> | undefined
> {
  try {
    const response = await axios.get<RecipeResponse>(`${SERVER_URL}/recipes`);
    return response;
  } catch (err) {
    console.error("Failed to fetch recipes:", err);
    return undefined;
  }
}

export async function FetchUsersByName(
  name: string
): Promise<AxiosResponse<UserResponse> | undefined> {
  try {
    const response = await axios.get<UserResponse>(
      `${SERVER_URL}/users/search`,
      {
        params: {
          name,
        },
      }
    );
    return response;
  } catch (err) {
    console.error("Failed to fetch users by name:", err);
    return undefined;
  }
}

export async function FetchOrderByUuid(
  uuid: string
): Promise<AxiosResponse<OrderResponse> | undefined> {
  try {
    const response = await axios.get<OrderResponse>(
      `${SERVER_URL}/orders/find`,
      {
        params: {
          uuid,
        },
      }
    );
    return response;
  } catch (err) {
    console.error("Failed to fetch order:", err);
    return undefined;
  }
}
