// Cambodian [km]
import dayjs from "dayjs";

const symbolMap = {
  1: "១",
  2: "២",
  3: "៣",
  4: "៤",
  5: "៥",
  6: "៦",
  7: "៧",
  8: "៨",
  9: "៩",
  0: "០",
};
const numberMap = {
  "១": "1",
  "២": "2",
  "៣": "3",
  "៤": "4",
  "៥": "5",
  "៦": "6",
  "៧": "7",
  "៨": "8",
  "៩": "9",
  "០": "0",
};

const locale = {
  name: "km",
  weekdays: "អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),
  months:
    "មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split(
      "_",
    ),
  weekStart: 1,
  weekdaysShort: "អា_ច_អ_ព_ព្រ_សុ_ស".split("_"),
  monthsShort:
    "មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split(
      "_",
    ),
  weekdaysMin: "អា_ច_អ_ព_ព្រ_សុ_ស".split("_"),
  ordinal: (n) => n,
  formats: {
    LT: "HH:mm",
    LTS: "HH:mm:ss",
    L: "DD/MM/YYYY",
    LL: "D MMMM YYYY",
    LLL: "D MMMM YYYY HH:mm",
    LLLL: "dddd, D MMMM YYYY HH:mm",
  },
  relativeTime: {
    future: "%sទៀត",
    past: "%sមុន",
    s: "ប៉ុន្មានវិនាទី",
    m: "១ នាទី",
    mm: "%d នាទី",
    h: "១ ម៉ោង",
    hh: "%d ម៉ោង",
    d: "១ ថ្ងៃ",
    dd: "%d ថ្ងៃ",
    M: "១ ខែ",
    MM: "%d ខែ",
    y: "១ ឆ្នាំ",
    yy: "%d ឆ្នាំ",
  },
  preparse: function (string) {
    return string.replace(/[១២៣៤៥៦៧៨៩០]/g, function (match) {
      return numberMap[match];
    });
  },
  postformat: function (string) {
    return string.replace(/\d/g, function (match) {
      return symbolMap[match];
    });
  },
  meridiem: function (hour, minute, isLower) {
    if (hour < 12) {
      return "ព្រឹក";
    } else {
      return "ល្ងាច";
    }
  },
};

dayjs.locale(locale, null, true);

export default locale;
