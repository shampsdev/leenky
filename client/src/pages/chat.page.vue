<script setup>
import { ref, computed } from "vue";
import { useMiniApp } from "vue-tg";

const chat = ref({
  name: "Шампиньоны (мини) хакатон",
  members: 7,
  avatar: "/src/assets/chat_avatar_example.png",
});

const miniApp = useMiniApp();
const avatar = miniApp?.initDataUnsafe?.user?.photo_url;

// Список пользователей
const users = ref([
  {
    id: 1,
    name: "Timur Valeev",
    job: "Где-то тоже работает",
    description: "Лучший из лучших фронт бэк",
    avatar: avatar,
  },
  {
    id: 2,
    name: "mike",
    job: "Где-то тоже работает",
    description: "Все профессии мира",
    avatar: avatar,
  },
  {
    id: 3,
    name: "Настя",
    emoji: "🍄",
    job: "Dodo Brands",
    description: "Бэст проджект менеджер эвэр",
    avatar: avatar,
  },
  {
    id: 4,
    name: "Вика",
    job: "В мечтах работаю в Dodo Brands",
    description: "Senior продуктовый дизайнер",
    avatar: avatar,
  },
  {
    id: 5,
    name: "Mikhail Gavrilov",
    job: "",
    description: "",
    avatar: avatar,
  },
]);

const searchQuery = ref("");

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;

  return users.value.filter((user) => {
    const query = searchQuery.value.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      (user.job && user.job.toLowerCase().includes(query)) ||
      (user.description && user.description.toLowerCase().includes(query))
    );
  });
});
</script>

<template>
  <div class="max-w-md mx-auto px-4">
    <!-- Заголовок -->
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
            {{ user.name }}
            <span v-if="user.emoji" class="ml-1">{{ user.emoji }}</span>
          </p>
          <p class="text-sm text-gray-500">{{ user.job }}</p>
          <p class="text-xs text-gray-400">{{ user.description }}</p>
        </div>

        <div class="text-gray-400 text-xl">›</div>
      </li>
    </ul>

    <p v-else class="text-gray-500 text-center py-4">Нет найденных пользователей</p>
  </div>
</template>
