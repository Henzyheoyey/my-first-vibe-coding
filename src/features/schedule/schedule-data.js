export const SLOT_MINUTES = 45;
export const PICK_MINUTES = 60;
export const PRICE_PER_SESSION = 70000;
export const SESSION_MAX = 8;
export const MIN_PICKS = 2;

export const PACKAGES = [
  { id: "two45", labelKey: "schedule.pkg.two45" },
  { id: "one90", labelKey: "schedule.pkg.one90" },
];

export const WINDOWS = [
  {
    id: "night",
    titleKey: "schedule.nightTitle",
    start: 22 * 60,
    end: 24 * 60,
  },
  {
    id: "sunday",
    titleKey: "schedule.sundayTitle",
    start: 8 * 60,
    end: 12 * 60,
  },
];

function formatHm(minutes) {
  if (minutes === 24 * 60) return "24:00";
  const hour = Math.floor(minutes / 60);
  const min = minutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

export function parseHm(text) {
  const [hour, min] = text.split(":").map(Number);
  if (hour === 24 && min === 0) return 24 * 60;
  return hour * 60 + min;
}

export function formatWorth(count) {
  return `${(count * PRICE_PER_SESSION) / 10000}만원`;
}

export function makeSlots(startMin, endMin, duration = PICK_MINUTES, step = PICK_MINUTES) {
  const slots = [];
  for (let start = startMin; start + duration <= endMin; start += step) {
    const end = start + duration;
    slots.push({
      start,
      end,
      label: `${formatHm(start)}–${formatHm(end)}`,
    });
  }
  return slots;
}
