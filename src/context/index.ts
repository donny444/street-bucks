import React from "react";

export type AppContextState = {
  user?: { id: string; name: string } | null;
};

export const AppContext = React.createContext<AppContextState | undefined>(undefined);
