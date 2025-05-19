import { ReactNode } from "react";
import { Navigate, useParams } from "react-router-dom";
import useUserStore from "../stores/user.store";

const ProfileRedirection = ({ children }: { children: ReactNode }) => {
  const { communityId, memberId } = useParams();
  const userStore = useUserStore();

  if (
    memberId &&
    userStore.userData?.id &&
    memberId === userStore.userData.id
  ) {
    return <Navigate to={`/profile/current/${communityId}`} replace />;
  }

  return <>{children}</>;
};

export default ProfileRedirection;
