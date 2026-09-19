import { t } from "../../shared/language.js";
import { fillConsult, selectedGoalValue } from "../consult/consult.js";
import { loadFullWindows, windowIsFull } from "./booked.js";
import { getChosenWindows, onTimeChange, toggleWindow } from "./time-choice.js";

function paintChips(chips) {
  const chosen = getChosenWindows();
  chips.querySelectorAll(".time-chip").forEach((chip) => {
    const on = chosen.includes(chip.dataset.window);
    chip.classList.toggle("is-on", on);
    chip.setAttribute("aria-pressed", String(on));
  });
}

function markFullChips(chips) {
  chips.querySelectorAll(".time-chip").forEach((chip) => {
    if (!windowIsFull(chip.dataset.window)) return;
    chip.disabled = true;
    chip.querySelector("[data-chip-full]").textContent = t("schedule.full");
  });
}

export async function initSchedule() {
  const chips = document.querySelector("[data-time-chips]");
  if (!chips) return;

  await loadFullWindows();
  markFullChips(chips);

  chips.addEventListener("click", (event) => {
    const chip = event.target.closest(".time-chip");
    if (chip && !chip.disabled) toggleWindow(chip.dataset.window);
  });

  onTimeChange(() => paintChips(chips));
  document.addEventListener("i18n", () => markFullChips(chips));

  document.querySelector("[data-schedule-consult]")?.addEventListener("click", () => {
    fillConsult({ goalValue: selectedGoalValue() });
  });
}
