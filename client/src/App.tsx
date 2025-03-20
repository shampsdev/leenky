import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AboutFirstPage, AboutSecondPage } from "./pages/about.page";
import ChatPage from "./pages/chat.page";
import ChatsPage from "./pages/chats.page";
import { useCallback, useEffect } from "react";
import { getMePreview } from "./api/api";
import { backButton, initData } from "@telegram-apps/sdk-react";
import useUserStore from "./stores/user.store";
import ProtectedRoute from "./components/protectedRoute.component";
import CurrentProfilePage from "./pages/currentProfile.page";
import EditProfilePage from "./pages/editProfile.page";
import RegistrationPage from "./pages/registration.page";
import InitialPage from "./pages/initial.page";
import InvitationPage from "./pages/invitation.page";
import ProfilePage from "./pages/profile.page";
function App() {
  const navigate = useNavigate();
  const userStore = useUserStore();

  const checkAuth = async () => {
    const userData = await getMePreview(initData.raw() ?? "");
    if (userData?.isRegistered) {
      userStore.authenticate();
      userStore.setIsLoading(false);
      userStore.updateUserData(userData);
    } else {
      userStore.setIsLoading(false);
    }
  };

  const setBackButtonHandler = useCallback(() => {
    backButton.onClick(() => {
      navigate(-1);
    });
  }, []);

  useEffect(() => {
    checkAuth();
    setBackButtonHandler();
  }, []);
  return (
    <div className="bg-main w-[100vw] h-[100vh] overflow-y-auto">
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/chats" Component={ChatsPage} />
          <Route path="/chat/:chatId" Component={ChatPage} />
          <Route path="/profile/:userId" Component={ProfilePage} />
          <Route path="/profile" Component={CurrentProfilePage} />
          <Route path="/profile/edit" Component={EditProfilePage} />
          <Route path="/invite" Component={InvitationPage} />
        </Route>
        <Route path="/" Component={InitialPage} />
        <Route path="/about/1" Component={AboutFirstPage} />
        <Route path="/about/2" Component={AboutSecondPage} />
        <Route path="/registration" Component={RegistrationPage} />
      </Routes>
    </div>
  );
}

export default App;
