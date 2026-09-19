import { initLanguage } from "../shared/language.js";
import { initRegister } from "../features/register/register.js";
import { initConsult } from "../features/consult/consult.js";
import { initSchedule } from "../features/schedule/schedule.js";
import { initScrollIn } from "../features/catch/scroll-in.js";

initLanguage();
initConsult();
initSchedule();
initRegister();
initScrollIn();
