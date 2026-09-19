const BOOKED_URL = "src/features/schedule/booked-slots.json";

let fullWindows = [];

export async function loadFullWindows() {
  try {
    const response = await fetch(BOOKED_URL, { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    fullWindows = Array.isArray(data.full) ? data.full : [];
  } catch {
    fullWindows = [];
  }
}

export function windowIsFull(id) {
  return fullWindows.includes(id);
}
