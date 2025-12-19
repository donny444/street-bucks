import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" };

export const Button: React.FC<ButtonProps> = ({ children, variant = "primary", ...props }) => {
  const style =
    variant === "primary"
      ? { background: "#0366d6", color: "#fff", border: "none", padding: "0.5rem 1rem", borderRadius: 6 }
      : { background: "transparent", border: "1px solid #e5e7eb", padding: "0.5rem 1rem", borderRadius: 6 };
  return (
    <button {...props} style={style}>
      {children}
    </button>
  );
};
