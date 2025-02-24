<script setup lang="ts">
import { useBackButton } from 'vue-tg';
import Button from '@/components/button.vue';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { animate } from 'motion';
import { handleImageError } from '@/utils/errorHandlers';
const router = useRouter();
const goToRegistration = () => {
  router.push('/registration');
};

const backButton = useBackButton();
if (backButton?.show) {
  backButton.show();
}
const isLoaded = ref(false);

const animateScreenEntry = () => {
  animate(
    '.screen-container',
    {
      opacity: [0, 1],
      scale: [0.9, 1],
    },
    {
      ease: 'circInOut',
      duration: 0.7,
    }
  );
};

onMounted(() => {
  animateScreenEntry();
  const img = new Image();
  img.src = '/src/assets/about2.png';
  img.onload = () => {
    isLoaded.value = true;
  };
  isLoaded.value = true;
});
</script>

<template>
  <div class="screen-container">
    <transition>
      <div>
        <div
          class="flex flex-col items-center justify-center text-center h-[95vh] max-w-[90%] mx-auto overflow-auto"
        >
          <div class="w-full max-w-[320px] flex items-center justify-center rounded-lg mt-[20px]">
            <img src="/src/assets/things2.png" @error="handleImageError" />
          </div>

          <div class="mt-6" v-if="isLoaded">
            <p class="mt-2 text-main text-[20px] font-semibold">
              Рассказывайте о себе и узнавайте больше о других участниках чата
            </p>
          </div>
        </div>

        <div
          class="flex w-[100vw] h-[100px] absolute right-0 bottom-0 left-0 text-center items-center justify-center"
        >
          <button
            class="px-[30px] py-[12px] z-10 bg-[#20C86E] rounded-[30px] text-white font-semibold"
            @click="goToRegistration"
          >
            Далее
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.screen-container {
  opacity: 0.5;
  overflow-y: auto;
  height: 100vh;
}
</style>
