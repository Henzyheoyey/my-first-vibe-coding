import { t } from "../../shared/language.js";
import {
  SESSION_MAX,
  SESSION_MIN,
  SESSION_MINUTES,
  formatWon,
  totalPrice,
} from "../schedule/schedule-data.js";
import { chosenTimeLabel, onTimeChange, setChosenWindows } from "../schedule/time-choice.js";

function countLabel(count) {
  const label =
    count === 1
      ? t("register.countOne")
      : t("register.countUnit")
          .replace("{count}", count)
          .replace("{mins}", count * SESSION_MINUTES);
  if (count >= SESSION_MIN) return label;
  return `${label} · ${t("register.countMin")}`;
}

function fillCountOptions(select) {
  if (select.dataset.filled) return;
  for (let count = 1; count <= SESSION_MAX; count += 1) {
    const option = document.createElement("option");
    option.value = String(count);
    option.disabled = count < SESSION_MIN;
    select.append(option);
  }
  select.dataset.filled = "true";
}

function labelCountOptions(select) {
  [...select.options].forEach((option) => {
    option.textContent = option.value ? countLabel(Number(option.value)) : t("register.countAsk");
  });
}

export function bindPlanFields(root) {
  const timeText = root.querySelector("[data-picked-time]");
  const formatSelect = root.querySelector("[data-format]");
  const countSelect = root.querySelector("[data-count]");
  const totalNode = root.querySelector("[data-total]");
  const field = root.querySelector("[data-timetable-field]");

  fillCountOptions(countSelect);

  function summaryText() {
    const count = Number(countSelect.value);
    const parts = [chosenTimeLabel(), formatSelect.selectedOptions[0]?.textContent];
    if (count) parts.push(countLabel(count), formatWon(totalPrice(count)));
    return parts.filter(Boolean).join(" / ");
  }

  function sync() {
    labelCountOptions(countSelect);
    const time = chosenTimeLabel();
    timeText.textContent = time || t("register.noTime");
    timeText.classList.toggle("is-empty", !time);

    const count = Number(countSelect.value);
    totalNode.textContent = count ? formatWon(totalPrice(count)) : t("register.totalAsk");
    field.value = summaryText();
  }

  onTimeChange(sync);
  formatSelect.addEventListener("change", sync);
  countSelect.addEventListener("change", sync);
  document.addEventListener("i18n", sync);

  return {
    reset() {
      setChosenWindows([]);
      sync();
    },
  };
}
