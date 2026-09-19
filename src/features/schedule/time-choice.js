import { t } from "../../shared/language.js";
import { WINDOWS } from "./schedule-data.js";

const listeners = new Set();
let chosen = [];

export function getChosenWindows() {
  return [...chosen];
}

export function setChosenWindows(ids) {
  chosen = WINDOWS.filter((item) => ids.includes(item.id)).map((item) => item.id);
  listeners.forEach((notify) => notify());
}

export function toggleWindow(id) {
  if (chosen.includes(id)) setChosenWindows(chosen.filter((item) => item !== id));
  else setChosenWindows([...chosen, id]);
}

export function onTimeChange(notify) {
  listeners.add(notify);
  notify();
}

export function chosenTimeLabel() {
  const picked = WINDOWS.filter((item) => chosen.includes(item.id));
  return picked.map((item) => `${t(item.dayKey)} ${t(item.hoursKey)}`).join(", ");
}
