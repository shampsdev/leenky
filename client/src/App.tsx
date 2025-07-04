import "./App.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo } from "react";
import { backButton } from "@telegram-apps/sdk-react";
import InitialPage from "./pages/initial.page";
import { AnimatePresence, motion } from "framer-motion";
import InitDataWrapper from "./utils/InitDataWrapper";
import ProtectedRoute from "./utils/protectedRoute";
import {
  AboutDeclinePolicy,
  AboutFirstPage,
  AboutSecondPage,
  AboutThirdPage,
} from "./pages/about.page";
import ChatPage from "./pages/community.page";
import CurrentProfilePage from "./pages/communityCurrentProfile.page";
import ProfilePage from "./pages/profile.page";
import CommunitiesPage from "./pages/communities.page";
import ProfileRedirection from "./utils/profileRedirection";
import RegistrationPage from "./pages/registration.page";
import InvitationPage from "./pages/invitation.page";
import EditProfileCommunityPage from "./pages/editProfileCommunity.page";
import CreateCommunityLayout from "./pages/create_community/createLayout";
import CreateCommunityInitial from "./pages/create_community/createCommunityInitial";
import CreateCommunityWithChatLayout from "./pages/create_community/withChat/createCommunityWithChatLayout";
import CreateCommunityWithoutChatLayout from "./pages/create_community/withoutChat/createCommunityWithoutChatLayout";
import CommunityWithoutChatDescriptionPage from "./pages/create_community/withoutChat/communityWithoutChatDescriptionPage";
import CommunityWithChatProfilePage from "./pages/create_community/withChat/communityWithChatProfilePage";
import CommunityWithChatDescriptionPage from "./pages/create_community/withChat/communityWithChatDescriptionPage";
import CommunityWithChatConnectPage from "./pages/create_community/withChat/communityWithChatConnectPage";
import CommunityWithoutChatProfilePage from "./pages/create_community/withoutChat/communityWithoutChatProfilePage";
import useCommunityWithChatInfoStore from "./stores/create_community/communityWithChatInfo.store";
import useCommunityWithoutChatInfoStore from "./stores/create_community/communityWithoutChatInfo.store";
import CommunityLinksPage from "./pages/create_community/communityLinksPage";
import CommunitySettingsPage from "./pages/community_settings/communitySettingsPage";
import CommunitySettingsProfilePage from "./pages/community_settings/communitySettingsProfilePage";
import CommunitySettingsChatPage from "./pages/community_settings/communitySettingsChatPage";
import CommunitySettingsDescriptionPage from "./pages/community_settings/communitySettingsDescriptionPage";
import CommunitySettingsLinksPage from "./pages/community_settings/communitySettingsLinksPage";
import CommunityWithChatSettingsDescriptionEditPage from "./pages/community_settings/communityWithChatSettingsDescriptionEditPage";
import CommunityWithoutChatSettingsDescriptionEditPage from "./pages/community_settings/communityWithoutChatSettingsDescriptionEditPage";
import PolicyPage from "./pages/policy.page";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.15 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.15 } },
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetStore: resetWithChatStore } = useCommunityWithChatInfoStore();
  const { resetStore: resetWithoutChatStore } =
    useCommunityWithoutChatInfoStore();
  const disableAnimation = useMemo(
    () =>
      location.pathname.startsWith("/community/create/with_chat") ||
      location.pathname.startsWith("/community/create/without_chat"),
    [location.pathname]
  );

  const setBackButtonHandler = useCallback(() => {
    backButton.onClick(() => {
      navigate(-1);
    });
  }, []);

  useEffect(() => setBackButtonHandler(), [setBackButtonHandler]);

  useEffect(() => {
    if (!location.pathname.startsWith("/community/create")) {
      resetWithChatStore();
      resetWithoutChatStore();
    }
  }, [location.pathname]);

  const routes = (
    <Routes location={location}>
      <Route element={<ProtectedRoute />}>
        <Route path="/communities" element={<CommunitiesPage />} />
        <Route path="/community/:communityId" element={<ChatPage />} />
        <Route
          path="/community/:communityId/settings"
          element={<CommunitySettingsPage />}
        />
        <Route
          path="/community/:communityId/settings/profile"
          element={<CommunitySettingsProfilePage />}
        />
        <Route
          path="/community/:communityId/settings/chat"
          element={<CommunitySettingsChatPage />}
        />
        <Route
          path="/community/:communityId/settings/links"
          element={<CommunitySettingsLinksPage />}
        />
        <Route
          path="/community/:communityId/settings/description"
          element={<CommunitySettingsDescriptionPage />}
        />

        <Route
          path="/community/:communityId/settings/description/edit/with_chat"
          element={<CommunityWithChatSettingsDescriptionEditPage />}
        />

        <Route
          path="/community/:communityId/settings/description/edit/without_chat"
          element={<CommunityWithoutChatSettingsDescriptionEditPage />}
        />

        <Route
          path="/community/:communityId/links"
          element={<CommunityLinksPage />}
        />
        <Route path="/community/create" element={<CreateCommunityLayout />}>
          <Route path="initial" element={<CreateCommunityInitial />} />
          <Route path="with_chat" element={<CreateCommunityWithChatLayout />}>
            <Route
              path="description"
              element={<CommunityWithChatDescriptionPage />}
            />
            <Route path="profile" element={<CommunityWithChatProfilePage />} />
            <Route
              path="connect_chat"
              element={<CommunityWithChatConnectPage />}
            />
          </Route>
          <Route
            path="without_chat"
            element={<CreateCommunityWithoutChatLayout />}
          >
            <Route
              path="description"
              element={<CommunityWithoutChatDescriptionPage />}
            />

            <Route
              path="profile"
              element={<CommunityWithoutChatProfilePage />}
            />
          </Route>
        </Route>

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
          path="/profile/current/:communityId/edit"
          element={<EditProfileCommunityPage />}
        />
        <Route path="/invite" element={<InvitationPage />} />
        <Route
          path="/registration/:communityId"
          element={<RegistrationPage />}
        />
      </Route>

      <Route path="/" element={<InitialPage />} />
      <Route path="/about/1" element={<AboutFirstPage />} />
      <Route path="/about/2" element={<AboutSecondPage />} />
      <Route path="/about/3" element={<AboutThirdPage />} />
      <Route path="/about/decline" element={<AboutDeclinePolicy />} />
      <Route path="/policy" element={<PolicyPage />} />
    </Routes>
  );

  return (
    <InitDataWrapper>
      <div className="bg-main w-[100vw] h-[100vh] overflow-y-auto">
        {disableAnimation ? (
          routes
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              style={{ height: "100%" }}
            >
              {routes}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </InitDataWrapper>
  );
}

export default App;
