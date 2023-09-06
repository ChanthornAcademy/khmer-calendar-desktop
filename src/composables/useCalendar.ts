import { ref, computed } from "vue";
import dayjs from "dayjs";
import Km from "@/locale/km";
import toKhmerDate from "dayjskh";
import localeData from "dayjs/plugin/localeData";

dayjs.extend(localeData);
dayjs.extend(toKhmerDate);

export interface DaysType {
  isPrevMonth: boolean;
  isNextMonth: boolean;
  day: number;
  date: dayjs.Dayjs;
  // ថ្ងៃសីល
  isBuddhistHolyDay?: boolean;
}
export const useCalendar = () => {
  const date = dayjs();
  const days = ref<DaysType[]>([]);
  const currentMonth = ref<number>(dayjs(date).month());
  const currentYear = ref<number>(dayjs(date).year());
  const dayInMonth = ref<number>(dayjs(date).daysInMonth());

  const daysOfWeek = computed(() => {
    return dayjs.weekdays().map((day, index) => {
      return {
        en: day,
        kh: dayjs().locale(Km).localeData().weekdays()[index],
      };
    });
  });

  const isBuddhistHolyDay = (date: dayjs.Dayjs): boolean => {
    switch (date.toKhmerDate("dN")) {
      case "៨រោច":
      case "៨កើត":
      case "១៥កើត":
      case "១៥រោច":
        return true;
      case "១៤រោច":
        if (date.add(1, "day").toKhmerDate("dN") === "១កើត") {
          return true;
        }
        break;
      default:
        return false;
    }
    return false;
  };

  // init date

  const initDate = () => {
    let date = dayjs(`${currentYear.value}-${currentMonth.value + 1}-01`);
    dayInMonth.value = date.daysInMonth();
    let startDay = date.startOf("month").day();
    let endDay = date.endOf("month").day();
    let prevMonth = date.subtract(1, "month").daysInMonth();
    let daysArr = [];

    // prev month ex: 31, 30, 29, 28
    for (let i = startDay; i > 0; i--) {
      const current = date.subtract(i, "day");
      daysArr.push({
        isPrevMonth: true,
        isNextMonth: false,
        day: prevMonth - i + 1,
        date: current,
        isBuddhistHolyDay: isBuddhistHolyDay(current),
      });
    }

    // current month
    for (let i = 1; i <= dayInMonth.value; i++) {
      const date = dayjs(`${currentYear.value}-${currentMonth.value + 1}-${i}`);
      daysArr.push({
        isPrevMonth: false,
        isNextMonth: false,
        day: i,
        date: date,
        isBuddhistHolyDay: isBuddhistHolyDay(date),
      });
    }
    // next month
    for (let i = 0; i < 6 - endDay; i++) {
      const currentNext = dayjs(
        `${currentYear.value}-${currentMonth.value + 2}-01`,
      ).add(i, "day");
      daysArr.push({
        isPrevMonth: false,
        isNextMonth: true,
        day: i + 1,
        date: currentNext,
        isBuddhistHolyDay: isBuddhistHolyDay(currentNext),
      });
    }
    days.value = daysArr;
  };

  initDate();

  const currentKhmerMonts = computed<string[]>(() => {
    const months = days.value
      .filter((day) => !day.isPrevMonth && !day.isNextMonth)
      .map((day) => day.date.toKhmerDate("m"));
    return [...new Set(months)];
  });

  const nextMonth = () => {
    if (currentMonth.value === 11) {
      currentMonth.value = 0;
      currentYear.value += 1;
    } else {
      currentMonth.value += 1;
    }
    initDate();
  };

  const prevMonth = () => {
    if (currentMonth.value === 0) {
      currentMonth.value = 11;
      currentYear.value -= 1;
    } else {
      currentMonth.value -= 1;
    }
    initDate();
  };

  // 1 row 7 days
  // check the last row
  const isLastRow = (index: number) => {
    return index >= days.value.length - 7;
  };
  return {
    days,
    currentMonth,
    currentYear,
    dayInMonth,
    daysOfWeek,
    nextMonth,
    prevMonth,
    isLastRow,
    currentKhmerMonts,
  };
};
