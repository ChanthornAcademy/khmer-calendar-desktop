<script setup lang="ts">
import { useCalendar } from "@/composables/useCalendar";
import dayjs from "dayjs";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/solid";
import useKhDate from "@/composables/useKhDate";
import { onMounted, computed, watch, type PropType, ref } from "vue";
import type { DaysType } from "@/composables/useCalendar";
import Popper from "vue3-popper";
import { twMerge } from "tailwind-merge";
// import debounce from "lodash/debounce";

export interface AttributeType {
  key: string;
  dates: dayjs.Dayjs;
  highlight?: boolean | string;
  popover?: {
    label: string;
  };
}

const props = defineProps({
  attributes: {
    type: Object as PropType<AttributeType[]>,
    required: false,
  },
});

const emits = defineEmits(["update:page", "dayClick", "update:holyDayAttrs"]);

const { khDate } = useKhDate();
const {
  days,
  currentMonth,
  currentYear,
  daysOfWeek,
  nextMonth,
  prevMonth,
  isLastRow,
  currentKhmerMonts,
} = useCalendar();

const attrs = ref<AttributeType[]>([
  {
    key: "today",
    highlight: true,
    dates: dayjs(),
  },
]);

const filterHolydaysComputed = computed(() => {
  return days.value
    .filter((item) => item.isBuddhistHolyDay)
    .map((item) => {
      return {
        key: `${item.date.format("YYYY-MM-DD")}-buddhist-holyday`,
        dates: item.date,
        highlight: false,
        popover: {
          label: "ថ្ងៃសីល",
        },
      };
    });
});

const attributesComputed = computed<AttributeType[]>(() => {
  const attrsComputed = props.attributes
    ? [...props.attributes, ...attrs.value, ...filterHolydaysComputed.value]
    : attrs.value;

  return attrsComputed.filter((item, index, self) => {
    return index === self.findIndex((t) => t.key === item.key);
  });
});

// get unique year and month from days
const uniqueYearMonthComputed = computed(() =>
  days.value
    .filter((item, index, self) => {
      return (
        index ===
        self.findIndex(
          (t) =>
            t.date.month() === item.date.month() &&
            t.date.year() === item.date.year(),
        )
      );
    })
    .map((item) => {
      return {
        month: item.date.month() + 1,
        year: item.date.year(),
      };
    }),
);

const dayClick = (day: DaysType) => {
  emits("dayClick", day.date);
};

const onEmitUpdatePage = () => {
  const current = {
    month: currentMonth.value + 1,
    year: currentYear.value,
  };
  emits("update:page", uniqueYearMonthComputed.value, days.value, current);
};

// wach for changes in currentMonth and currentYear
watch(uniqueYearMonthComputed, () => {
  // emit event to parent component
  onEmitUpdatePage();
});

watch(filterHolydaysComputed, () => {
  // emit attributes to parent component
  emits("update:holyDayAttrs", filterHolydaysComputed.value);
});

// filter attributes
const attributesFiltered = (date: dayjs.Dayjs): AttributeType[] => {
  return attributesComputed.value.filter((item) => {
    return dayjs(item.dates).isSame(date, "days");
  });
};

onMounted(() => {
  // emit event to parent component
  onEmitUpdatePage();
  // emit attributes to parent component
  emits("update:holyDayAttrs", filterHolydaysComputed.value);
});
</script>

