// import json event

import fixedEvents from "@/json/fixed-event.json";
import traditionalEvent from "@/json/kh-traditional-event.json";

export interface FixedEventType {
  label: {
    kh: string;
    en: string;
  };
  type: string;
  start_date: {
    day: number;
    month: number;
  };
  valid: {
    from: string;
    to: string;
  };
}
export interface TraditionalEventType {
  label: {
    kh: string;
    en: string;
  };
  type: string;
  start_date: {
    day: string;
    month: string;
  };
  valid: {
    from: string;
    to: string;
  };
}
export default function useEventCalendar() {
  const fixedEvent = fixedEvents as FixedEventType[];
  const traditionalEvents = traditionalEvent as TraditionalEventType[];

  return {
    fixedEvent,
    traditionalEvents,
  };
}
