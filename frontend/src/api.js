const BASE_URL = "http://localhost:8000";

export async function calculateBand(payload) {
  const res = await fetch(`${BASE_URL}/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to calculate");
  return res.json();
}

export async function fetchRecords() {
  const res = await fetch(`${BASE_URL}/records`);
  if (!res.ok) throw new Error("Failed to fetch records");
  return res.json();
}

export async function filterRecords(params) {
  const url = new URL(`${BASE_URL}/filter`);
  if (params.brand) url.searchParams.set("brand", params.brand);
  if (params.thickness) url.searchParams.set("thickness", params.thickness);

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to filter records");
  return res.json();
}

export function chartUrl() {
  return `${BASE_URL}/chart/active-vs-thickness`;
}