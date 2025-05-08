import { Member } from "../member/member.interface";
import { User } from "./user.interface";

export interface UserProfile {
  members: Member[];
  user: User;
}
