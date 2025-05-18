import { PatchMe } from "../types/postApiTypes/patchMe.interface";
import { User } from "../types/user/user.interface";
import { UserProfile } from "../types/user/userProfile.interface";
import { api } from "./api";

export const getMe = async (initData: string): Promise<UserProfile | null> => {
  try {
    const response = await api.get<UserProfile>(`/users/me`, {
      headers: { "X-Api-Token": initData },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении профиля текущего пользователя:", error);
    return null;
  }
};

export const updateMe = async (
  initData: string,
  newData: PatchMe
): Promise<User | null> => {
  try {
    const response = await api.put<User>(`/users/me`, newData, {
      headers: { "X-Api-Token": initData },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при изменении профиля", error);
    return null;
  }
};

export const createMe = async (initData: string): Promise<User | null> => {
  try {
    const response = await api.post<User>("/users/me", {
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

export const deleteMe = async (initData: string): Promise<User | null> => {
  try {
    const response = await api.delete<User>("/users/me", {
      headers: {
        "X-Api-Token": initData,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при удалении профиля", error);
  }
  return null;
};
