import { parseHm } from "./schedule-data.js";

const BOOKED_URL = "src/features/schedule/booked-slots.json";

let booked = [];

export async function loadBooked() {
  try {
    const response = await fetch(BOOKED_URL, { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    booked = Array.isArray(data.booked) ? data.booked : [];
  } catch {
    booked = [];
  }
}

export function slotIsBooked(windowId, start, end) {
  return booked.some((item) => {
    if (item.window !== windowId) return false;
    const bookedStart = parseHm(item.start);
    const bookedEnd = parseHm(item.end);
    return start < bookedEnd && end > bookedStart;
  });
}
