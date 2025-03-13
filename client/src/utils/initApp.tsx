import { init, miniApp } from "@telegram-apps/sdk-react";

const initializeApplication = () => {
  init();

  if (miniApp.setBackgroundColor.isAvailable()) {
    miniApp.setBackgroundColor("#FFFFFF");
  }
};

export default initializeApplication;
