export function selectedGoalValue() {
  return document.querySelector("[data-goal-select]")?.value ?? "";
}

export function fillConsult({ goalValue }) {
  const goalField = document.querySelector("[data-goal-field]");
  if (goalField && goalValue) goalField.value = goalValue;
  document.querySelector("#register")?.scrollIntoView({ behavior: "smooth" });
}

export function initConsult() {
  const button = document.querySelector("[data-consult-btn]");
  if (!button) return;

  button.addEventListener("click", () => {
    fillConsult({ goalValue: selectedGoalValue() });
  });
}
