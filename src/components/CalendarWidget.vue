<script setup lang="ts">
import { ref, computed } from "vue";
import Modal from "@/components/Modal.vue";
import dayjs, { Dayjs } from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import Calendar from "@/components/Calendar.vue";
import Km from "@/locale/km";
import type { AttributeType } from "@/components/Calendar.vue";
import { DocumentDuplicateIcon } from "@heroicons/vue/24/outline";
import useEventCalendar from "@/composables/useEventCalendar";
import type { DaysType } from "@/composables/useCalendar";
import { useChineseEvents } from "@/composables/useChineseEvents";
import { clipboard } from "electron";
dayjs.extend(localizedFormat);

const { getEvents, getChineseNewYear, getPureBrightnessFestival } =
  useChineseEvents();

const { fixedEvent, traditionalEvents } = useEventCalendar();

const currentMonth = ref(dayjs().month() + 1);
const currentYear = ref(dayjs().year());
const holidays = ref([]);

const attributes = ref<AttributeType[]>([]);
const attrsComputed = computed<AttributeType[]>(() =>
  // remove duplicate
  attributes.value.filter(
    (item, index, self) => index === self.findIndex((t) => t.key === item.key),
  ),
);
const openModal = ref(false);
const showKhDate = ref<{
  date?: Dayjs;
  khDate?: string;
}>({});
const showHolidaysClick = ref<AttributeType[]>([]);
const onDayClick = (dateObject: Dayjs) => {
  const date = dayjs(dateObject);
  showKhDate.value = {
    date: date,
    khDate: date.toKhmerDate(),
  };
  showHolidaysClick.value = attrsComputed.value.filter((item) => {
    return item.dates.isSame(date, "day");
  });
  openModal.value = true;
};

const onUpdateFromPage = async (
  e: {
    month: number;
    year: number;
  }[],
  days: DaysType[],
  current: {
    month: number;
    year: number;
  },
) => {
  currentMonth.value = current.month;
  currentYear.value = current.year;
  // reset attributes
  attributes.value = [];
  holidays.value = [];
  // fixed event
  fixedEvent.forEach((item) => {
    if (item.start_date.month === currentMonth.value) {
      attributes.value.push({
        key: `${currentYear.value}-${currentMonth.value}-${item.start_date.day}-${item.label.kh}`,
        dates: dayjs(
          `${currentYear.value}-${currentMonth.value}-${item.start_date.day}`,
        ),
        highlight: item.type === "holiday" ? "red" : "green",
        popover: {
          label: item.label.kh,
        },
      });
    }
  });

  // traditional event
  let tradEvents = [];
  days.forEach((day) => {
    const tradEvent = traditionalEvents
      .filter(
        (item) =>
          day.date.toKhmerDate("dN") === item.start_date.day &&
          day.date.toKhmerDate("m") === item.start_date.month,
      )
      ?.map((item) => {
        return {
          key: `${day.date.format()}-${item.start_date.day}`,
          dates: day.date,
          highlight: item.type !== "holiday" ? "blue" : "red",
          popover: {
            label: item.label.kh,
          },
        };
      });
    if (tradEvent.length) {
      tradEvents = [...tradEvents, ...tradEvent];
    }
  });

  const chineseEvents = [
    ...getChineseNewYear(currentYear.value),
    ...getPureBrightnessFestival(currentYear.value),
    ...getEvents(days),
  ];

  attributes.value = [...attributes.value, ...tradEvents, ...chineseEvents];
};

const currentMonthEventComputed = computed(() => {
  return attrsComputed.value
    .filter((item) => {
      return item.dates.isSame(
        dayjs(`${currentYear.value}-${currentMonth.value}-01`),
        "month",
      );
    })
    .sort((a, b) => {
      return a.dates.isBefore(b.dates) ? -1 : 1;
    });
});

const currentDateComputed = computed(() => {
  return dayjs(`${currentYear.value}-${currentMonth.value}-01`);
});

const onCopyKhDate = (text: string) => {
  clipboard.writeText(text);
  alert("ចម្លងបានជោគជ័យ");
};
</script>

<template>
  <div class="@container/cal">
    <div
      class="flex flex-col @4xl/cal:flex-row items-start justify-center gap-2 @4xl/cal:gap-4"
    >
      <div class="w-full @4xl/cal:w-2/3 shrink-0">
        <Calendar
          :attributes="attrsComputed"
          @day-click="onDayClick"
          @update:page="onUpdateFromPage"
        />
      </div>
      <div class="w-full @4xl/cal:w-1/3 shrink-0">
        <div class="rounded-xl bg-base-100 shadow">
          <h1
            class="px-2 pt-2 font-limon-r1 text-lg @2xl/cal:text-2xl text-brand-800"
          >
            {{ currentDateComputed.toKhmerDate("ឆ្នាំa ព.ស. b, គ.ស. c") }}
          </h1>
          <h2 class="p-2 border-b text-base @2xl/cal:text-xl text-brand-800">
            បុណ្យ ឬ​​ព្រឹត្តិការណ៍ សម្រាប់ខែ
            {{ currentDateComputed.locale(Km).format("MMMM") }}:
          </h2>
          <div v-if="!!currentMonthEventComputed.length" class="p-4">
            <ol class="relative border-l border-gray-200">
              <li
                v-for="(item, index) in currentMonthEventComputed"
                :key="index"
                :class="[
                  'ml-4 mt-4 cursor-pointer',
                  typeof item.highlight === 'string'
                    ? `text-${item.highlight}-600`
                    : `text-blue-700`,
                ]"
              >
                <div
                  class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white"
                ></div>
                <time class="mb-1 text-sm font-normal leading-none opacity-70">
                  {{ dayjs(item.dates).locale(Km).format("LL") }}
                  -
                  {{ dayjs(item.dates).format("LL") }}
                </time>
                <h3 class="text-lg font-limon-r1">
                  {{ item.popover?.label }}
                </h3>
              </li>
            </ol>
          </div>
          <div v-else>
            <div class="p-4">
              <div class="text-center">
                <div class="text-2xl font-bold">No Event</div>
                <div class="text-sm opacity-70">
                  There is no event for this month.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Modal
    max-width="max-w-xl"
    :open="openModal"
    :show-save-button="false"
    @close-modal="
      () => {
        openModal = false;
      }
    "
  >
    <h2 class="mb-3 font-bold text-xl">
      {{ showKhDate.date.format("LL") }}
    </h2>
    <ul class="list-outside pl-4 list-disc text-lg">
      <li>
        <div class="flex gap-1 items-center">
          {{ showKhDate.khDate }}
          <button
            type="button"
            class="btn btn-sm"
            @click="onCopyKhDate(showKhDate.khDate)"
          >
            <DocumentDuplicateIcon class="w-5 h-5" />
          </button>
        </div>
      </li>

      <li
        v-for="item in showHolidaysClick"
        :key="item.key"
        :class="
          typeof item.highlight === 'string'
            ? `text-${item.highlight}-600`
            : `text-blue-700`
        "
      >
        {{ item.popover?.label }}
      </li>
    </ul>
  </Modal>
</template>
