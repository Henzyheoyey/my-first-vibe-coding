import { copy } from "./copy.js";
import { getLanguage } from "../../shared/language.js";
import { parseLink, placeholderFor, platformFromUrl } from "./parse-link.js";
import { loadVideo } from "./fetch-video.js";
import { buildPrompt, demoPayload } from "./build-prompt.js";
import { renderBoard } from "./render-board.js";
import { hideProgress, playProgress } from "./progress.js";

const STORAGE_KEY = "class-lang";

function dict() {
  return copy[getLanguage()] ?? copy.ko;
}

function labels(d) {
  return {
    promptTitle: d["board.promptTitle"],
    promptEmpty: d["board.promptEmpty"],
    copy: d["board.copy"],
  };
}

function fillChrome(d) {
  document.documentElement.lang = getLanguage();
  document.title = d["meta.title"];
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const text = d[node.dataset.i18n];
    if (text) node.textContent = text;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    const text = d[node.dataset.i18nPlaceholder];
    if (text) node.setAttribute("placeholder", text);
  });
  document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.langBtn === getLanguage()));
  });
}

function paint(board, prompt) {
  renderBoard(board, { prompt, lang: getLanguage(), labels: labels(dict()) });
}

function markPlatform(root, platform) {
  root.querySelectorAll("[data-platform]").forEach((btn) => {
    btn.classList.toggle("is-on", btn.dataset.platform === platform);
  });
}

function copyText(text) {
  const input = document.createElement("textarea");
  input.value = text;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.left = "-9999px";
  document.body.append(input);
  input.select();
  const ok = document.execCommand("copy");
  input.remove();
  if (ok) return Promise.resolve();
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  return Promise.reject();
}

export function initAnalyze() {
  const board = document.querySelector("[data-board]");
  const form = document.querySelector("[data-analyze-form]");
  const urlInput = document.querySelector("[data-url]");
  const scriptInput = document.querySelector("[data-script]");
  const status = document.querySelector("[data-status]");
  const go = form.querySelector(".go");
  let lastPayload = null;

  fillChrome(dict());
  paint(board, "");

  function currentPrompt() {
    if (!lastPayload) return "";
    return buildPrompt(lastPayload, getLanguage());
  }

  async function run(kind) {
    const d = dict();
    status.hidden = true;
    if (kind !== "demo") {
      const url = urlInput.value.trim();
      const script = scriptInput.value.trim();
      if (!url && !script) {
        status.hidden = false;
        status.textContent = d["err.empty"];
        status.classList.add("is-err");
        return;
      }
      const parsed = parseLink(url);
      if (url && !parsed.ok) {
        status.hidden = false;
        status.textContent = d[`err.${parsed.reason}`] || d["err.unsupported"];
        status.classList.add("is-err");
        return;
      }
    }

    go.disabled = true;
    const progressDone = playProgress(document, d);
    try {
      lastPayload = kind === "demo" ? demoPayload() : await loadVideo({
        url: urlInput.value,
        script: scriptInput.value,
      });
      if (kind === "demo") {
        urlInput.value = lastPayload.url;
        markPlatform(document, "youtube");
      }
      const finish = await progressDone;
      finish();
      paint(board, currentPrompt());
    } finally {
      go.disabled = false;
      setTimeout(() => hideProgress(document), 600);
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    run("link");
  });
  document.querySelector("[data-demo]").addEventListener("click", () => run("demo"));
  document.querySelector("[data-script-toggle]").addEventListener("click", () => {
    const box = document.querySelector("[data-script-box]");
    box.hidden = !box.hidden;
  });
  document.querySelector("[data-platforms]").addEventListener("click", (event) => {
    const btn = event.target.closest("[data-platform]");
    if (!btn) return;
    markPlatform(document, btn.dataset.platform);
    if (!urlInput.value.trim()) urlInput.placeholder = placeholderFor(btn.dataset.platform);
  });
  urlInput.addEventListener("input", () => {
    markPlatform(document, platformFromUrl(urlInput.value));
  });
  board.addEventListener("click", async (event) => {
    const btn = event.target.closest("[data-copy]");
    if (!btn) return;
    const text = currentPrompt();
    if (!text) return;
    try {
      await copyText(text);
      btn.textContent = dict()["board.copied"];
    } catch {
      const area = board.querySelector("[data-prompt-text]");
      if (!area) return;
      const range = document.createRange();
      range.selectNodeContents(area);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });
  document.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-lang-btn]");
    if (!btn) return;
    localStorage.setItem(STORAGE_KEY, btn.dataset.langBtn === "en" ? "en" : "ko");
    fillChrome(dict());
    paint(board, currentPrompt());
  });
}
