import React from "react";

export const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label style={{ display: "block", marginBottom: 8 }}>
    <div style={{ fontSize: 13, color: "#374151", marginBottom: 6 }}>{label}</div>
    {children}
  </label>
);
