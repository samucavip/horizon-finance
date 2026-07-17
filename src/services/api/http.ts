// Thin typed fetch wrapper for external REST APIs (the seam for non-Supabase
// integrations such as a live exchange-rate provider). Supabase access lives in
// services/supabase and does not go through here.
export async function httpGet<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, method: "GET" });
  if (!res.ok) {
    throw new Error(`GET ${url} falhou: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}
