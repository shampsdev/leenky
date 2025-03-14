import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  BrowserRouter,
} from "react-router-dom";
import AboutPage from "./pages/about.page";
import ChatPage from "./pages/chat.page";
import CurrentProfilePage from "./pages/currentProfile.page";
import ChatsPage from "./pages/chats.page";
import { useCallback, useEffect } from "react";
import { getMe } from "./api/api";
import { backButton, initData } from "@telegram-apps/sdk-react";
import useUserStore from "./stores/user.store";
function App() {
  const navigate = useNavigate();
  const userStore = useUserStore();
  const checkAuth = useCallback(async () => {
    const userData = await getMe(initData.raw() ?? "");
    if (userData) {
      userStore.authenticate();
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
        <Route path="/" Component={ChatsPage} />
        <Route path="/profile" Component={CurrentProfilePage} />
        <Route path="/about" Component={AboutPage} />
        <Route path="/chat" Component={ChatPage} />
        <Route path="/chat/:chatId" Component={ChatPage} />
      </Routes>
    </>
  );
}

export default App;
