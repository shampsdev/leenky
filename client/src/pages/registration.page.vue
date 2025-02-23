<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMiniApp, usePopup } from 'vue-tg';
import { createMe, joinMe, postMe } from '@/api/api';
import { useRegistrationStore } from '@/stores/registration.store';
import Button from '@/components/button.vue';
import { animate } from 'motion';
import { handleImageError } from '@/utils/errorHandlers';

const router = useRouter();
const profileStore = useRegistrationStore();

const initData = useMiniApp().initData;
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const initDataUnsafe = useMiniApp().initDataUnsafe;
const miniApp = useMiniApp();
const popUp = usePopup();
const chatId = miniApp.initDataUnsafe.start_param;

const goToChats = async () => {
  const response = await createMe(initData, profileStore.profile);
  if (response === null) {
    if (popUp.showAlert) popUp.showAlert('Произошла ошибка при создании пользователя');
  } else {
    if (miniApp.initDataUnsafe.start_param) {
      const joinResponse = await joinMe(initData, miniApp.initDataUnsafe.start_param || '');
      if (joinResponse === null) {
        if (popUp.showAlert) popUp.showAlert('Произошла ошибка при регистрации пользователя');
      } else {
        router.replace('/chats');
        console.log(chatId);
        if (chatId !== undefined) {
          setTimeout(() => router.push(`/chat/${chatId}`), 100);
        }
      }
    } else {
      router.replace('/chats');
    }
  }
};

