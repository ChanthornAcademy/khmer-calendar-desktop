<script setup>
import { computed, onMounted, ref } from "vue";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";

const props = defineProps({
  open: Boolean,
  title: String,
  maxWidth: String,
  showCloseButton: {
    default: true,
    type: Boolean,
  },
  showSaveButton: {
    default: true,
    type: Boolean,
  },
  isCentered: {
    default: false,
    type: Boolean,
  },
  isAutoFocus: {
    default: true,
    type: Boolean,
  },
  isEscdisabled: {
    default: false,
    type: Boolean,
  },
});
// !! covert value to boolean
const isOpen = computed(() => !!props.open);

const emit = defineEmits(["closeModal", "onSave"]);
const completeButtonRef = ref(null);
onMounted(() => {
  // disable esc key on modal
  if (props.isEscdisabled) {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
      }
    });
  }
});

const closeModal = () => {
  if (props.isEscdisabled) {
    return;
  }
  emit("closeModal");
};
</script>

<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog
      as="div"
      @close="closeModal"
      class="relative z-50"
      :initialFocus="completeButtonRef"
    >
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm print:hidden"
        />
      </TransitionChild>

      <div
        class="fixed w-full h-full inset-0 overflow-y-auto print:overflow-x-hidden p-1 md:p-4 mx-auto"
      >
        <div
          class="min-h-full p-4 flex print:p-0 print:m-0"
          :class="[isCentered ? 'items-center' : 'items-start']"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              :class="maxWidth ?? 'max-w-none '"
              class="w-full transform rounded-2xl bg-base-100 p-2 text-left shadow transition-all mx-auto"
            >
              <DialogTitle
                v-if="title"
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 print:hidden"
              >
                {{ title }}
              </DialogTitle>
              <div class="p-2">
                <slot />
              </div>

              <div class="mt-4 flex justify-end gap-2 print:hidden">
                <button
                  v-if="showCloseButton"
                  type="button"
                  class="btn btn-warning"
                  @click="closeModal"
                >
                  Close
                </button>
                <button
                  v-if="showSaveButton"
                  type="button"
                  class="btn btn-primary"
                  @click="$emit('onSave')"
                >
                  Save
                </button>
                <button
                  v-if="!isAutoFocus"
                  class="sr-only"
                  @click.prevent="() => {}"
                  ref="completeButtonRef"
                ></button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
