import { useNavigate, useParams } from "react-router-dom";
import EBBComponent from "../components/enableBackButtonComponent";
import RequireMembershipComponent from "../components/requireMembership.component";
import SearchBarComponent from "../components/searchBar.component";
import ChatPreviewComponent from "../components/chatPreview.component";
import { useEffect, useRef } from "react";
import useChatSearchStore from "../stores/chatSearch.store";
import ChatMemberCardComponent from "../components/chatMember.card.component";
import { motion } from "motion/react";
import NotFound from "../assets/notFound.svg";
import useSearchMembers from "../hooks/members/search/useSearchMembers";
import useCommunity from "../hooks/communities/fetchHooks/useСommunity";
import Loader from "../components/loader.component";
const containerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};
const CommunityPage = () => {
  const navigate = useNavigate();

  const { communityId } = useParams();

  const { getScroll, saveScroll, getSearchQuery, saveSearchQuery } =
    useChatSearchStore();

  const { data: chatData, isPending } = useSearchMembers(
    communityId ?? "",
    getSearchQuery(communityId ?? "")
  );

  const goToProfile = (memberId: string) => {
    navigate(`/community/${communityId}/member/${memberId}`);
  };

  const goToCommunitySettings = () => {
    navigate(`/community/${communityId}/settings`);
  };

  const {
    data: previewChatData,
    isSuccess,
    isPending: isCommunityPending,
  } = useCommunity(communityId ?? "");

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      saveScroll(communityId ?? "", scrollContainerRef.current.scrollTop);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: getScroll(communityId ?? ""),
          behavior: "smooth",
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isPending]);

  if (isPending || isCommunityPending) return <Loader />;
  return (
    <EBBComponent>
      <RequireMembershipComponent chatID={communityId}>
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="max-w-[95%]  max-h-[100vh] overflow-auto scroll-container mx-auto px-4"
        >
          {isSuccess && (
            <div className="flex relative items-center mt-[25px] justify-between gap-[15px] ">
              <ChatPreviewComponent
                chatData={previewChatData!}
                view={true}
                animated={true}
                index={0}
                onClick={() => goToCommunitySettings()}
              />
            </div>
          )}

          <SearchBarComponent
            value={getSearchQuery(communityId ?? "")}
            inputHandler={(value) => saveSearchQuery(communityId ?? "", value)}
            placeholder="Поиск участников"
            className="mt-[20px]"
          />

          <motion.ul
            className="flex flex-col gap-[12px] mt-[25px]"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {chatData?.map((user, index) => (
              <ChatMemberCardComponent
                animated
                onClick={() => goToProfile(user.user.id)}
                index={index}
                key={index}
                member={user}
              />
            ))}
          </motion.ul>

          {!chatData && !isPending && (
            <div className="flex w-full flex-col items-center text-center mt-[120px] gap-[20px]">
              <img src={NotFound} />

              <div className="flex flex-col items-center text-center gap-[8px]">
                <h1 className="font-semibold text-[20px]">Ничего не найдено</h1>
              </div>
            </div>
          )}
        </div>
      </RequireMembershipComponent>
    </EBBComponent>
  );
};

export default CommunityPage;
