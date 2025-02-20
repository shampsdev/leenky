import axios from "axios";

export interface UserData {
  bio: string | null;
  company: string | null;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
}

export const api = axios.create({
  baseURL: "https://tglinked.shamps.dev/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
  maxRedirects: 0,
});

export const getChat = async (initData: string, chatId: string) => {
  try {
    const response = await api.get(`/chats/${chatId}`, {
      headers: { "X-Api-Token": initData },
    });
    console.log(response.data, "aboab");
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении чата:", error);
  }
};

export const getChats = async (initData: string) => {
  try {
    const response = await api.get(`/chats/`, {
      headers: { "X-Api-Token": initData },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении чатов:", error);
    return error;
  }
};

export const getMe = async (initData: string) => {
  try {
    const response = await api.get(`/users/me`, {
      headers: { "X-Api-Token": initData },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении профиля текущего пользователя:", error);
    return error;
  }
};

export const postMe = async (
  initData: string,
  newData: UserData
): Promise<UserData | undefined> => {
  try {
    const response = await api.put<UserData>(`/users/`, newData, {
      headers: { "X-Api-Token": initData },
    });
    console.log(initData);
    return response.data;
  } catch (error) {
    console.error("Ошибка при изменении профиля", error);
    return undefined;
  }
};
