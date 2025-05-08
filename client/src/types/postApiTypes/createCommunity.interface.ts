import { CommunityConfig } from "../community/communityConfig.interface";

export interface CreateCommunity {
  avatar: string;
  config: CommunityConfig;
  description: string;
  name: string;
}
