<script setup>
import { ref, computed, onMounted, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMiniApp } from 'vue-tg';
import { getChat, searchInChat } from '@/api/api';
import { useProfileStore } from '@/stores/profile.store';
import Profile from '@/components/profile.vue';
import { useChatSearchStore } from '@/stores/chatSearch.store';

const chat = ref({});
const miniApp = useMiniApp();
const router = useRouter();
const avatar = miniApp?.initDataUnsafe?.user?.photo_url;
const initData = miniApp.initData;
const profileStore = useProfileStore();
const users = ref([]);
const searchQuery = ref('');

const route = useRoute();
const chatId = route.params.chatId;

const chatSearchStore = useChatSearchStore();

const filterUsers = async () => {
  if (searchQuery.value.trim() === '') {
    const fetchedUsers = await getChat(initData, chatId);
    users.value = fetchedUsers.users ?? [];
    return;
  }
  if (searchQuery.value === chatSearchStore.searchQuery) {
    users.value = chatSearchStore.users;
  } else {
    const fetchedUsers = await searchInChat(initData, chatId, searchQuery.value);
    chatSearchStore.users = fetchedUsers ?? [];
    chatSearchStore.setQuery(searchQuery.value);
    users.value = fetchedUsers ?? [];
  }
};

onMounted(async () => {
  searchQuery.value = chatSearchStore.searchQuery;
  if (chatSearchStore.chatData) {
    chat.value = await getChat(initData, chatId);
    if (chatSearchStore.searchQuery === searchQuery) {
      searchQuery.value = chatSearchStore.searchQuery;
      users.value = chatSearchStore.users;
      chat.value.users = chatSearchStore.chatData;
    } else {
      const fetchedUsers = await searchInChat(initData, chatId, searchQuery.value);
      console.log('AAAA');
      if (fetchedUsers !== null) {
        users.value = fetchedUsers;
        chatSearchStore.chatData.users = fetchedUsers;
      }
    }
    chat.value.users = chatSearchStore.chatData;
  } else {
    chat.value = await getChat(initData, chatId);
    chatSearchStore.chatData = chat.value.users;
    users.value = chatSearchStore.chatData.users;
    chatSearchStore.searchQuery = '';
  }
  console.log(chat.value);
});

const filteredUsers = computed(() => users.value ?? []);
</script>

<template>
  <div class="max-w-[95%] h-[100%] overflow-auto scroll-container mx-auto px-4">
    <header class="flex items-center space-x-4 py-4">
      <li class="flex w-full flex-row items-center gap-[7px] cursor-pointer">
        <img
          @click="() => {}"
          :src="chat.avatar"
          alt="Avatar"
          class="max-w-[68px] max-h-[68px] rounded-full aspect-square object-cover"
        />

        <div
          :class="'flex flex-row w-full pl-[3px] justify-between py-[12px] items-center gap-[10px] border-b-[#c8d4d9]'"
        >
          <div class="flex flex-col gap-[2px]">
            <p class="font-normal text-[17px]">{{ chat.name }}</p>
            <p class="text-hint font-light text-[15px]">{{ users_count }} участников</p>
          </div>
          <img
            src="/src/assets/navigation.svg"
            @click="
              () => {
                leaveChatHandler(chat.id);
                filterChats();
              }
            "
            class="text-gray-400 text-xl"
          />
        </div>
      </li>
    </header>

    <div class="relative flex items-center bg-gray-100 rounded-lg px-3 py-2 mb-4">
      <input
        @input="filterUsers"
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
        @click="navigateToProfile(user.id)"
      >
        <img
          :src="`${user.avatar}`"
          alt="Avatar"
          class="w-12 h-12 rounded-full object-cover mr-4"
        />

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
