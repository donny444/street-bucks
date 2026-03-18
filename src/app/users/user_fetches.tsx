import axios from "axios";
import { AxiosResponse } from "axios";

import {
  EditUser as EditUserType,
  BranchUsersResponse,
  UserFormResponse,
  AttendUserResponse,
  EditUserResponse,
  DeleteUserResponse,
} from "./user_types";

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
      `${process.env.NEXT_PUBLIC_SERVER_URL}/users/${email}`
    );

    return response;
  } catch (err) {
    console.error(`Failed to fetch user with email '${email}':`, err);
    return undefined;
  }
}

export async function AttendUser(
  email: string,
  password: string
): Promise<AxiosResponse<AttendUserResponse> | undefined> {
  try {
    const response = await axios.post<AttendUserResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/users/${email}`,
      { password },
      {
        headers: {
          "branch-token": localStorage.getItem("branch-token"),
        },
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
  user: EditUserType,
  editorEmail: string,
  editorPassword: string
): Promise<AxiosResponse<EditUserResponse> | undefined> {
  try {
    const response = await axios.put<EditUserResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/users/${email}`,
      {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        password: user.password,
        editor: {
          email: editorEmail,
          password: editorPassword,
        },
      },
      {
        headers: {
          "branch-token": localStorage.getItem("branch-token"),
        },
      }
    );

    return response;
  } catch (err) {
    console.error(`Failed to edit user with email '${email}':`, err);
    return undefined;
  }
}

export async function DeleteUser(
  email: string
): Promise<AxiosResponse<DeleteUserResponse> | undefined> {
  try {
    const response = await axios.delete<DeleteUserResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/users/${email}`,
      {
        headers: {
          "branch-token": localStorage.getItem("branch-token"),
        },
      }
    );

    return response;
  } catch (err) {
    console.error(`Failed to delete user with email '${email}':`, err);
    return undefined;
  }
}
