<script setup>
import { ref, computed, onMounted, inject, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMiniApp } from 'vue-tg';
import { getChat, getChatPreview, searchInChat } from '@/api/api';
import { useProfileStore } from '@/stores/profile.store';
import { useChatSearchStore } from '@/stores/chatSearch.store';
import { animate } from 'motion';
import { press } from 'motion';
import { handleImageError } from '@/utils/errorHandlers';
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
  isLoading.value = true;

  animateScreenEntry();
  if (chatSearchStore.chatData) {
    chat.value = await getChat(initData, chatId);
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
    chat.value = await getChat(initData, chatId);
    chatSearchStore.chatData = chat.value.users;
    users.value = chatSearchStore.chatData.users;
    chatSearchStore.searchQuery = '';
  }
  const chatPreview = await getChatPreview(initData, chatId);
  chat.value = chatPreview;
  searchQuery.value = chatSearchStore.searchQuery;
  filterUsers();
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
              @error="handleImageError"
              class="w-[68px] h-[68px] rounded-full aspect-square object-cover"
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
                <p class="text-hint font-light text-[15px]">
                  {{ chat.usersAmount ?? '0' }} участников
                </p>
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
              @error="handleImageError"
              :src="`${user.avatar}`"
              alt="Avatar"
              class="w-[60px] h-[60px] rounded-full aspect-square object-cover"
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
                class="text-gray-400 opacity-0 text-xl"
              />
            </div>
          </li>
        </ul>

        <div
          v-if="!filteredUsers.length && !isLoading"
          class="flex w-full flex-col items-center text-center mt-[120px] gap-[20px]"
        >
          <img src="/src/assets/notFound.svg" />

          <div class="flex flex-col items-center text-center gap-[8px]">
            <h1 class="font-semibold text-[20px]">Тут пока ничего нет</h1>
            <p class="text-hint text-[17px]">
              Но вы можете исправить это! Добавьте чаты, чтобы видеть информацию о других участниках
            </p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped></style>
