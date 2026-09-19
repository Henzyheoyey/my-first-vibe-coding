const STEPS = [
  { key: "progress.check", to: 18 },
  { key: "progress.script", to: 52 },
  { key: "progress.hook", to: 78 },
  { key: "progress.reuse", to: 94 },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function playProgress(root, dict) {
  const box = root.querySelector("[data-progress]");
  const label = root.querySelector("[data-progress-label]");
  const pct = root.querySelector("[data-progress-pct]");
  const bar = root.querySelector("[data-progress-bar]");
  box.hidden = false;
  let value = 0;

  for (const step of STEPS) {
    label.textContent = dict[step.key];
    while (value < step.to) {
      value += 2;
      pct.textContent = `${value}%`;
      bar.style.width = `${value}%`;
      await sleep(26);
    }
  }

  return function finishProgress() {
    pct.textContent = "100%";
    bar.style.width = "100%";
  };
}

export function hideProgress(root) {
  const box = root.querySelector("[data-progress]");
  const bar = root.querySelector("[data-progress-bar]");
  box.hidden = true;
  bar.style.width = "0%";
}
