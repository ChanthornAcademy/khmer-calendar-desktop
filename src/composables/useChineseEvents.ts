import dayjs from "dayjs";
import { CalendarChinese } from "date-chinese";
import objectSupport from "dayjs/plugin/objectSupport";
import type { FixedEventType } from "@/composables/useEventCalendar";
import type { DaysType } from "@/composables/useCalendar";
import type { AttributeType } from "@/components/Calendar.vue";
dayjs.extend(objectSupport);
export const useChineseEvents = () => {
  // https://www.prokerala.com/general/calendar/chinesecalendar.php
  const events = <FixedEventType[]>[
    {
      label: {
        kh: "សែន​ដក​ជើង​ធូក",
        en: "",
      },
      type: "chinese-event",
      start_date: {
        day: 24,
        month: 12,
      },
      valid: {
        from: "",
        to: "",
      },
    },
    {
      label: {
        kh: "សែន​ក្បាលទឹក",
        en: "",
      },
      type: "chinese-event",
      start_date: {
        day: 15,
        month: 7,
      },
      valid: {
        from: "",
        to: "",
      },
    },
    {
      label: {
        kh: "សែន​លោកខែ",
        en: "Mid Autumn Festival",
      },
      type: "chinese-event",
      start_date: {
        day: 15,
        month: 8,
      },
      valid: {
        from: "",
        to: "",
      },
    },
  ];

  console.log();

  const cal = new CalendarChinese();

  const getChineseNewYear = (
    year: number = dayjs().year(),
  ): AttributeType[] => {
    const newYear = cal.newYear(year);
    cal.fromJDE(newYear);
    const date = cal.toGregorian();
    const newYearDate = dayjs({
      year: date.year,
      month: date.month - 1,
      day: date.day,
    });
    return [
      {
        key: `${newYearDate.format()}-1`,
        dates: newYearDate.subtract(1, "day"),
        highlight: "purple",
        popover: {
          label: "ថ្ងៃសែនចូលឆ្នាំ​ចិន",
        },
      },
      {
        key: `${newYearDate.format()}-2`,
        dates: newYearDate,
        highlight: "purple",
        popover: {
          label: "ថ្ងៃចូលឆ្នាំ​ចិន",
        },
      },
      {
        key: `${newYearDate.format()}-3`,
        dates: newYearDate.add(1, "day"),
        highlight: "purple",
        popover: {
          label: "ថ្ងៃចូលឆ្នាំ​ចិន",
        },
      },
      {
        key: `${newYearDate.format()}-4`,
        dates: newYearDate.add(2, "day"),
        highlight: "purple",
        popover: {
          label: "ថ្ងៃចូលឆ្នាំ​ចិន",
        },
      },
    ];
  };

  // find Pure brightness festival date | Ching Ming Festival , ឆេងម៉េង​(ប្រក់​ផ្នូរ)
  const getPureBrightnessFestival = (
    year: number = dayjs().year(),
  ): AttributeType[] => {
    let qm = cal.qingming(year);
    cal.fromJDE(qm);
    const date = cal.toGregorian();
    const gdate = dayjs({
      year: date.year,
      month: date.month - 1,
      day: date.day,
    });
    return [
      {
        key: `${gdate.format()}-1`,
        dates: gdate,
        highlight: "purple",
        popover: {
          label: "ថ្ងៃឆេងម៉េង​(ប្រក់​ផ្នូរ)",
        },
      },
    ];
  };

  const getEvents = (days: DaysType[]): AttributeType[] => {
    let chineseTradEvents = [];
    days.forEach((item) => {
      const { month, day } = cal.fromGregorian(
        item.date.year(),
        item.date.month() + 1,
        item.date.date(),
      );

      const chineseTradEvent = events
        .filter((event) => {
          return (
            event.start_date.day === day && event.start_date.month === month
          );
        })
        ?.map((event) => {
          return {
            key: `${item.date.format()}-${event.start_date.day}`,
            dates: item.date,
            highlight: "purple",
            popover: {
              label: event.label.kh,
            },
          };
        });

      if (chineseTradEvent.length) {
        chineseTradEvents = [...chineseTradEvents, ...chineseTradEvent];
      }
    });
    return chineseTradEvents;
  };

  return {
    getEvents,
    getChineseNewYear,
    getPureBrightnessFestival,
  };
};
