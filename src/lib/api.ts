import { API_BASE } from "./constants";

export async function apiFetch<T = any>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { credentials: "include", ...init });
  if (!res.ok) throw new Error(`API request failed: ${res.status}`);
  return res.json();
}
