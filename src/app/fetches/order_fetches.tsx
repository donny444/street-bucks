import axios from "axios";
import { AxiosResponse } from "axios";

import { TodayOrdersResponse } from "../orders/order_types";

export async function FetchTodayOrders(): Promise<AxiosResponse<TodayOrdersResponse> | undefined> {
  try {
    const response = await axios.get<TodayOrdersResponse>(`${process.env.NEXT_PUBLIC_SERVER_URL}/orders`, {
      headers: {
        "Branch-Payload": localStorage.getItem("branchId"),
      },
    });

    return response;
  } catch (err) {
    console.error("Failed to fetch today orders:", err);
    return undefined;
  }
}