import useCommunityPreview from "../hooks/communities/fetchHooks/useCommunityPreview";

export interface EditCardComponentProps {
  communityId: string;
}

const EditCardComponent = (props: EditCardComponentProps) => {
  const { isPending } = useCommunityPreview(props.communityId ?? "");
  // const fields = data?.config.fields;
  // const handleSubmit = async () => {
  //   alert("АХАХХАХАХАХ А РУЧКИ ТО НЕТУ)))))");
  // };

  if (isPending) return null;

  return <>а тут должна быть форма</>;
};

export default EditCardComponent;
