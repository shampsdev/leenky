import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AboutFirstPage, AboutSecondPage } from "./pages/about.page";
import ChatPage from "./pages/chat.page";
import ChatsPage from "./pages/chats.page";
import { useCallback, useEffect } from "react";
import { getMe } from "./api/api";
import { backButton, initData } from "@telegram-apps/sdk-react";
import useUserStore from "./stores/user.store";
import ProtectedRoute from "./components/protectedRoute.component";
import CurrentProfilePage from "./pages/currentProfile.page";
import EditProfilePage from "./pages/editProfile.page";
import RegistrationPage from "./pages/registration.page";
import InitialPage from "./pages/initial.page";
function App() {
  const navigate = useNavigate();
  const userStore = useUserStore();

  const checkAuth = useCallback(async () => {
    const userData = await getMe(initData.raw() ?? "");
    console.log(userData);
    if (userData) {
      userStore.authenticate();
      userStore.setIsLoading(false);
      userStore.updateUserData(userData);
    } else {
      userStore.setIsLoading(false);
    }
  }, [userStore]);

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
    <>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/chats" Component={ChatsPage} />
          <Route path="/chats/:chatId" Component={ChatPage} />
          <Route path="/profile" Component={CurrentProfilePage} />
          <Route path="/profile/edit" Component={EditProfilePage} />
        </Route>
        <Route path="/" Component={InitialPage} />
        <Route path="/about/1" Component={AboutFirstPage} />
        <Route path="/about/2" Component={AboutSecondPage} />
        <Route path="/registration" Component={RegistrationPage} />
      </Routes>
    </>
  );
}

export default App;
