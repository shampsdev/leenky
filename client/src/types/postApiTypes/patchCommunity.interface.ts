import { CommunityConfig } from "../community/communityConfig.interface";

export interface PatchCommunity {
  avatar: string;
  config: CommunityConfig;
  description: string;
  id: string;
  name: string;
  tgChatID: number;
}
