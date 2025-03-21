import "./App.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
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
import { AnimatePresence, motion } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
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
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          {...{
            initial: "initial",
            animate: "animate",
            exit: "exit",
            variants: pageVariants,
          }}
          style={{ height: "100%" }}
        >
          <Routes location={location}>
            <Route element={<ProtectedRoute />}>
              <Route path="/chats" element={<ChatsPage />} />
              <Route path="/chat/:chatId" element={<ChatPage />} />
              <Route path="/profile/:userId" element={<ProfilePage />} />
              <Route path="/profile" element={<CurrentProfilePage />} />
              <Route path="/profile/edit" element={<EditProfilePage />} />
              <Route path="/invite" element={<InvitationPage />} />
            </Route>
            <Route path="/" element={<InitialPage />} />
            <Route path="/about/1" element={<AboutFirstPage />} />
            <Route path="/about/2" element={<AboutSecondPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
