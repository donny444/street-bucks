import axios from "axios";
import { AxiosResponse } from "axios";
import { StockResponse } from "./stock_types";

export async function FetchStocks(): Promise<
  AxiosResponse<StockResponse> | undefined
> {
  try {
    const response = await axios.get<StockResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/stocks`,
      {
        headers: {
          "branch-token": localStorage.getItem("branch-token"),
        },
      }
    );

    return response;
  } catch (err) {
    console.error("Failed to fetch stocks:", err);
    return undefined;
  }
}
