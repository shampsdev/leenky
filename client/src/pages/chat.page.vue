<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useMiniApp } from "vue-tg";
import { getChat } from "@/api/api";
import Profile from "@/components/profile.vue";
const chat = ref({
  name: "Шампиньоны (мини) хакатон",
  members: 7,
  avatar: "/src/assets/chat_avatar_example.png",
});

const miniApp = useMiniApp();
const avatar = miniApp?.initDataUnsafe?.user?.photo_url;
const initData = miniApp.initData;

const users = ref([
  {
    id: 1,
    firstName: "Timur",
    lastName: "Valeev",
    company: "Где-то тоже работает",
    role: "junior dev",
    bio: "Лучший из лучших фронт бэк",
    avatar: avatar,
  },
  {
    id: 1,
    firstName: "Timur",
    lastName: "Valeev",
    company: "Где-то тоже работает",
    role: "junior dev",
    bio: "Лучший из лучших фронт бэк",
    avatar: avatar,
  },
  {
    id: 1,
    firstName: "Timur",
    lastName: "Valeev",
    company: "Где-то тоже работает",
    role: "junior dev",
    bio: "Лучший из лучших фронт бэк",
    avatar: avatar,
  },
]);

const searchQuery = ref("");

const route = useRoute();
const chatId = route.params.chatId;

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;

  return users.value.filter((user) => {
    const query = searchQuery.value.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      (user.company && user.company.toLowerCase().includes(query)) ||
      (user.bio && user.bio.toLowerCase().includes(query))
    );
  });
});

onMounted(async () => {
  const chatData = await getChat(initData, chatId);
  chat.value = chatData;
  users.value = chatData.users;
});
</script>

<template>
  <Profile />
  <div class="max-w-md mx-auto px-4">
    <header class="flex items-center space-x-4 py-4">
      <img :src="chat.avatar" alt="Chat Avatar" class="w-12 h-12 rounded-full object-cover" />
      <div class="flex-1">
        <h1 class="text-lg font-semibold">{{ chat.name }}</h1>
        <p class="text-sm text-gray-500">{{ chat.members }} участников</p>
      </div>
    </header>

    <div class="relative flex items-center bg-gray-100 rounded-lg px-3 py-2 mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Поиск по пользователям"
        class="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
      />
      <button>
        <img src="/src/assets/Search.svg" alt="mic" class="w-5 h-5" />
      </button>
    </div>

    <ul v-if="filteredUsers.length" class="divide-y divide-gray-200">
      <li
        v-for="user in filteredUsers"
        :key="user.id"
        class="flex items-center py-3 cursor-pointer"
      >
        <img :src="user.avatar" alt="Avatar" class="w-12 h-12 rounded-full object-cover mr-4" />

        <div class="flex-1">
          <p class="font-medium flex items-center">
            {{ `${user.firstName} ${user.lastName}` }}
          </p>
          <p class="text-sm text-gray-500">{{ user.company }}</p>
          <p class="text-sm text-gray-500">{{ user.role }}</p>
        </div>

        <div class="text-gray-400 text-xl">›</div>
      </li>
    </ul>

    <p v-else class="text-gray-500 text-center py-4">Нет найденных пользователей</p>
  </div>
</template>
