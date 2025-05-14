import useCommunityPreview from "../hooks/communities/fetchHooks/useCommunityPreview";
import useInitDataStore from "../stores/InitData.store";
import useGetMe from "../hooks/users/fetchHooks/useGetMe";
import { handleImageError } from "../utils/imageErrorHandler";
import DevImage from "../assets/dev.png";
const RegistrationPage = () => {
  const { initDataStartParam: chatId } = useInitDataStore();
  const { isPending } = useCommunityPreview(chatId ?? "");
  const { data: userData, isLoading } = useGetMe();
  // const useJoinCommunityMutation = useJoinCommunity();
  // const handleSubmit = async (data: MemberConfig) => {
  //   await useJoinCommunityMutation.mutateAsync({
  //     communityId: communityId!,
  //     memberConfig: data,
  //   });
  //   navigate("/communities");
  // };

  if (isPending || isLoading) return null;

  return (
    <div className="flex flex-col mt-6 items-center gap-4">
      <img
        className="w-[115px] h-[115px] rounded-full object-cover"
        src={userData?.user?.avatar || DevImage}
        onError={handleImageError}
      />
      <div className="text-center">
        <p className="font-semibold inline-flex text-lg gap-2 items-center">
          {userData?.user?.firstName} {userData?.user?.lastName}
        </p>
        <p className="text-hint text-sm">{`@${userData?.user?.telegramUsername}`}</p>
      </div>
    </div>
  );
  {
    /* </><DraggableForm fields={fields || []} />; */
  }
};

export default RegistrationPage;
