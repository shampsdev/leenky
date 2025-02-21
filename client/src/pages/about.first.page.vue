<script setup lang="ts">
import Button from "@/components/button.vue";
import { useRouter } from "vue-router";
import { useBackButton } from "vue-tg";

const backButton = useBackButton();
if (backButton?.hide) {
  backButton.hide();
}
const router = useRouter();
const goToSecondPage = () => {
  router.push("/about/2");
};
</script>
<template>
  <div
    class="flex flex-col items-center justify-center text-center max-w-[90%] mx-auto max-h-[90vh] overflow-auto"
  >
    <div
      class="w-full max-w-[320px] bg-gray-200 flex items-center justify-center rounded-lg mt-[20px]"
    >
      <img src="/src/assets/about.png" alt="About" class="" />
    </div>

    <div class="mt-6">
      <h1 class="text-2xl font-bold">TgLinked</h1>
      <p class="text-lg mt-2 text-gray-600">
        Упрощение взаимодействия и обмен контактной информацией между участниками чата
      </p>
    </div>
  </div>
  <div class="w-full fixed bottom-0">
    <Button
      @click="goToSecondPage"
      class="fixed bottom-5 left-1/2 -translate-x-1/2 bg-green-500 text-white text-lg font-semibold py-3 px-6 rounded-full shadow-md hover:bg-green-600 transition"
    >
      Далее
    </Button>
  </div>
</template>
