import React from "react";

export const PageContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: "block", gap: 16 }}>{children}</div>
);
