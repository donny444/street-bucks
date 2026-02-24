"use client";

import axios from "axios";
import { AxiosResponse } from "axios";
import {
  BranchIdsResponse,
  BranchSignInParams,
  BranchSignInResponse,
} from "./branch_types";

export async function FetchBranchIds(): Promise<
  AxiosResponse<BranchIdsResponse> | undefined
> {
  try {
    const response = await axios.get<BranchIdsResponse>(
      "${process.env.PUBLIC_SERVER_URL}/branches"
    );
    return response;
  } catch (err) {
    console.error("Failed to fetch branch IDs:", err);
    return undefined;
  }
}

export async function BranchSignin({
  branchId,
  password,
}: BranchSignInParams): Promise<
  AxiosResponse<BranchSignInResponse> | undefined
> {
  try {
    const response = await axios.post(
      "${process.env.PUBLIC_SERVER_URL}/branches/signin",
      {
        branchId,
        password,
      }
    );
    return response;
  } catch (err) {
    console.error("Failed to sign into branch:", err);
    return undefined;
  }
}
