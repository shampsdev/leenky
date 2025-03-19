export interface ProfileUserData {
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  role: string | null;
  avatar: string | null;
  telegramUsername: string | null;
  bio: string | null;
}

export interface UserData extends ProfileUserData {
  id: string | null; // backend ID
  telegramId: string | null;
  isRegistered: boolean;
}

export interface ChatData {
  id: string; // backend ID
  telegramId: string;
  name: string | null;
  avatar: string | null;
  users: UserData[];
}

export interface ChatPreviewData {
  avatar: string | null;
  usersAmount: string | null;
  name: string | null;
  id: string | null;
  telegramId: string | null;
  isMember: boolean | null;
}
