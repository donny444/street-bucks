import axios from "axios";
import { AxiosResponse } from "axios";
import {
  BranchStocksResponse,
  EditStockRequest,
  StockUpdateResponse,
} from "./stock_types";

export async function FetchStocks(): Promise<
  AxiosResponse<BranchStocksResponse> | undefined
> {
  try {
    const response = await axios.get<BranchStocksResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/stocks`,
      {
        headers: {
          "branch-token": localStorage.getItem("branch-token"),
        },
        validateStatus: () => true,
      }
    );

    return response;
  } catch (err) {
    console.error("Failed to fetch stocks:", err);
    return undefined;
  }
}

export async function EditStock({
  recipeId,
  quantity,
}: EditStockRequest): Promise<AxiosResponse<StockUpdateResponse> | undefined> {
  try {
    const response = await axios.put<StockUpdateResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/stocks`,
      {
        recipeId,
        quantity,
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
    console.error("Failed to edit stock:", err);
    return undefined;
  }
}
