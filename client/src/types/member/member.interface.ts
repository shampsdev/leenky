import { Community } from "../community/community.interface";
import { User } from "../user/user.interface";
import { MemberConfig } from "./memberConfig.interface";

export interface Member {
  community: Community;
  config: MemberConfig;
  isAdmin: boolean;
  user: User;
}
