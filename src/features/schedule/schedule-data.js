import { t } from "../../shared/language.js";

export const SESSION_MINUTES = 45;
export const PRICE_PER_SESSION = 70000;
export const SESSION_MIN = 2;
export const SESSION_MAX = 8;

export const WINDOWS = [
  { id: "night", dayKey: "schedule.night.day", hoursKey: "schedule.night.hours" },
  { id: "sunday", dayKey: "schedule.sunday.day", hoursKey: "schedule.sunday.hours" },
];

export function totalPrice(count) {
  return PRICE_PER_SESSION * count;
}

export function formatWon(amount) {
  return t("price.format").replace("{amount}", amount.toLocaleString("en-US"));
}
