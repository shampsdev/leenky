import useCommunityPreview from "../hooks/communities/fetchHooks/useCommunityPreview";
import DynamicForm from "../utils/dynamicForm";

export interface EditCardComponentProps {
  communityId: string;
}

const EditCardComponent = (props: EditCardComponentProps) => {
  const { data, isPending } = useCommunityPreview(props.communityId ?? "");
  const fields = data?.config.fields;
  const handleSubmit = async () => {
    alert("АХАХХАХАХАХ А РУЧКИ ТО НЕТУ)))))");
  };

  if (isPending) return null;

  return <DynamicForm fields={fields ?? []} onSubmit={handleSubmit} />;
};

export default EditCardComponent;
