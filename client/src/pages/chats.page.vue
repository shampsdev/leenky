<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { computed, onMounted } from "vue";
import { getChats } from "@/api/api";
import { useMiniApp } from "vue-tg";
import Profile from "@/components/profile.vue";
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

const searchQuery = ref("");

const filteredChats = computed(() => {
  if (!searchQuery.value) {
    return chats.value;
  }
  return chats.value.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const router = useRouter();
const goToChat = () => {
  router.push("/chat/1");
};

const miniApp = useMiniApp();

const initData = miniApp.initData;

onMounted(async () => {
  try {
    chats.value.push(...(await getChats(initData)));
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
  }
});
</script>

<template>
  <Profile />
  <div class="max-w-[95%] mx-auto px-4">
    <header class="flex items-center justify-between py-4">
      <h1 class="text-xl font-semibold">Чаты</h1>
    </header>

    <div class="relative flex items-center bg-gray-100 rounded-lg px-3 py-2 mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search"
        class="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
      />
      <button>
        <img src="/src/assets/Search.svg" alt="mic" class="w-5 h-5" />
      </button>
    </div>

    <ul v-if="filteredChats.length" class="divide-y divide-gray-200">
      <li
        v-for="chat in filteredChats"
        :key="chat.id"
        class="flex items-center py-3 cursor-pointer"
        @click="
          () => {
            router.push(`/chat/${chat.id}`);
          }
        "
      >
        <img :src="chat.avatar" alt="Avatar" class="w-12 h-12 rounded-full object-cover mr-4" />

        <div class="flex-1">
          <p class="font-medium">{{ chat.name }}</p>
          <p class="text-sm text-gray-500">{{ chat.members }} участников</p>
        </div>

        <div class="text-gray-400 text-xl">›</div>
      </li>
    </ul>
    <p v-else>Нет найденных чатов</p>
  </div>
</template>
