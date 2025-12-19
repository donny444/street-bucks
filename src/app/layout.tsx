import React from "react";
import "./globals.css";

export const metadata = {
  title: "Street Bucks",
  description: "Admin dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container">
            <a className="brand" href="/">Street Bucks</a>
            <nav className="nav">
              <a href="/dashboard">Dashboard</a>
              <a href="/orders">Orders</a>
              <a href="/inventory">Inventory</a>
              <a href="/employees">Employees</a>
              <a href="/branches">Branches</a>
              <a href="/login">Login</a>
            </nav>
          </div>
        </header>

        <main className="container main">{children}</main>

        <footer className="site-footer">
          <div className="container">© {new Date().getFullYear()} Street Bucks</div>
        </footer>
      </body>
    </html>
  );
}
