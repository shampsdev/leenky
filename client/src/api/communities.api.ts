import { Community } from "../types/community/community.interface";
import { Member } from "../types/member/member.interface";
import { MemberConfig } from "../types/member/memberConfig.interface";
import { CreateCommunity } from "../types/postApiTypes/createCommunity.interface";
import { PatchCommunity } from "../types/postApiTypes/patchCommunity.interface";
import { api } from "./api";

export const getCommunityPreviews = async (
  initData: string
): Promise<Community[] | null> => {
  try {
    const response = await api.get<Community[]>(`/communities`, {
      headers: { "X-Api-Token": initData },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении сообществ:", error);
    return null;
  }
};

export const createCommunity = async (
  initData: string,
  communityData: CreateCommunity
): Promise<Community | null> => {
  try {
    const response = await api.post<Community>(`/communities`, communityData, {
      headers: { "X-Api-Token": initData },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при создании сообщества:", error);
    return null;
  }
};

export const patchCommunity = async (
  initData: string,
  patchCommunityData: PatchCommunity
): Promise<Community | null> => {
  try {
    const response = await api.patch<Community>(
      `/communities/id/${patchCommunityData.id}`,
      patchCommunityData,
      {
        headers: { "X-Api-Token": initData },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при патче сообщества:", error);
    return null;
  }
};

export const getCommunity = async (
  initData: string,
  id: string
): Promise<Community | null> => {
  try {
    const response = await api.get<Community>(`/communities/id/${id}`, {
      headers: { "X-Api-Token": initData },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении сообщества:", error);
    return null;
  }
};

export const joinCommunity = async (
  initData: string,
  id: string,
  memberConfig: MemberConfig
): Promise<null> => {
  try {
    await api.post<null>(`/communities/id/${id}/join`, memberConfig, {
      headers: { "X-Api-Token": initData },
    });
    return null;
  } catch (error) {
    console.error("Ошибка при присоединении к сообществу:", error);
    return null;
  }
};

export const leaveCommunity = async (
  initData: string,
  id: string
): Promise<null> => {
  try {
    await api.post(
      `/communities/id/${id}/leave`,
      {},
      {
        headers: { "X-Api-Token": initData },
      }
    );
    return null;
  } catch (error) {
    console.error("Ошибка при выходе из сообщества:", error);
    return null;
  }
};

export const searchMembers = async (
  initData: string,
  id: string,
  query: string
): Promise<Member[] | null> => {
  try {
    const response = await api.get<Member[]>(
      `/communities/id/${id}/members/search`,
      {
        params: {
          q: query,
        },
        headers: { "X-Api-Token": initData },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при поиске пользователей", error);
    return null;
  }
};

export const getMember = async (
  initData: string,
  communityId: string,
  memberId: string
): Promise<Member | null> => {
  try {
    const response = await api.get<Member>(
      `/communities/id/${communityId}/members/id/${memberId}`,
      {
        headers: { "X-Api-Token": initData },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении пользователя:", error);
    return null;
  }
};

export const getCommunityPreview = async (
  initData: string,
  id: string
): Promise<Community | null> => {
  try {
    const response = await api.get<Community>(`/communities/id/${id}/preview`, {
      headers: { "X-Api-Token": initData },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении пользователя:", error);
    return null;
  }
};

export const searchCommunities = async (
  initData: string,
  query: string
): Promise<Community[] | null> => {
  try {
    const response = await api.get<Community[]>(`/communities/search`, {
      headers: { "X-Api-Token": initData },
      params: {
        q: query,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при поиске сообществ:", error);
    return null;
  }
};
