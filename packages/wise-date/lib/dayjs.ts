import dayjs from "dayjs";
import minMax from "dayjs/plugin/minMax.js";
import weekOfYear from "dayjs/plugin/weekOfYear.js";
import dayOfYear from "dayjs/plugin/dayOfYear.js";
import isToday from "dayjs/plugin/isToday.js";
import isTomorrow from "dayjs/plugin/isTomorrow.js";
import isYesterday from "dayjs/plugin/isYesterday.js";
dayjs.extend(minMax)
dayjs.extend(weekOfYear)
dayjs.extend(dayOfYear)
dayjs.extend(isToday)
dayjs.extend(isTomorrow)
dayjs.extend(isYesterday)
