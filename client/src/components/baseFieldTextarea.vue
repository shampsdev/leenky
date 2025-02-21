<script setup lang="ts">
import { ref, watch, nextTick, defineProps, defineEmits } from "vue";

const props = defineProps({
  legend: {
    type: String,
    default: "Поле",
  },
  modelValue: {
    type: String,
    default: "",
  },
  maxLines: {
    type: Number,
    default: 6,
  },
  maxLength: {
    type: Number,
    default: 230,
  },
  maxHeight: {
    type: Number,
    default: 200,
  },
});

const emits = defineEmits(["update:modelValue"]);

const textareaRef = ref<HTMLTextAreaElement | null>(null);

/**
 * Авто-ресайз
 */
function autoResize() {
  if (!textareaRef.value) return;
  textareaRef.value.style.height = "auto";
  textareaRef.value.style.height = Math.min(textareaRef.value.scrollHeight, props.maxHeight) + "px";
}

/**
 * Ограничиваем кол-во переносов
 */
function limitNewlines(event: KeyboardEvent) {
  if (event.key === "Enter") {
    const currentNewlineCount = (props.modelValue.match(/\n/g) || []).length;
    if (currentNewlineCount >= props.maxLines) {
      event.preventDefault();
    }
  }
}

watch(
  () => props.modelValue,
  async () => {
    await nextTick();
    autoResize();
  }
);

/**
 * Эмитим новое значение вверх
 */
function onInput(event: Event) {
  const target = event.target as HTMLTextAreaElement;
  emits("update:modelValue", target.value);
}
</script>

<template>
  <fieldset
    class="border-2 rounded-xl p-3 relative border-gray-300 focus-within:border-[#007aff] focus-within:text-[#007aff] transition-all duration-100 text-gray-400"
  >
    <legend class="px-2 text-sm">
      {{ props.legend }}
    </legend>

    <textarea
      ref="textareaRef"
      class="resize-none w-full outline-none text-main px-[16px]"
      :maxlength="props.maxLength"
      rows="1"
      :value="props.modelValue"
      @keydown="limitNewlines"
      @input="onInput"
    ></textarea>
  </fieldset>
</template>
