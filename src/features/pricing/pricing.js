import { PRICE_PER_SESSION, formatWon } from "../schedule/schedule-data.js";

function paintPrice() {
  document.querySelectorAll("[data-session-price]").forEach((node) => {
    node.textContent = formatWon(PRICE_PER_SESSION);
  });
}

export function initPricing() {
  paintPrice();
  document.addEventListener("i18n", paintPrice);
}
