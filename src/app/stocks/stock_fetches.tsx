import axios from "axios";
import { AxiosResponse } from "axios";
import { StockResponse } from "./stock_types";

export async function FetchStocks(): Promise<
  AxiosResponse<StockResponse> | undefined
> {
  try {
    const response = await axios.get<StockResponse>(
      `${process.env.NEXT_SERVER_BASE_URL}/stocks`,
      {
        headers: {
          "Branch-Payload": localStorage.getItem("branchId"),
        },
      }
    );

    return response;
  } catch (err) {
    console.error("Failed to fetch stocks:", err);
    return undefined;
  }
}
