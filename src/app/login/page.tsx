"use client";
import React from "react";

export default function LoginPage() {
  return (
    <section>
      <h1>Login</h1>
      <form style={{ maxWidth: 360 }}>
        <label>
          Email
          <input type="email" name="email" style={{ display: "block", width: "100%", marginTop: 6 }} />
        </label>
        <label style={{ display: "block", marginTop: 12 }}>
          Password
          <input type="password" name="password" style={{ display: "block", width: "100%", marginTop: 6 }} />
        </label>
        <button type="submit" style={{ marginTop: 12 }}>Sign in</button>
      </form>
    </section>
  );
}