<template>
  <div class="@container">
    <div
      class="border-4 border-brand-900 rounded-xl w-full bg-base-100 relative"
    >
      <!-- top section -->
      <div
        class="pb-2 flex items-center justify-between pt-3 px-1 bg-brand-800 text-white dark:bg-brand-900 dark:text-white"
      >
        <div class="flex shrink-0 gap-2 items-center w-1/4">
          <button type="button" class="" @click="prevMonth">
            <ChevronLeftIcon class="h-6 w-6 text-primary-500" />
          </button>
          <div
            class="text-xs @lg:text-sm @xl:text-xl @3xl:text-3xl font-limon-r1"
          >
            {{ khDate().month(currentMonth).format("MMMM") }}
          </div>
        </div>
        <div vi class="w-1/2">
          <div
            class="text-xs @lg:text-sm @xl:text-base @2xl:text-2xl @4xl:text-3xl text-center font-moulpali"
          >
            <div class="my-1">
              {{ currentKhmerMonts.join(" - ") }}
            </div>
          </div>
        </div>
        <div class="flex justify-end shrink-0 gap-2 items-center w-1/4">
          <div class="text-xs @lg:text-sm @xl:text-xl @3xl:text-3xl">
            {{ dayjs().month(currentMonth).format("MMMM") }}
          </div>
          <button type="button" class="" @click="nextMonth">
            <ChevronRightIcon class="h-6 w-6 text-primary-500" />
          </button>
        </div>
      </div>
      <!-- day section -->
      <div>
        <!-- day of the weeks -->
        <div
          class="bg-bush-700 text-white dark:bg-bush-800 dark:text-white font-limon-r1"
        >
          <div class="grid grid-cols-7 border-t-2 border-brand-900">
            <template v-for="(day, index) in daysOfWeek" :key="day.en">
              <div
                class="text-center py-2 text-xs @lg:text-base @xl:text-lg @2xl:text-xl @4xl:text-2xl"
                :class="[
                  index !== 6 ? 'border-r-2 border-brand-900' : '',
                  index === 0 ? 'bg-red-700 dark:bg-red-900' : '',
                ]"
              >
                <div>
                  {{ day.kh }}
                </div>
                <div>
                  {{ day.en.substring(0, 3) }}
                </div>
              </div>
            </template>
          </div>
        </div>
        <!-- days -->
        <div class="grid grid-cols-7 border-t-2 border-brand-900">
          <template v-for="(day, index) in days" :key="day.date">
            <button type="button" @click="dayClick(day)">
              <Popper class="!block z-50" hover arrow>
                <div
                  :class="
                    twMerge(
                      'relative',
                      'p-0.5 @4xl:p-2 transition-all duration-300 ease-in-out',
                      'hover:bg-brand-700 hover:text-white ',
                      // add border to the right if not last day of the week
                      day.date.get('d') !== 6
                        ? 'border-r-2 border-brand-900'
                        : '',
                      // check if the last row, each row has 7 days
                      !isLastRow(index) ? 'border-b-2 border-brand-900' : '',

                      attributesFiltered(day.date).map((item) =>
                        item.highlight === true &&
                        attributesFiltered(day.date).length === 1
                          ? 'text-white'
                          : typeof item.highlight === 'string'
                          ? `text-${item.highlight}-700 dark:text-${item.highlight}-100 hover:text-${item.highlight}-800 dark:text-${item.highlight}-100 dark:hover:text-${item.highlight}-100`
                          : '',
                      ),
                      day.date.get('d') === 0 ? 'text-red-500' : '',
                    )
                  "
                >
                  <div
                    class="absolute inset-0 flex items-center justify-center"
                  >
                    <template
                      v-for="attr in attributesFiltered(day.date)"
                      :key="attr.key"
                    >
                      <div
                        v-if="attr.highlight !== false"
                        :class="
                          twMerge(
                            'flex-auto h-full shrink-0 ',
                            isLastRow(index) && day.date.get('d') === 0
                              ? 'rounded-bl-lg'
                              : isLastRow(index) && day.date.get('d') === 6
                              ? 'rounded-br-lg'
                              : '',
                            attr.highlight === true
                              ? 'bg-brand-600 text-white dark:bg-brand-900'
                              : `bg-${attr.highlight}-100 text-${attr.highlight}-700 hover:bg-${attr.highlight}-400  dark:bg-${attr.highlight}-900  dark:hover:bg-${attr.highlight}-700 `,
                          )
                        "
                      ></div>
                    </template>
                  </div>
                  <div
                    :class="[
                      'relative',
                      'w-full flex flex-col items-center justify-center gap-0.5 @3xl:flex-row @3xl:items-start @3xl:justify-between',
                      day.isPrevMonth || day.isNextMonth ? 'opacity-25' : '',
                    ]"
                  >
                    <div
                      class="text-left font-bold text-base @lg:text-xl @2xl:text-2xl @5xl:text-5xl"
                    >
                      <div class="flex items-center">
                        <div class="mr-0.5 shrink-0">
                          {{ day.day }}
                        </div>
                        <div v-if="day.isBuddhistHolyDay" class="shrink-0">
                          <img
                            src="@/assets/images/buddha-icon.webp"
                            class="w-3 @lg:w-4 @3xl:w-5"
                          />
                        </div>
                      </div>
                    </div>
                    <!-- Khmer Date -->
                    <!-- md:text-right text-[0.60rem] sm:text-xs md:text-base lg:text-lg xl:text-xl -->
                    <div
                      class="text-center text-[0.60rem] @md:text-sm @2xl:text-base @2xl:text-right @4xl:text-lg flex-1 leading-3"
                    >
                      <div
                        class="flex flex-row justify-center items-center @3xl:flex-col @3xl:items-end"
                      >
                        <div>{{ day.date.toKhmerDate("d") }}</div>
                        <div>{{ day.date.toKhmerDate("N") }}</div>
                      </div>
                      <div>
                        {{ day.date.toKhmerDate("m") }}
                      </div>
                    </div>
                  </div>
                </div>
                <template
                  v-if="
                    attributesFiltered(day.date).filter((item) => item.popover)
                      .length > 0
                  "
                  #content
                >
                  <div class="rounded-xl bg-base-100 border p-2 shadow -mt-3">
                    <div class="mb-2 font-bold">
                      {{ day.date.format("dddd, DD MMMM, YYYY") }}
                    </div>
                    <ul class="list-disc list-outside ml-4 text-left">
                      <li
                        v-for="item in attributesFiltered(day.date).filter(
                          (item) => item.popover,
                        )"
                        :key="item.key"
                        :class="
                          item.highlight
                            ? `text-${item.highlight}-700 dark:text-${item.highlight}-400`
                            : ``
                        "
                      >
                        {{ item.popover.label }}
                      </li>
                    </ul>
                  </div>
                </template>
              </Popper>
              <div></div>
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
