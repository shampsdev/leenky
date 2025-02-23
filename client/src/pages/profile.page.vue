<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useProfileStore } from '@/stores/profile.store';
import { useUserStore } from '@/stores/user.store';
import { getMe, getUserById, postMe } from '@/api/api';
import { useMiniApp } from 'vue-tg';
import { animate } from 'motion';
import { handleImageError } from '@/utils/errorHandlers';
const router = useRouter();
const route = useRoute();
const profileStore = useProfileStore();
const goToChats = () => {
  router.push('/chats');
};

const closeKeyboard = (event: any) => {
  event.target.blur();
};

const currentUser = useUserStore();
const userId = route.params.id as string;
const isCurrentUserProfile = ref(false);
const initData = useMiniApp().initData;
let isLoading = ref(true);

const textareaRef = ref<HTMLTextAreaElement | null>(null);

function autoResize() {
  if (!textareaRef.value) return;
  textareaRef.value.style.height = 'auto';
  textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 200)}px`;
}

const limitNewlines = (event: KeyboardEvent) => {
  const value = profileStore.editFieldProfile.bio;
  if (value != null) {
    const newlines = (value.match(/\n/g) || []).length;
    if (event.key === 'Enter' && newlines >= 6) {
      event.preventDefault();
    }
  }
};

async function RefreshProfile() {
  if (isCurrentUserProfile.value) {
    const fetchedUserData = await getMe(initData);
    if (fetchedUserData !== null) {
      profileStore.profile = fetchedUserData;
      profileStore.editFieldProfile = { ...fetchedUserData };
    }
  } else {
    const fetchedUserData = await getUserById(initData, userId);
    console.log(isCurrentUserProfile);
    if (fetchedUserData !== null) {
      profileStore.profile = fetchedUserData;
      profileStore.editFieldProfile = { ...fetchedUserData };
    }
  }

  isLoading.value = false;
}

const goToPersonChat = () => {
  const miniapp = useMiniApp();
  miniapp.openTelegramLink(`https://t.me/${profileStore.profile.telegramUsername}`);
};

const saveChanges = async () => {
  try {
    await postMe(initData, profileStore.editFieldProfile);
    await RefreshProfile();
    profileStore.toggleEditMode();
  } catch (error) {
    console.error('Ошибка при сохранении изменений:', error);
  }
};

const isLoadedAnimnation = ref(false);

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

onMounted(() => {
  animateScreenEntry();
});

onMounted(async () => {
  animateScreenEntry();
  isCurrentUserProfile.value = currentUser.id === userId || userId === 'null';
  await RefreshProfile();
  console.log(isCurrentUserProfile, currentUser.id, currentUser.telegramId, userId);
});

//const handleScroll = (event:) => {
//if (document.activeElement && document.activeElement.tagName === 'TEXTAREA') {
// document.activeElement.blur();
//}
</script>

