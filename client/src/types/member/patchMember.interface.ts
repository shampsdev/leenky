import { MemberConfig } from "./memberConfig.interface";

export interface PatchMember {
  config: MemberConfig;
  id: string;
  isAdmin: boolean;
  userId: string;
}
