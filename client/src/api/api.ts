import axios from "axios";

import type { UserData, ChatData } from "@/types/user.interface";

export const api = axios.create({
  baseURL: "https://tglinked.shamps.dev/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  maxRedirects: 0,
});

export const getChat = async (initData: string, chatId: string): Promise<ChatData | null> => {
  try {
    const response = await api.get<ChatData>(`/chats/${chatId}`, {
      headers: { "X-Api-Token": initData },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении чата:", error);
    return null;
  }
};

export const getChats = async (initData: string): Promise<ChatData[] | null> => {
  try {
    const response = await api.get<ChatData[]>(`/chats/`, {
      headers: { "X-Api-Token": initData },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении чатов:", error);
    return null;
  }
};

// userID – inner backend id
export const getUserById = async (initData: string, userId: string): Promise<UserData | null> => {
  try {
    const response = await api.get<UserData>(`/users/${userId}`, {
      headers: { "X-Api-Token": initData },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении профиля текущего пользователя:", error);
    return null;
  }
};

export const getMe = async (initData: string): Promise<UserData | null> => {
  try {
    const response = await api.get<UserData>(`/users/me`, {
      headers: { "X-Api-Token": initData },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении профиля текущего пользователя:", error);
    return null;
  }
};

export const postMe = async (
  initData: string,
  newData: Pick<UserData, "firstName" | "lastName" | "bio" | "role" | "company">
): Promise<UserData | null> => {
  try {
    const response = await api.put<UserData>(`/users/`, newData, {
      headers: { "X-Api-Token": initData },
    });
    console.log(initData);
    return response.data;
  } catch (error) {
    console.error("Ошибка при изменении профиля", error);
    return null;
  }
};
