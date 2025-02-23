<script setup>
import { ref, computed, onMounted, inject, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMiniApp } from 'vue-tg';
import { getChat, searchInChat } from '@/api/api';
import { useProfileStore } from '@/stores/profile.store';
import { useChatSearchStore } from '@/stores/chatSearch.store';
import { animate } from 'motion';
import { press } from 'motion';
const chat = ref({});
const miniApp = useMiniApp();
const router = useRouter();
const avatar = miniApp?.initDataUnsafe?.user?.photo_url;
const initData = miniApp.initData;
const profileStore = useProfileStore();
const users = ref([]);
const searchQuery = ref('');
const isLoading = ref(true);
const isLoadingChatAvatar = ref(true);
const chatAvatarUrl = ref('');
const route = useRoute();
const chatId = route.params.chatId;
const users_count = ref(0);
const chatSearchStore = useChatSearchStore();

const closeKeyboard = event => {
  event.target.blur();
};

onBeforeMount(async () => {
  isLoading.value = true;
  isLoadingChatAvatar.value = true;
  try {
    chat.value = await getChat(initData, chatId);
    users.value = chat.value.users ?? [];
    chatAvatarUrl.value = chat.value.avatar;
  } catch (error) {
    console.error('Ошибка загрузки чата:', error);
  }
  isLoadingChatAvatar.value = false;
});

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

const filterUsers = async () => {
  isLoading.value = true;

  if (searchQuery.value.trim() === '') {
    // Когда строка пустая, запрашиваем всех пользователей
    const fetchedUsers = await getChat(initData, chatId);
    users.value = fetchedUsers.users;
    isLoading.value = false;
    return;
  }

  // Когда есть текст, выполняем поиск
  if (searchQuery.value === chatSearchStore.searchQuery) {
    users.value = chatSearchStore.users;
    isLoading.value = false;
  } else {
    const fetchedUsers = await searchInChat(initData, chatId, searchQuery.value);
    chatSearchStore.users = fetchedUsers ?? [];
    chatSearchStore.setQuery(searchQuery.value);
    users.value = fetchedUsers ?? [];
    isLoading.value = false;
  }
};

onMounted(async () => {
  isLoading.value = true;
  animateScreenEntry();
  searchQuery.value = chatSearchStore.searchQuery;
  if (chatSearchStore.chatData) {
    chat.value = await getChat(initData, chatId);
    users_count.value = chat.value.users.length;
    if (chatSearchStore.searchQuery === searchQuery) {
      searchQuery.value = chatSearchStore.searchQuery;
      users.value = chatSearchStore.users;
      chat.value.users = chatSearchStore.chatData;
    } else {
      const fetchedUsers = await searchInChat(initData, chatId, searchQuery.value);
      if (fetchedUsers !== null) {
        users.value = fetchedUsers;
        chatSearchStore.chatData.users = fetchedUsers;
      }
    }
    chat.value.users = chatSearchStore.chatData;
  } else {
    chatSearchStore.chatData = chat.value.users;
    users.value = chatSearchStore.chatData.users;
    chatSearchStore.searchQuery = '';
  }
  isLoading.value = false;
});

const filteredUsers = computed(() => users.value ?? []);
</script>

<template>
  <div class="screen-container">
    <transition name="fade" @before-enter="animateScreenEntry" @enter="animateScreenEntry">
      <div class="max-w-[95%] max-h-[100vh] overflow-auto scroll-container mx-auto px-4">
        <header class="flex items-center space-x-4 py-4">
          <li class="flex w-full flex-row items-center gap-[7px] cursor-pointer">
            <img
              v-if="!isLoadingChatAvatar"
              :src="chatAvatarUrl"
              alt="Avatar"
              class="max-w-[68px] max-h-[68px] rounded-full aspect-square object-cover"
            />
            <div
              v-if="isLoadingChatAvatar"
              class="w-[68px] h-[68px] rounded-full aspect-square"
              alt=""
            ></div>
            <div
              :class="'flex flex-row w-full pl-[3px] justify-between py-[12px] items-center gap-[10px] border-b-[#c8d4d9]'"
            >
              <div class="flex flex-col gap-[2px]">
                <p class="font-normal text-[17px]">{{ chat.name ?? '  название чата ' }}</p>
                <p class="text-hint font-light text-[15px]">{{ users_count ?? '0' }} участников</p>
              </div>
            </div>
          </li>
        </header>

        <div class="relative flex items-center gap-[8px] bg-[#EEEEEF] rounded-lg px-3 py-2 mb-4">
          <button>
            <img src="/src/assets/search_transparent.svg" alt="search" class="w-5 h-5" />
          </button>
          <input
            @keydown.enter="closeKeyboard"
            @input="filterUsers"
            v-model="searchQuery"
            type="text"
            placeholder="Поиск участников"
            class="flex-1 outline-none placeholder-[#838388] text-main"
          />
        </div>

        <ul v-if="filteredUsers.length" class="flex flex-col gap-0 mt-[25px]">
          <li
            v-if="!isLoading"
            v-for="(user, userIndex) in filteredUsers"
            :key="user.id"
            class="flex w-full flex-row items-center gap-[7px] cursor-pointer"
            @click="
              () => {
                router.push(`/profile/${user.id}`);
                profileStore.initialProfile = {
                  firstName: user.firstName,
                  lastName: user.lastName,
                  avatar: user.avatar,
                  company: user.company,
                  role: user.role,
                  bio: user.bio,
                };
                profileStore.profile = {
                  firstName: user.firstName,
                  lastName: user.lastName,
                  avatar: user.avatar,
                  company: user.company,
                  role: user.role,
                  bio: user.bio,
                };
              }
            "
          >
            <img
              :src="`${user.avatar}`"
              alt="Avatar"
              class="max-w-[60px] max-h-[60px] rounded-full aspect-square object-cover"
            />

            <div
              :class="[
                'flex flex-row w-full pl-[3px] justify-between py-[12px] items-center gap-[10px] border-b-[#c8d4d9]',
                userIndex <= filteredUsers.length - 2 ? 'border-b-1' : '',
              ]"
            >
              <div class="flex flex-col gap-[0px]">
                <p class="font-normal text-[17px]">
                  {{ `${user.firstName} ${user.lastName}` }}
                </p>
                <p class="text-hint font-light text-[15px]">{{ user.company }}</p>
                <p class="text-hint font-light text-[15px]">{{ user.role }}</p>
              </div>
              <img
                src="/src/assets/navigation.svg"
                @click="leaveChatHandler(chat.id)"
                class="text-gray-400 text-xl"
              />
            </div>
          </li>
        </ul>

        <p v-else class="text-gray-500 text-center py-4">Нет найденных пользователей</p>
      </div>
    </transition>
  </div>
</template>

<style scoped></style>
