import { t } from "../../shared/language.js";
import {
  PACKAGES,
  WINDOWS,
  SLOT_MINUTES,
  MIN_PICKS,
  formatWorth,
} from "./schedule-data.js";
import { renderWindow, fillCountOptions } from "./slot-grid.js";

export function selectedCells(root) {
  return [...root.querySelectorAll(".time-cell.is-on")];
}

function pickedPackage(root) {
  const radio = root.querySelector("[data-package]:checked");
  if (!radio) return null;
  return PACKAGES.find((item) => item.id === radio.value) ?? null;
}

function sessionCount(root) {
  return Number(root.querySelector("[data-session-count]")?.value) || 0;
}

function timeLabels(root) {
  return selectedCells(root).map((cell) => {
    const windowItem = WINDOWS.find((item) => item.id === cell.dataset.window);
    return `${t(windowItem.titleKey)} ${cell.dataset.label}`;
  });
}

export function summaryText(root) {
  const pkg = pickedPackage(root);
  const times = timeLabels(root);
  if (!pkg || times.length < MIN_PICKS) return "";
  const count = sessionCount(root);
  let text = `${t(pkg.labelKey)} · ${times.join(" + ")}`;
  if (count) {
    text += ` · ${count}회 (${count * SLOT_MINUTES}분) · ${formatWorth(count)} 상당 수업`;
  }
  return text;
}

export function bindSlotPicker(root, options = {}) {
  const { hint, summary, consultBtn, onChange } = options;
  const windows = root.querySelector("[data-slot-windows]");
  const tune = root.querySelector("[data-tune-block]");
  const tuneLine = root.querySelector("[data-tune-line]");
  const countSelect = root.querySelector("[data-session-count]");
  const minsNode = root.querySelector("[data-session-mins]");
  const worthNode = root.querySelector("[data-session-worth]");
  if (!windows) return null;

  fillCountOptions(countSelect);

  function sync() {
    const pkg = pickedPackage(root);
    const times = timeLabels(root);
    const ready = Boolean(pkg && times.length >= MIN_PICKS);
    const count = sessionCount(root);

    if (hint) {
      hint.hidden = !pkg;
      if (pkg) hint.textContent = t("schedule.pickMany");
    }
    if (summary) {
      summary.hidden = !ready;
      if (ready) summary.textContent = summaryText(root);
    }
    if (tune) tune.hidden = !ready;
    if (tuneLine && ready) {
      tuneLine.textContent = t("schedule.tune").replace("{times}", times.join(", "));
    }
    if (minsNode) {
      minsNode.textContent = count ? t("schedule.mins").replace("{mins}", String(count * SLOT_MINUTES)) : "";
    }
    if (worthNode) {
      worthNode.textContent = count ? t("schedule.worth").replace("{price}", formatWorth(count)) : "";
    }
    consultBtn?.classList.toggle("is-on", ready);
    onChange?.(summaryText(root));
  }

  function redraw() {
    const pkg = pickedPackage(root);
    windows.hidden = !pkg;
    if (!pkg) {
      consultBtn?.classList.remove("is-on");
      if (hint) hint.hidden = true;
      if (summary) summary.hidden = true;
      if (tune) tune.hidden = true;
      onChange?.("");
      return;
    }
    WINDOWS.forEach((windowItem) => {
      const grid = root.querySelector(`[data-slot-grid="${windowItem.id}"]`);
      if (grid) renderWindow(grid, windowItem);
    });
    sync();
  }

  const api = {
    getSummary: () => summaryText(root),
    getSelection: () => ({
      packageId: pickedPackage(root)?.id ?? "",
      keys: selectedCells(root).map((cell) => `${cell.dataset.window}|${cell.dataset.label}`),
      sessionCount: sessionCount(root),
    }),
    applySelection(selection) {
      if (!selection?.packageId) return;
      const radio = root.querySelector(`[data-package][value="${selection.packageId}"]`);
      if (!radio) return;
      radio.checked = true;
      redraw();
      selection.keys?.forEach((key) => {
        const [windowId, label] = key.split("|");
        const cell = [...root.querySelectorAll(".time-cell")].find(
          (item) => item.dataset.window === windowId && item.dataset.label === label,
        );
        if (cell && !cell.disabled) cell.classList.add("is-on");
      });
      if (countSelect && selection.sessionCount) {
        countSelect.value = String(selection.sessionCount);
      }
      sync();
    },
    reset() {
      root.querySelectorAll("[data-package]").forEach((input) => {
        input.checked = false;
      });
      if (countSelect) countSelect.value = "";
      redraw();
    },
  };

  root.querySelectorAll("[data-package]").forEach((input) => {
    input.addEventListener("change", redraw);
  });

  windows.addEventListener("click", (event) => {
    const cell = event.target.closest(".time-cell");
    if (!cell || cell.disabled) return;
    cell.classList.toggle("is-on");
    sync();
  });

  countSelect?.addEventListener("change", sync);
  document.addEventListener("i18n", () => {
    const selection = api.getSelection();
    if (selection.packageId) api.applySelection(selection);
    else sync();
  });

  redraw();
  root.slotPicker = api;
  return api;
}
