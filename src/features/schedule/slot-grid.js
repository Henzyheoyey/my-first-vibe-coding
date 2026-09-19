import { t } from "../../shared/language.js";
import { SESSION_MAX, makeSlots } from "./schedule-data.js";
import { slotIsBooked } from "./booked.js";

export function renderWindow(grid, windowItem) {
  grid.innerHTML = "";
  makeSlots(windowItem.start, windowItem.end).forEach((slot) => {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "time-cell";
    cell.textContent = slot.label;
    cell.dataset.window = windowItem.id;
    cell.dataset.label = slot.label;
    if (slotIsBooked(windowItem.id, slot.start, slot.end)) {
      cell.classList.add("is-booked");
      cell.disabled = true;
      cell.textContent = `${slot.label} · ${t("schedule.unavailable")}`;
    }
    grid.append(cell);
  });
}

export function fillCountOptions(select) {
  if (!select || select.dataset.filled) return;
  for (let n = 1; n <= SESSION_MAX; n += 1) {
    const option = document.createElement("option");
    option.value = String(n);
    option.textContent = String(n);
    select.append(option);
  }
  select.dataset.filled = "true";
}
