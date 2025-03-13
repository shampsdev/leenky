import { init, initData, miniApp } from "@telegram-apps/sdk-react";

const initializeApplication = () => {
  init();
  initData.restore();
  if (miniApp.setBackgroundColor.isAvailable()) {
    miniApp.setBackgroundColor("#FFFFFF");
    miniApp.setHeaderColor("#FFFFFF");
  }
};

export default initializeApplication;
