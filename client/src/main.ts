import App from "./App.vue";
import { createApp } from "vue";
import { createWebHistory, createRouter } from "vue-router";
import { useTheme, VueTelegramPlugin } from "vue-tg";
import { createPinia } from "pinia";

import "./assets/main.css";

import BasePage from "./pages/base.page.vue";
import ProfilePage from "./pages/profile.page.vue";
import VaniogPage from "./pages/vaniog.page.vue";
import ChatsPage from "./pages/chats.page.vue";
import ChatPage from "./pages/chat.page.vue";
const theme = useTheme().backgroundColor;

const routes = [
  { path: "/", component: BasePage },
  { path: "/profile", component: ProfilePage },
  { path: "/profile/edit", component: ProfilePage },
  { path: "/vaniog", component: VaniogPage },
  { path: "/profile/:userid", component: ProfilePage },
  { path: "/chats", component: ChatsPage },
  { path: "/chat/:chatId", component: ChatPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const pinia = createPinia();

createApp(App).use(pinia).use(VueTelegramPlugin).use(router).mount("#app");
