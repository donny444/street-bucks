import axios from "axios";
import { AxiosResponse } from "axios";

import { BranchUsersResponse, SpecificUserResponse } from "../users/user_types";

export async function FetchBranchUsers(): Promise<AxiosResponse<BranchUsersResponse> | undefined> {
  try {
    const response = await axios.get<BranchUsersResponse>(`${process.env.NEXT_PUBLIC_SERVER_URL}/users`, {
      headers: {
        "Branch-Payload": localStorage.getItem("branchId"),
      },
    });

    return response;
  } catch (err) {
    console.error("Failed to fetch branch users:", err);
    return undefined;
  }
}

export async function FetchSpecificUser(email: string): Promise<AxiosResponse<SpecificUserResponse> | undefined> {
  try {
    const response = await axios.get<SpecificUserResponse>(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${email}`, {
      headers: {
        "Branch-Payload": localStorage.getItem("branchId"),
      },
    });

    return response;
  } catch (err) {
    console.error(`Failed to fetch user with email '${email}':`, err);
    return undefined;
  }
}

export async function DeleteUser(email: string): Promise<AxiosResponse<SpecificUserResponse> | undefined> {
  try {
    const response = await axios.delete<SpecificUserResponse>(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${email}`, {
      headers: {
        "Branch-Payload": localStorage.getItem("branchId"),
      },
    });

    return response;
  } catch (err) {
    console.error(`Failed to delete user with email '${email}':`, err);
    return undefined;
  }
}