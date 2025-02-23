<script setup lang="ts">
import { useBackButton } from 'vue-tg';
import Button from '@/components/button.vue';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
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

const handleImageLoad = () => {
  isLoaded.value = true;
};

onMounted(() => {
  const img = new Image();
  img.src = '/src/assets/about.png';
  img.onload = () => {
    isLoaded.value = true;
  };
});
</script>

<template>
  <div
    v-if="isLoaded"
    class="flex flex-col items-center justify-center text-center max-w-[90%] mx-auto max-h-[90vh] overflow-auto"
  >
    <div
      class="w-full max-w-[320px] bg-gray-200 flex items-center justify-center rounded-lg mt-[20px]"
    >
      <img src="/src/assets/about.png" class="" @load="handleImageLoad" />
    </div>

    <div class="mt-6">
      <h1 class="text-2xl font-bold">Какой-то крутой заголовок</h1>
      <p class="text-lg mt-2 text-gray-600">
        И объяснение почему это приложение мегааа крутое полезное. Настя напишет что-то невероятное.
      </p>
    </div>
  </div>
  <div class="w-full fixed bottom-0">
    <Button
      @click="goToRegistration"
      class="fixed bottom-5 left-1/2 -translate-x-1/2 bg-green-500 text-white text-lg font-semibold py-3 px-6 rounded-full shadow-md hover:bg-green-600 transition"
    >
      Зарегистрироваться
    </Button>
  </div>
</template>
