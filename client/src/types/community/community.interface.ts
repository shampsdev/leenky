import { Member } from "../member/member.interface";
import { CommunityConfig } from "./communityConfig.interface";

export interface Community {
  avatar: string;
  config: CommunityConfig;
  description: string;
  id: string;
  membersCount: number;
  name: string;
  tgChatID: number;
  members: Member[];
}
