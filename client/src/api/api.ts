import axios from "axios";
import { API_URL } from "../shared/constants";
import { UserData, ChatData, ChatPreviewData } from "../types/user.interface";
export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  maxRedirects: 0,
});

export const getChat = async (
  initData: string,
  chatId: string
): Promise<ChatData | null> => {
  try {
    const response = await api.get<ChatData>(`/chats/id/${chatId}`, {
      headers: { "X-Api-Token": initData },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении чата:", error);
    return null;
  }
};

export const getChatPreview = async (
  initData: string,
  chatId: string
): Promise<ChatPreviewData | null> => {
  try {
    const response = await api.get<ChatPreviewData>(
      `/chats/id/${chatId}/preview`,
      {
        headers: { "X-Api-Token": initData },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении чата:", error);
    return null;
  }
};

export const getChats = async (
  initData: string
): Promise<ChatData[] | null> => {
  try {
    const response = await api.get<ChatData[]>(`/chats`, {
      headers: { "X-Api-Token": initData },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении чатов:", error);
    return null;
  }
};

// userID – inner backend id
export const getUserById = async (
  initData: string,
  userId: string
): Promise<UserData | null> => {
  try {
    const response = await api.get<UserData>(`/users/id/${userId}`, {
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
    const response = await api.put<UserData>(`/users/me`, newData, {
      headers: { "X-Api-Token": initData },
    });
    console.log(initData);
    return response.data;
  } catch (error) {
    console.error("Ошибка при изменении профиля", error);
    return null;
  }
};

export const createMe = async (
  initData: string,
  userData: Pick<
    UserData,
    "firstName" | "lastName" | "bio" | "role" | "company"
  >
): Promise<Pick<
  UserData,
  "firstName" | "lastName" | "bio" | "role" | "company"
> | null> => {
  try {
    const response = await api.post<UserData>("/users/me", userData, {
      headers: {
        "X-Api-Token": initData,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при содании профиля", error);
  }
  return null;
};

export const joinMe = async (
  initData: string,
  chatId: string
): Promise<boolean> => {
  try {
    const response = await api.post(
      `/chats/id/${chatId}/join`,
      {},
      {
        headers: {
          "X-Api-Token": initData,
        },
      }
    );
    return response.status === 200;
  } catch (error) {
    console.error("ошибка при присоединении к чату", error);
    return false;
  }
};

export const searchInChat = async (
  initData: string,
  chatId: string,
  query: string
): Promise<UserData[] | null> => {
  try {
    const response = await api.get<UserData[]>(`/chats/id/${chatId}/search`, {
      params: {
        q: query,
      },
      headers: {
        "X-Api-Token": initData,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при поиске пользователей:", error);
    return null;
  }
};

export const searchChats = async (
  initData: string,
  query: string
): Promise<ChatData[] | null> => {
  try {
    const response = await api.get<ChatData[]>(`/chats/search`, {
      params: {
        q: query,
      },
      headers: {
        "X-Api-Token": initData,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при поиске пользователей:", error);
    return null;
  }
};

export const leaveChat = async (
  initData: string,
  chatId: string
): Promise<boolean> => {
  try {
    const response = await api.post<UserData[]>(
      `/chats/id/${chatId}/leave`,
      {},
      {
        headers: {
          "X-Api-Token": initData,
        },
      }
    );
    return response.status === 200;
  } catch (error) {
    return false;
  }
};
