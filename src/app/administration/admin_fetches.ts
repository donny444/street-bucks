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

export async function AdminSignin({
  email,
  password,
}: AdminSignInParams): Promise<AxiosResponse<AdminSignInResponse> | undefined> {
  try {
    const response = await axios.post<AdminSignInResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/users/sign-in/administrator`,
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
    const response = await axios.get<BranchResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/branches`
    );
    return response;
  } catch (err) {
    console.error("Failed to fetch branches:", err);
    return undefined;
  }
}

export async function AddBranch(): Promise<
  AxiosResponse<BranchResponse> | undefined
> {
  try {
    const response = await axios.post<BranchResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/branches`
    );
    return response;
  } catch (err) {
    console.error("Failed to add branch:", err);
    return undefined;
  }
}

export async function FetchAllMenus(): Promise<
  AxiosResponse<MenuResponse> | undefined
> {
  try {
    const response = await axios.get<MenuResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/menus`,
      {
        validateStatus: () => true,
      }
    );
    return response;
  } catch (err) {
    console.error("Failed to fetch menus:", err);
    return undefined;
  }
}

export async function UpdateMenu(
  data: MenuResponse
): Promise<AxiosResponse<MenuResponse> | undefined> {
  try {
    const response = await axios.put<MenuResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/menus`,
      data
    );
    return response;
  } catch (err) {
    console.error("Failed to update menu:", err);
    return undefined;
  }
}

export async function FetchRecipes(): Promise<
  AxiosResponse<RecipeResponse> | undefined
> {
  try {
    const response = await axios.get<RecipeResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/recipes`,
      {
        validateStatus: () => true,
      }
    );
    return response;
  } catch (err) {
    console.error("Failed to fetch recipes:", err);
    return undefined;
  }
}

export async function UpdateRecipe(
  data: RecipeResponse
): Promise<AxiosResponse<RecipeResponse> | undefined> {
  try {
    const response = await axios.put<RecipeResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/recipes`,
      data
    );
    return response;
  } catch (err) {
    console.error("Failed to update recipe:", err);
    return undefined;
  }
}

export async function FetchUsersByName(
  name: string
): Promise<AxiosResponse<UserResponse> | undefined> {
  try {
    const response = await axios.get<UserResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/users/search`,
      {
        params: {
          name,
        },
        validateStatus: () => true,
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
      `${process.env.NEXT_PUBLIC_SERVER_URL}/orders/${uuid}/find`,
      {
        validateStatus: () => true,
      }
    );
    return response;
  } catch (err) {
    console.error("Failed to fetch order:", err);
    return undefined;
  }
}
