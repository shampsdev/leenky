<script setup lang="ts">
import { useRouter } from "vue-router";
import Button from "@/components/button.vue";
const router = useRouter();

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="flex flex-col w-full h-full items-center p-4">
    <button @click="goBack" class="self-start text-blue-500 mb-4">Back</button>
    <div class="flex flex-col items-center">
      <img
        class="w-28 h-28 rounded-full object-cover"
        src="/src/assets/chat_avatar_example.png"
        alt="User Avatar"
      />
      <p class="font-semibold text-[20px] mt-[17px]">mike</p>
      <p class="text-gray-500">@mikedegofroy</p>
    </div>

    <Button class="flex flex-row mt-[10px] items-center gap-[6px]">
      Написать <img class="w-4 h-4" src="/src/assets/tg_white.svg" alt="Telegram" />
    </Button>

    <div class="w-full max-w-md mt-6 p-4 rounded-lg">
      <h2 class="text-sm px-[16px] font-semibold mb-2">ABOUT</h2>
      <div class="bg-form px-[16px] rounded-[12px]">
        <div class="border-b py-[12px] border-tint">
          <p class="text-xs">Место работы</p>
          <p class="">@shamps.dev</p>
        </div>

        <div class="py-[12px] border-b border-tint">
          <p class="text-xs">Должность</p>
          <p class="">FullStack Developer</p>
        </div>

        <div class="py-2">
          <p class="text-xs">Описание</p>
          <p class="text-sm">
            Сейчас я Senior продуктовый дизайнер в умном доме с Алисой (Яндекс). До этого развивал
            магазин умных устройств Сбера (СберДевайсы). Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Facere ipsa et libero molestiae commodi quae aliquam optio eveniet
            voluptatum exercitationem. Dolorem expedita animi doloremque quisquam cum commodi
            voluptate eos repellat!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