<template>
  <div class="screen-container">
    <transition name="fade" @before-enter="animateScreenEntry" @enter="animateScreenEntry">
      <div
        v-if="!isLoading"
        :class="[
          'max-w-[95%] overflow-y-auto scroll-container py-4 mx-auto px-4',
          {
            'h-[170vh]': profileStore.editMode,
            'max-h-[calc(100vh-100px)]': !profileStore.editMode,
          },
        ]"
      >
        <div class="w-full">
          <div class="flex flex-col items-center gap-[17px]">
            <img
              class="w-[115px] h-[115px] rounded-full object-cover"
              :src="profileStore.profile.avatar || ''"
              @error="handleImageError"
            />

            <div v-if="!profileStore.editMode" class="text-center">
              <p class="font-semibold inline-flex text-[20px] gap-[10px] items-center">
                {{ profileStore.profile.firstName }} {{ profileStore.profile.lastName }}
              </p>
              <p v-if="!profileStore.editMode" class="text-hint text-[15px]">
                {{ `@${profileStore.profile.telegramUsername}` }}
              </p>
            </div>

            <div v-if="!isCurrentUserProfile" class="flex justify-center">
              <button
                class="inline-flex items-center gap-[6px] px-[30px] py-[12px] bg-[#20C86E] rounded-[30px] text-white font-semibold"
                @click="goToPersonChat"
              >
                Написать <img src="/src/assets/tg_white.svg" alt="" />
              </button>
            </div>
          </div>

          <div v-if="!profileStore.editMode">
            <div class="mt-[15px] rounded-lg">
              <div
                class="bg-form flex flex-col gap-[10px] px-[16px] rounded-[12px] divide-y divide-[#707579]"
              >
                <div class="flex flex-col py-[17px]">
                  <p class="text-[15px] text-hint">Место работы</p>
                  <p class="text-[17px]">{{ profileStore.profile.company }}</p>
                </div>

                <div class="py-[17px]">
                  <p class="text-[15px] text-hint">Должность</p>
                  <p class="text-[17px]">{{ profileStore.profile.role }}</p>
                </div>

                <div class="py-[17px]">
                  <p class="text-[15px] text-hint">Описание</p>
                  <p class="text-[17px] whitespace-pre-wrap">
                    {{ profileStore.profile.bio }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="w-full flex flex-col mt-[25px] gap-[12px] caret-[#20C86E]">
            <section>
              <fieldset
                class="border-2 rounded-xl px-3 relative transition-all duration-100 focus-within:border-[#20C86E] focus-within:text-[#20C86E] border-gray-300 text-gray-400"
              >
                <legend class="px-2 text-[15px] font-semibold transition-all duration-100">
                  Имя
                </legend>
                <input
                  @keydown.enter="closeKeyboard"
                  type="text"
                  maxlength="40"
                  v-model="profileStore.editFieldProfile.firstName"
                  class="w-full text-main outline-none pb-[12px] py-[3px] px-[16px] bg-transparent"
                />
              </fieldset>
            </section>
            <section>
              <fieldset
                class="w-full border-2 rounded-xl p-3 relative transition-all duration-100 focus-within:border-[#20C86E] focus-within:text-[#20C86E] border-gray-300 text-gray-400"
              >
                <legend class="px-2 text-[15px] font-semibold transition-all duration-100">
                  Фамилия
                </legend>
                <input
                  @keydown.enter="closeKeyboard"
                  type="text"
                  maxlength="40"
                  v-model="profileStore.editFieldProfile.lastName"
                  class="w-full text-main outline-none pb-[12px] py-[3px] px-[16px] bg-transparent"
                />
              </fieldset>
            </section>
            <section>
              <fieldset
                class="border-2 rounded-xl p-3 relative transition-all duration-100 focus-within:border-[#20C86E] focus-within:text-[#20C86E] border-gray-300 text-gray-400"
              >
                <legend class="px-2 text-sm transition-all">Место работы</legend>
                <input
                  @keydown.enter="closeKeyboard"
                  type="text"
                  maxlength="40"
                  v-model="profileStore.editFieldProfile.company"
                  class="w-full text-main outline-none pb-[12px] py-[3px] px-[16px] bg-transparent"
                />
              </fieldset>
            </section>
            <section>
              <fieldset
                class="border-2 rounded-xl p-3 relative transition-all duration-100 focus-within:border-[#20C86E] focus-within:text-[#20C86E] border-gray-300 text-gray-400"
              >
                <legend
                  class="px-2 text-sm transition-all duration-100 focus-within:border-[#20C86E]"
                >
                  Должность
                </legend>
                <input
                  @keydown.enter="closeKeyboard"
                  type="text"
                  maxlength="40"
                  v-model="profileStore.editFieldProfile.role"
                  class="w-full text-main outline-none pb-[12px] py-[3px] px-[16px] bg-transparent"
                />
              </fieldset>
            </section>
            <section>
              <fieldset
                class="border-2 rounded-xl p-3 relative border-gray-300 focus-within:border-[#20C86E] focus-within:text-[#20C86E] text-gray-400"
              >
                <legend class="px-2 text-sm">Описание</legend>
                <textarea
                  ref="textareaRef"
                  v-model="profileStore.editFieldProfile.bio"
                  @input="autoResize"
                  @keydown="limitNewlines"
                  maxlength="230"
                  rows="6"
                  style="white-space: pre-wrap"
                  class="resize-none w-full text-main outline-none pb-[6px] py-[3px] px-[16px] bg-transparent"
                ></textarea>
              </fieldset>
            </section>
          </div>
        </div>
      </div>
    </transition>
  </div>
  <div
    v-if="isCurrentUserProfile"
    class="flex w-[100vw] h-[100px] absolute right-0 bottom-0 left-0 text-center items-center justify-center bg-white"
  >
    <div class="block h-full w-full bg-white absolute z-0"></div>

    <button
      v-if="profileStore.isChanged && profileStore.editMode"
      class="px-[30px] py-[12px] z-10 bg-[#20C86E] rounded-[30px] text-white font-semibold"
      @click="saveChanges"
    >
      Сохранить
    </button>

    <button
      v-else-if="!profileStore.isChanged && profileStore.editMode"
      class="px-[30px] py-[12px] z-10 bg-white rounded-[30px] text-main font-semibold"
      @click="profileStore.toggleEditMode"
    >
      Редактировать
    </button>
    <button
      v-else
      class="px-[30px] py-[12px] z-10 bg-[#20C86E] rounded-[30px] text-white font-semibold"
      @click="profileStore.toggleEditMode"
    >
      Редактировать
    </button>
  </div>
</template>

<style scoped>
.screen-container {
  opacity: 0.5;
}

fieldset {
  border-radius: 12px;
  margin: 0;
  padding: 0;
}
legend {
  margin-left: 12px;
  padding: 0 4px;
}
</style>