function autoResize() {
  if (!textareaRef.value) return;

  textareaRef.value.style.height = 'auto';
  textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 200)}px`;
}

const limitNewlines = (event: KeyboardEvent) => {
  const value = profileStore.profile.bio;
  if (value != null) {
    const newlines = (value.match(/\n/g) || []).length;
    if (event.key === 'Enter' && newlines >= 6) {
      event.preventDefault();
    }
  }
};

const goBack = () => {
  router.back();
};

const updateProfie = async () => {
  const userData = await postMe(initData, profileStore.profile);

  if (userData) {
    profileStore.setProfile(userData);
  } else {
    console.error('Ошибка: данные пользователя не загружены');
  }
};

const isLoaded = ref(false);

const handleImageLoad = () => {
  isLoaded.value = true;
};

const closeKeyboard = (event: any) => {
  if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') event.target.blur();
};

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
  profileStore.setProfile({
    firstName: '',
    lastName: '',
    avatar: initDataUnsafe.user?.photo_url || '',
    role: '',
    company: '',
    bio: '',
    telegramUsername: initDataUnsafe.user?.username || '',
  });
  profileStore.editMode = true;
  const img = new Image();

  img.src = initDataUnsafe.user?.photo_url || '';
  img.onload = () => {
    isLoaded.value = true;
  };
  animateScreenEntry();
  console.log(initDataUnsafe.start_param);
});
</script>

<template>
  <div class="screen-container">
    <transition name="fade" @before-enter="animateScreenEntry" @enter="animateScreenEntry">
      <div
        @click="closeKeyboard"
        :class="[
          'max-w-[95%] overflow-y-auto scroll-container py-4 mx-auto px-4',
          {
            'h-[150vh]': profileStore.editMode,
            'h-[120vh]': !profileStore.editMode,
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
          </div>

          <div class="w-full flex flex-col mt-[25px] gap-[12px] caret-[#20C86E]">
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
                  v-model="profileStore.profile.firstName"
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
                  v-model="profileStore.profile.lastName"
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
                  v-model="profileStore.profile.company"
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
                  v-model="profileStore.profile.role"
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
                  v-model="profileStore.profile.bio"
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
    class="flex w-[100vw] h-[100px] absolute right-0 bottom-0 left-0 text-center items-center justify-center"
  >
    <button
      v-if="profileStore.isFilled"
      class="px-[30px] py-[12px] z-10 bg-[#20C86E] rounded-[30px] text-white font-semibold"
      @click="goToChats"
    >
      Готово
    </button>

    <button v-else class="px-[30px] py-[12px] z-10 bg-form rounded-[30px] text-main font-semibold">
      Готово
    </button>
  </div>

  <!-- <div v-if="isLoaded" class="w-full flex flex-col h-full items-center p-4">
    <div class="w-[90%]">
      <div class="flex flex-col items-center">
        <img
          @load="handleImageLoad"
          class="w-28 h-28 rounded-full object-cover"
          :src="`${profileStore.profile.avatar}`"
          v-if="profileStore.profile.avatar"
        />
        <div
          v-else
          class="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center"
        ></div>
      </div>
      <button
        v-if="profileStore.isChanged"
        @click="
          () => {
            updateProfie();
            goBack();
          }
        "
        class="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Сохранить
      </button>

      <div class="w-full flex flex-col mt-6 p-4 rounded-lg gap-[25px]">
        <section>
          <h2 class="text-sm px-[16px] font-semibold mb-2">Персональные данные</h2>
          <fieldset
            class="border-2 rounded-xl p-3 relative transition-all duration-100 focus-within:border-[#007aff] focus-within:text-[#007aff] border-gray-300 text-gray-400"
          >
            <legend class="px-2 text-sm transition-all duration-100">Имя</legend>
            <input
              type="text"
              maxlength="40"
              v-model="profileStore.profile.firstName"
              class="w-full text-main outline-none px-2 py-1 bg-transparent"
            />
          </fieldset>

          <fieldset
            class="w-full border-2 rounded-xl p-3 relative transition-all duration-100 focus-within:border-[#007aff] focus-within:text-[#007aff] border-gray-300 text-gray-400"
          >
            <legend class="px-2 text-sm transition-all duration-100">Фамилия</legend>
            <input
              type="text"
              maxlength="40"
              v-model="profileStore.profile.lastName"
              class="w-full outline-none px-2 py-1 bg-transparent text-main"
            />
          </fieldset>
        </section>
        <section>
          <h2 class="text-sm px-[16px] font-semibold mb-2">Краткое описание</h2>
          <fieldset
            class="border-2 rounded-xl p-3 relative transition-all duration-100 focus-within:border-[#007aff] focus-within:text-[#007aff] border-gray-300 text-gray-400"
          >
            <legend class="px-2 text-sm transition-all">Место работы</legend>
            <input
              type="text"
              maxlength="40"
              v-model="profileStore.profile.company"
              class="w-full outline-none px-2 py-1 bg-transparent text-main"
            />
          </fieldset>

          <fieldset
            class="border-2 rounded-xl p-3 relative transition-all duration-100 focus-within:border-[#007aff] focus-within:text-[#007aff] border-gray-300 text-gray-400"
          >
            <legend class="px-2 text-sm transition-all duration-100 focus-within:border-[#007aff]">
              Должность
            </legend>
            <input
              type="text"
              maxlength="40"
              v-model="profileStore.profile.role"
              class="w-full outline-none py-1 bg-transparent text-main px-[16px]"
            />
          </fieldset>

          <fieldset
            class="border-2 rounded-xl p-3 relative border-gray-300 focus-within:border-[#007aff] focus-within:text-[#007aff] text-gray-400"
          >
            <legend class="px-2 text-sm">Описание</legend>
            <textarea
              ref="textareaRef"
              v-model="profileStore.profile.bio"
              @input="autoResize"
              @keydown="limitNewlines"
              maxlength="230"
              rows="1"
              class="resize-none w-full outline-none text-main px-[16px]"
            ></textarea>
          </fieldset>
        </section>
      </div>
    </div>
    <Button @click="goToChats"> Готово</Button>
  </div> -->
</template>

<style scoped>
.screen-container {
  opacity: 0.5;
  overflow-y: auto;
  height: 100vh;
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
