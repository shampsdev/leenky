<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const chats = ref([
  {
    id: 1,
    name: "DishDash – Шампиньоны",
    members: 10,
    avatar: "/src/assets/chat_avatar_example.png",
  },
  {
    id: 2,
    name: "Шампиньоны (мини) хакатон",
    members: 7,
    avatar: "/src/assets/chat_avatar_example.png",
  },
  {
    id: 3,
    name: "Стартап-Чердак",
    members: 47,
    avatar: "/src/assets/chat_avatar_example.png",
  },
]);
const router = useRouter();
const goToChat = () => {
  router.push("/chat/1");
};
</script>

<template>
  <div class="max-w-[95%] mx-auto px-4">
    <header class="flex items-center justify-between py-4">
      <h1 class="text-xl font-semibold">Чаты</h1>
    </header>

    <div class="relative flex items-center bg-gray-100 rounded-lg px-3 py-2 mb-4">
      <input
        type="text"
        placeholder="Search"
        class="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
      />
      <button>
        <img src="/src/assets/Search.svg" alt="mic" class="w-5 h-5" />
      </button>
    </div>

    <ul class="divide-y divide-gray-200">
      <li
        v-for="chat in chats"
        :key="chat.id"
        class="flex items-center py-3 cursor-pointer"
        @click="goToChat"
      >
        <img :src="chat.avatar" alt="Avatar" class="w-12 h-12 rounded-full object-cover mr-4" />

        <div class="flex-1">
          <p class="font-medium">{{ chat.name }}</p>
          <p class="text-sm text-gray-500">{{ chat.members }} участников</p>
        </div>

        <div class="text-gray-400 text-xl">›</div>
      </li>
    </ul>
  </div>
</template>
