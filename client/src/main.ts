import App from "./App.vue";
import { createApp } from "vue";
import { createWebHistory, createRouter } from "vue-router";
import { useTheme, VueTelegramPlugin } from "vue-tg";
import { createPinia } from "pinia";

import "./assets/main.css";

import BasePage from "./pages/base.page.vue";
import ProfilePage from "./pages/profile.page.vue";
const theme = useTheme().backgroundColor;

const routes = [
  { path: "/", component: BasePage },
  { path: "/profile", component: ProfilePage },
  { path: "/profile/edit", component: ProfilePage },
  { path: "/profile/:userID", component: ProfilePage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const pinia = createPinia();

createApp(App).use(pinia).use(VueTelegramPlugin).use(router).mount("#app");
