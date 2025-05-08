import useCommunityPreview from "../hooks/communities/fetchHooks/useCommunityPreview";
import useInitDataStore from "../stores/InitData.store";
import { MemberConfig } from "../types/member/memberConfig.interface";
import DynamicForm from "../utils/dynamicForm";

const RegistrationPage = () => {
  const { initDataUser } = useInitDataStore();
  const { initDataStartParam: chatId } = useInitDataStore();
  const { data, isPending } = useCommunityPreview(chatId ?? "");
  const fields = data?.config.fields;

  const handleSubmit = async (data: MemberConfig) => {
    console.log("Данные формы:", data);
    alert(JSON.stringify(data));
  };

  if (isPending) return null;
  return (
    <DynamicForm
      fields={fields ?? []}
      onSubmit={handleSubmit}
      avatar={initDataUser?.photo_url}
    />
  );
};

export default RegistrationPage;
