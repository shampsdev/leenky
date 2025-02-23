<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useBackButton } from 'vue-tg';
import { animate } from 'motion';
import { ref, onMounted } from 'vue';
const backButton = useBackButton();
if (backButton?.hide) {
  backButton.hide();
}
const router = useRouter();
const goToSecondPage = () => {
  router.push('/about/2');
};

const isLoadedAnimation = ref(false);

const animateScreenEntry = () => {
  animate(
    '.screen-container',
    {
      opacity: [0, 1],
      scale: [0.9, 1],
    },
    {
      ease: 'circInOut',
      duration: 0.5,
    }
  );
};

const isLoaded = ref(false);

onMounted(() => {
  const img = new Image();
  img.src = '/src/assets/about1.png';
  img.onload = () => {
    isLoaded.value = true;
  };
  animateScreenEntry();
  isLoaded.value = true;
});
</script>
<template>
  <div
    class="screen-container"
    name="fade"
    @before-enter="animateScreenEntry"
    @enter="animateScreenEntry"
  >
    <transition>
      <div>
        <div
          class="flex flex-col items-center justify-center text-center h-[95vh] max-w-[90%] mx-auto overflow-auto"
        >
          <div class="w-full max-w-[320px] flex items-center justify-center rounded-lg mt-[20px]">
            <img src="/src/assets/things.png" alt="About" />
          </div>

          <div class="mt-6" v-if="isLoaded">
            <p class="text-[20px] mt-2 text-main font-semibold">
              Расширяйте круг полезных знакомств
            </p>
          </div>
        </div>

        <div
          class="flex w-[100vw] h-[100px] absolute right-0 bottom-0 left-0 text-center items-center justify-center"
        >
          <button
            class="px-[30px] py-[12px] z-10 bg-[#20C86E] rounded-[30px] text-white font-semibold"
            @click="goToSecondPage"
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
  overflow-y: auto; /* Позволяет прокручивать содержимое только по вертикали */
  height: 100vh; /* Устанавливает высоту контейнера на 100% высоты экрана */
}
</style>
