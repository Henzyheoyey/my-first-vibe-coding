import { fillConsult, selectedGoalValue } from "../consult/consult.js";
import { loadBooked } from "./booked.js";
import { bindSlotPicker } from "./slot-picker.js";

export async function initSchedule() {
  const root = document.querySelector("#schedule");
  if (!root) return;

  await loadBooked();

  const picker = bindSlotPicker(root, {
    hint: root.querySelector("[data-schedule-hint]"),
    summary: root.querySelector("[data-slot-summary]"),
    consultBtn: root.querySelector("[data-schedule-consult]"),
  });

  root.querySelector("[data-schedule-consult]")?.addEventListener("click", () => {
    fillConsult({
      goalValue: selectedGoalValue(),
      selection: picker?.getSelection(),
    });
  });
}
