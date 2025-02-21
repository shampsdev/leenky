import { watchEffect } from "vue";
import { useTheme } from "vue-tg";

export const useThemeSync = () => {
  const theme = useTheme();

  watchEffect(() => {
    if (theme.themeParams.value) {
      const root = document.documentElement.style;

      root.setProperty("--tg-bg-color", theme.themeParams.value.bg_color || "#ffffff");
      root.setProperty("--tg-text-color", theme.themeParams.value.text_color || "#000000");
      root.setProperty("--tg-hint-color", theme.themeParams.value.hint_color || "#aaaaaa");
      root.setProperty("--tg-link-color", theme.themeParams.value.link_color || "#0088cc");
      root.setProperty("--tg-button-color", theme.themeParams.value.button_color || "#0088cc");
      root.setProperty(
        "--tg-button-text-color",
        theme.themeParams.value.button_text_color || "#ffffff"
      );
      root.setProperty(
        "--tg-secondary-bg-color",
        theme.themeParams.value.secondary_bg_color || "#f9f9f9"
      );
      root.setProperty(
        "--tg-header-bg-color",
        theme.themeParams.value.header_bg_color || "#eeeeee"
      );
      root.setProperty(
        "--tg-subtitle-text-color",
        theme.themeParams.value.subtitle_text_color || "#666666"
      );
      root.setProperty(
        "--tg-destructive-text-color",
        theme.themeParams.value.destructive_text_color || "#ff3b30"
      );

      console.log("🎨 Telegram Theme Applied:", theme.themeParams.value);
    }
  });
};
