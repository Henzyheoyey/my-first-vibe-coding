import { analysisItems } from "./analysis-items.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function itemCard(item, index) {
  const card = el("article", "tech-card");
  const head = el("div", "tech-head");
  head.append(
    el("span", "tech-num", String(index + 1)),
    el("h3", "", item.title),
    el("span", "tech-tag", item.tag),
  );
  card.append(head, el("p", "tech-body", item.ask));
  return card;
}

export function renderBoard(board, { prompt, lang, labels }) {
  const items = analysisItems(lang);
  const list = el("div", "item-grid");
  items.forEach((item, index) => list.append(itemCard(item, index)));

  const promptCard = el("article", "prompt-card");
  const head = el("div", "prompt-head");
  head.append(el("h2", "", labels.promptTitle));
  const copyBtn = el("button", "copy-btn", labels.copy);
  copyBtn.type = "button";
  copyBtn.dataset.copy = "true";
  head.append(copyBtn);

  const body = el("pre", "prompt-text", prompt || labels.promptEmpty);
  body.dataset.promptText = "true";
  if (!prompt) copyBtn.hidden = true;

  promptCard.append(head, body);
  board.classList.toggle("is-empty", !prompt);
  board.replaceChildren(list, promptCard);
}
