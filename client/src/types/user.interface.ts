export interface ProfileUserData {
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  role: string | null;
  avatar: string | null;
  telegramUsername: string;
  bio: string | null;
}

export interface UserData extends ProfileUserData {
  id: string; // backend ID
  telegramId: string;
}

export interface ChatData {
  id: string; // backend ID
  telegram_id: string;
  name: string;
  avatar: string;
  users: UserData[];
}
