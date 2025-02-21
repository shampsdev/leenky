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
import AboutFirstPage from "./pages/about.first.page.vue";
import InitialPage from "./pages/initial.page.vue";
import AboutSecondPage from "./pages/about.second.page.vue";
import RegistrationPage from "./pages/registration.page.vue";
import InvitePage from "./pages/invite.page.vue";
const theme = useTheme().backgroundColor;

const routes = [
  { path: "/", component: InitialPage },
  { path: "/about/1", component: AboutFirstPage },
  { path: "/about/2", component: AboutSecondPage },
  { path: "/registration", component: RegistrationPage },
  { path: "/vaniog", component: VaniogPage },
  { path: "/profile/:id", component: ProfilePage },
  { path: "/chats", component: ChatsPage },
  { path: "/chats/:chatId", component: ChatsPage },
  { path: "/chat/:chatId", component: ChatPage },
  { path: "/invite", component: InvitePage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const pinia = createPinia();

createApp(App).use(pinia).use(VueTelegramPlugin).use(router).mount("#app");
