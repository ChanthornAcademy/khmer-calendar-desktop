import dayjs from "dayjs";
import km from "@/locale/km";
import relativeTime from "dayjs/plugin/relativeTime";
import preParsePostFormat from "dayjs/plugin/preParsePostFormat";
import updateLocale from "dayjs/plugin/updateLocale";
import toKhmerDate from "dayjskh";

dayjs.extend(updateLocale);
dayjs.extend(relativeTime);
dayjs.extend(preParsePostFormat);
dayjs.extend(toKhmerDate);

export default function useKhDate() {
  const Km = km;
  const khDate = (date?): dayjs.Dayjs => {
    return date ? dayjs(date).locale(Km) : dayjs().locale(Km);
  };

  return { khDate };
}
