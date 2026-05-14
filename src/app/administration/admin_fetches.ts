import axios from "axios";
import { AxiosResponse } from "axios";

import { GenericResponse } from "../utils/global_types";

import {
  AdminSignInParams,
  AdminSignInResponse,
  BranchResponse,
  MenuResponse,
  RecipeResponse,
  UserResponse,
  OrderResponse,
  MenuFormResponse,
  MenuIngredientsResponse,
  IngredientListResponse,
  MenuForm,
} from "./admin_types";

export async function AdminSignin({
  email,
  password,
}: AdminSignInParams): Promise<AxiosResponse<AdminSignInResponse> | undefined> {
  try {
    const response = await axios.post<AdminSignInResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/users/administrator/sign-in`,
      {
        email,
        password,
      },
      {
        validateStatus: () => true,
      },
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
      `${process.env.NEXT_PUBLIC_SERVER_URL}/branches`,
      {
        headers: {
          "admin-token": sessionStorage.getItem("admin-token"),
        },
        validateStatus: () => true,
      }
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
      `${process.env.NEXT_PUBLIC_SERVER_URL}/branches`,
      {
        headers: {
          "admin-token": sessionStorage.getItem("admin-token"),
        },
        validateStatus: () => true,
      },
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
        headers: {
          "admin-token": sessionStorage.getItem("admin-token"),
        },
        validateStatus: () => true,
      }
    );
    return response;
  } catch (err) {
    console.error("Failed to fetch menus:", err);
    return undefined;
  }
}

export async function FetchMenuForm(
  name: string
): Promise<AxiosResponse<MenuFormResponse> | undefined> {
  try {
    const response = await axios.get<MenuFormResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/menus/form/${name}`,
      {
        headers: {
          "admin-token": sessionStorage.getItem("admin-token"),
        },
        validateStatus: () => true,
      }
    );
    return response;
  } catch (err) {
    console.error("Failed to fetch menu form:", err);
    return undefined;
  }
}

export async function FetchMenuIngredients(
  menuName: string
): Promise<AxiosResponse<MenuIngredientsResponse> | undefined> {
  try {
    const response = await axios.get<MenuIngredientsResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/ingredients/${menuName}`,
      {
        headers: {
          "admin-token": sessionStorage.getItem("admin-token"),
        },
        validateStatus: () => true,
      }
    );
    return response;
  } catch (err) {
    console.error("Failed to fetch menu ingredients:", err);
    return undefined;
  }
}

export async function FetchIngredientList(): Promise<
  AxiosResponse<IngredientListResponse> | undefined
> {
  try {
    const response = await axios.get<IngredientListResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/ingredients`,
      {
        headers: {
          "admin-token": sessionStorage.getItem("admin-token"),
        },
        validateStatus: () => true,
      }
    );
    return response;
  } catch (err) {
    console.error("Failed to fetch ingredient list:", err);
    return undefined;
  }
}

export async function AddMenu(
  data: MenuForm
): Promise<AxiosResponse<GenericResponse> | undefined> {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price.toString());
    formData.append("category", data.category);
    if (data.note) {
      formData.append("note", data.note);
    }
    if (data.ingredient && data.ingredient.length > 0) {
      formData.append("ingredient", JSON.stringify(data.ingredient));
    }
    if (data.file) {
      formData.append("file", data.file);
    }

    const response = await axios.post<GenericResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/menus`,
      formData,
      {
        headers: {
          "admin-token": sessionStorage.getItem("admin-token"),
          "Content-Type": "multipart/form-data",
        },
        validateStatus: () => true,
      },
    );
    return response;
  } catch (err) {
    console.error("Failed to add menu:", err);
    return undefined;
  }
}

export async function EditMenu(
  data: MenuForm,
  originalName: string
): Promise<AxiosResponse<MenuResponse> | undefined> {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price.toString());
    formData.append("category", data.category);
    if (data.note) {
      formData.append("note", data.note);
    }
    if (data.ingredient && data.ingredient.length > 0) {
      formData.append("ingredient", JSON.stringify(data.ingredient));
    }
    if (data.file) {
      formData.append("file", data.file);
    }

    const response = await axios.put<MenuResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/menus/${originalName}`,
      formData,
      {
        headers: {
          "admin-token": sessionStorage.getItem("admin-token"),
          "Content-Type": "multipart/form-data",
        },
        validateStatus: () => true,
      },
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
        headers: {
          "admin-token": sessionStorage.getItem("admin-token"),
        },
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
      data,
      {
        headers: {
          "admin-token": sessionStorage.getItem("admin-token"),
        },
        validateStatus: () => true,
      },
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
      `${process.env.NEXT_PUBLIC_SERVER_URL}/search/users`,
      {
        params: {
          name,
        },
        headers: {
          "admin-token": sessionStorage.getItem("admin-token"),
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
      `${process.env.NEXT_PUBLIC_SERVER_URL}/orders/find/${uuid}`,
      {
        headers: {
          "admin-token": sessionStorage.getItem("admin-token"),
        },
        validateStatus: () => true,
      }
    );
    return response;
  } catch (err) {
    console.error("Failed to fetch order:", err);
    return undefined;
  }
}
