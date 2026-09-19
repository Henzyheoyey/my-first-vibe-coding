export function selectedGoalValue() {
  return document.querySelector("[data-goal-select]")?.value ?? "";
}

export function fillConsult(fields) {
  const goalField = document.querySelector("[data-goal-field]");
  if (goalField && fields.goalValue) goalField.value = fields.goalValue;

  const formRoot = document.querySelector("[data-form-schedule]");
  if (fields.selection && formRoot?.slotPicker) {
    formRoot.slotPicker.applySelection(fields.selection);
  }

  document.querySelector("#register")?.scrollIntoView({ behavior: "smooth" });
}

export function initConsult() {
  const button = document.querySelector("[data-consult-btn]");
  if (!button) return;

  button.addEventListener("click", () => {
    fillConsult({ goalValue: selectedGoalValue() });
  });
}
