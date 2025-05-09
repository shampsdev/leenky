import "./App.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { backButton } from "@telegram-apps/sdk-react";
import InitialPage from "./pages/initial.page";
import { AnimatePresence, motion } from "framer-motion";
import InitDataWrapper from "./utils/InitDataWrapper";
import ProtectedRoute from "./utils/protectedRoute";
import { AboutFirstPage, AboutSecondPage } from "./pages/about.page";
import ChatPage from "./pages/community.page";
import CurrentProfilePage from "./pages/communityCurrentProfile.page";
import ProfilePage from "./pages/profile.page";
import CommunitiesPage from "./pages/communities.page";
import ProfileRedirection from "./utils/profileRedirection";
import GeneralCurrentProfilePage from "./pages/generalCurrentProfile.page";
import RegistrationPage from "./pages/registration.page";
import InvitationPage from "./pages/invitation.page";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.15 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.15 } },
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const setBackButtonHandler = useCallback(() => {
    backButton.onClick(() => {
      navigate(-1);
    });
  }, [navigate]);

  useEffect(() => {
    setBackButtonHandler();
  }, []);

  return (
    <InitDataWrapper>
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
                <Route path="/communities" element={<CommunitiesPage />} />
                <Route path="/community/:communityId" element={<ChatPage />} />
                <Route
                  path="/community/:communityId/member/:memberId"
                  element={
                    <ProfileRedirection>
                      <ProfilePage />
                    </ProfileRedirection>
                  }
                />
                <Route
                  path="/profile/current/:communityId"
                  element={<CurrentProfilePage />}
                />
                <Route
                  path="/profile/current/"
                  element={<GeneralCurrentProfilePage />}
                />
                {/* <Route path="/profile/edit" element={<EditProfilePage />} /> */}
                <Route path="/invite" element={<InvitationPage />} />
                <Route
                  path="/registration/:communityId"
                  element={<RegistrationPage />}
                />
              </Route>
              <Route path="/" element={<InitialPage />} />
              <Route path="/about/1" element={<AboutFirstPage />} />
              <Route path="/about/2" element={<AboutSecondPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
    </InitDataWrapper>
  );
}

export default App;
