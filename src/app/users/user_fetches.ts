import axios from "axios";
import { AxiosResponse } from "axios";

import { GenericResponse } from "../utils/global_types";

import { UserForm, BranchUsersResponse, UserFormResponse } from "./user_types";

export async function FetchBranchUsers(): Promise<
  AxiosResponse<BranchUsersResponse> | undefined
> {
  try {
    const response = await axios.get<BranchUsersResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/users`,
      {
        headers: {
          "branch-token": localStorage.getItem("branch-token"),
        },
        validateStatus: () => true,
      }
    );

    return response;
  } catch (err) {
    console.error("Failed to fetch branch users:", err);
    return undefined;
  }
}

export async function FetchUserForm(
  email: string
): Promise<AxiosResponse<UserFormResponse> | undefined> {
  try {
    const response = await axios.get<UserFormResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/users/${email}`,
      {
        validateStatus: () => true,
      }
    );

    return response;
  } catch (err) {
    console.error(`Failed to fetch user with email '${email}':`, err);
    return undefined;
  }
}

export async function AddUser(
  email: string,
  firstName: string,
  lastName: string,
  password: string
): Promise<AxiosResponse<GenericResponse> | undefined> {
  try {
    const response = await axios.post<GenericResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/users`,
      {
        email,
        firstName,
        lastName,
        password,
      },
      {
        headers: {
          "branch-token": localStorage.getItem("branch-token"),
        },
        validateStatus: () => true,
      }
    );

    return response;
  } catch (err) {
    console.error("Failed to add user:", err);
    return undefined;
  }
}

export async function AttendUser(
  email: string,
  password: string
): Promise<AxiosResponse<GenericResponse> | undefined> {
  try {
    const response = await axios.post<GenericResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/users/${email}`,
      { password },
      {
        headers: {
          "branch-token": localStorage.getItem("branch-token"),
        },
        validateStatus: () => true,
      }
    );

    return response;
  } catch (err) {
    console.error(`Failed to attend user with email '${email}':`, err);
    return undefined;
  }
}

export async function EditUser(
  email: string,
  user: UserForm,
  password: string | undefined,
  editorEmail: string,
  editorPassword: string
): Promise<AxiosResponse<GenericResponse> | undefined> {
  try {
    const response = await axios.put<GenericResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/users/${email}`,
      {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        ...(password && { password }),
        editor: {
          email: editorEmail,
          password: editorPassword,
        },
      },
      {
        headers: {
          "branch-token": localStorage.getItem("branch-token"),
        },
        validateStatus: () => true,
      }
    );

    return response;
  } catch (err) {
    console.error(`Failed to edit user with email '${email}':`, err);
    return undefined;
  }
}

export async function DeleteUser(
  email: string,
  editorEmail: string,
  editorPassword: string
): Promise<AxiosResponse<GenericResponse> | undefined> {
  try {
    const response = await axios.post<GenericResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/users/remove/${email}`,
      {
        editor: {
          email: editorEmail,
          password: editorPassword,
        },
      },
      {
        headers: {
          "branch-token": localStorage.getItem("branch-token"),
        },
        validateStatus: () => true,
      }
    );

    return response;
  } catch (err) {
    console.error(`Failed to delete user with email '${email}':`, err);
    return undefined;
  }
}
