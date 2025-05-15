import { Outlet } from "react-router-dom";

const CreateCommunityWithoutChatLayout = () => {
  return (
    <>
      without chat <Outlet />
    </>
  );
};

export default CreateCommunityWithoutChatLayout;
