<script setup lang="ts">
import Button from "@/components/button.vue";
import team from "@/assets/team.png";
import InviteModal from "@/components/inviteModal.vue";
import { useInviteStore } from "@/stores/invite.store";
import { useRouter } from "vue-router";
const modalStore = useInviteStore();
const router = useRouter();
const goToVaniog = () => {
  router.push("/vaniog");
};
</script>

<template>
  <div class="w-[100vw] h-[100vh] flex justify-center items-center text-main">
    <div class="block w-[95%]">
      <div class="flex flex-col items-center text-center">
        <div class="w-[90%]">
          <img :src="team" alt="" srcset="" />
          <div class="mt-[30px]">
            <span class="font-bold">TgLinked</span>
            <p class="text-hint mt-[8px]">
              Упрощение взаимодействия и обмен контактной информацией между участниками чата
            </p>
            <Button @click="goToVaniog">ВАНЯЯЯЯ</Button>
            <InviteModal v-if="!modalStore.isModalClosed" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
