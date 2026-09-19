import { t } from "../../shared/language.js";
import { loadBooked } from "../schedule/booked.js";
import { bindSlotPicker } from "../schedule/slot-picker.js";

const FORM_ENDPOINT = "https://formsubmit.co/ajax/henzy0625@gmail.com";
const CLASS_EMAIL = "henzy0625@gmail.com";

function selectedLabel(select) {
  if (!select?.value) return "";
  return select.options[select.selectedIndex]?.textContent ?? "";
}

function formValues(form) {
  const data = new FormData(form);
  return {
    name: String(data.get("name") ?? "").trim(),
    phone: String(data.get("phone") ?? "").trim(),
    email: String(data.get("email") ?? "").trim(),
    kakao: String(data.get("kakao") ?? "").trim(),
    contact: String(data.get("contact") ?? "email"),
    goal: selectedLabel(form.querySelector("[name=goal]")),
    timetable: String(data.get("timetable") ?? "").trim(),
    note: String(data.get("note") ?? "").trim(),
  };
}

function mailtoUrl(values) {
  const body = [
    `Name: ${values.name}`,
    `Phone: ${values.phone || "—"}`,
    `Email: ${values.email}`,
    `Kakao: ${values.kakao || "—"}`,
    `Contact via: ${values.contact}`,
    `Goal: ${values.goal || "—"}`,
    `Timetable: ${values.timetable || "—"}`,
    `Note: ${values.note || "—"}`,
  ].join("\n");

  const query = new URLSearchParams({
    subject: "Vibe coding class consult",
    body,
  });
  return `mailto:${CLASS_EMAIL}?${query.toString()}`;
}

async function sendApplication(values) {
  const response = await fetch(FORM_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      ...values,
      _subject: "Vibe coding class consult",
    }),
  });

  if (!response.ok) throw new Error("send failed");
}

function showMessage(form, status, text) {
  const box = form.querySelector("[data-form-status]");
  box.hidden = false;
  box.dataset.state = status;
  box.textContent = text;
}

export async function initRegister() {
  const form = document.querySelector("[data-register-form]");
  const scheduleRoot = form?.querySelector("[data-form-schedule]");
  if (!form) return;

  await loadBooked();

  const picker = scheduleRoot
    ? bindSlotPicker(scheduleRoot, {
        hint: scheduleRoot.querySelector("[data-schedule-hint]"),
        summary: scheduleRoot.querySelector("[data-slot-summary]"),
        onChange: (text) => {
          const field = form.querySelector("[data-timetable-field]");
          if (field) field.value = text;
        },
      })
    : null;

  const submit = form.querySelector("[type=submit]");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const values = formValues(form);
    submit.disabled = true;
    submit.textContent = t("register.sending");

    try {
      await sendApplication(values);
      form.reset();
      picker?.reset();
      showMessage(form, "ok", t("register.success"));
    } catch {
      window.location.href = mailtoUrl(values);
      showMessage(form, "err", t("register.error"));
    }

    submit.disabled = false;
    submit.textContent = t("register.submit");
  });
}
