import axios from "axios";
import { AxiosResponse } from "axios";

import { TodayOrdersResponse, SpecificOrderResponse } from "./order_types";

export async function FetchTodayOrders(): Promise<
  AxiosResponse<TodayOrdersResponse> | undefined
> {
  try {
    const response = await axios.get<TodayOrdersResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/orders`,
      {
        headers: {
          "branch-token": localStorage.getItem("branch-token"),
        },
      }
    );

    return response;
  } catch (err) {
    console.error("Failed to fetch today orders:", err);
    return undefined;
  }
}

export async function FetchSpecificOrder(
  uuid: string
): Promise<AxiosResponse<SpecificOrderResponse> | undefined> {
  try {
    const response = await axios.get<SpecificOrderResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/orders/${uuid}`,
      {
        headers: {
          "branch-token": localStorage.getItem("branch-token"),
        },
      }
    );

    return response;
  } catch (err) {
    console.error("Failed to fetch specific order:", err);
    return undefined;
  }
}

export async function FetchReceipt(
  uuid: string
): Promise<AxiosResponse<Blob> | undefined> {
  try {
    const response = await axios.get<Blob>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/orders/${uuid}/receipt`,
      {
        headers: {
          "branch-token": localStorage.getItem("branch-token"),
        },
        responseType: "blob",
      }
    );

    return response;
  } catch (err) {
    console.error("Failed to fetch receipt:", err);
    return undefined;
  }
}
