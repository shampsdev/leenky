import "./assets/main.css";
import { createApp, watchEffect } from "vue";
import ChatsPage from "./pages/chats.page.vue";
import UserPage from "./pages/user.page.vue";
import ProfilePage from "./pages/profile.page.vue";
import { createWebHistory, createRouter } from "vue-router";
import App from "./App.vue";
import { useTheme, VueTelegramPlugin } from "vue-tg";
import { createPinia } from "pinia";
import HomePage from "./pages/home.page.vue";
import LoginPage from "./pages/login.page.vue";
const theme = useTheme().backgroundColor;

const routes = [
  { path: "/", component: HomePage },
  { path: "/user", component: UserPage, meta: { requiresAuth: true } },
  { path: "/profile", component: ProfilePage, meta: { requiresAuth: true } },
  { path: "/chats", component: ChatsPage },
  { path: "/login", component: LoginPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const pinia = createPinia();

createApp(App).use(pinia).use(VueTelegramPlugin).use(router).mount("#app");
