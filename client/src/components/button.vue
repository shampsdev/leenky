<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'button',
  },
  variant: {
    type: String,
    default: 'primary', // "primary", "secondary"
  },
  classes: {
    type: String,
    default: '',
  },
});

const buttonClasses = computed(() => {
  const base = 'rounded-[20px] py-[10px] px-[14px] transition duration-200';
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn ',
    about: 'bg-green',
  };

  return `${base} ${variants[props.variant]} `;
});
</script>

<template>
  <button :type="type" :class="buttonClasses">
    <slot />
  </button>
</template>
