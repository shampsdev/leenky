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
}

export interface ChatData {
  id: string; // backend ID
  telegram_id: string;
  name: string | null;
  avatar: string | null;
  users: UserData[];
}

export interface ChatPreviewData {
  avatar: string | null;
  users_amount: string | null;
  name: string | null;
  id: string | null;
  telegram_id: string | null;
}
