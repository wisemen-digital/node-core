import minMax from 'dayjs/plugin/minMax';
import dayjs from "dayjs";
import objectSupport from 'dayjs/plugin/objectSupport';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import isYesterday from 'dayjs/plugin/isYesterday';


dayjs.extend(minMax)
dayjs.extend(objectSupport)
dayjs.extend(weekOfYear)
dayjs.extend(dayOfYear)
dayjs.extend(isToday)
dayjs.extend(isTomorrow)
dayjs.extend(isYesterday)
