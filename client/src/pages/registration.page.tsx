import useCommunityPreview from "../hooks/communities/fetchHooks/useCommunityPreview";
import useInitDataStore from "../stores/InitData.store";
import useGetMe from "../hooks/users/fetchHooks/useGetMe";
import { handleImageError } from "../utils/imageErrorHandler";
import DevImage from "../assets/dev.png";
import { useState } from "react";
import { fieldsToFieldValues } from "../mappers/FieldValues";
import { Field } from "../types/fields/field.interface";
import { MemberConfig } from "../types/member/memberConfig.interface";
import fieldsNotEmpty from "../utils/fieldsNotEmpty";
import ButtonComponent from "../components/button.component";
import InputFieldComponent from "../components/form/inputField.component";
import TextareaFieldComponent from "../components/form/textareaField.component";
import useJoinCommunity from "../hooks/communities/mutations/useJoinCommunity";
import { useNavigate } from "react-router-dom";

const RegistrationPage = () => {
  const { initDataStartParam: communityId } = useInitDataStore();
  const { data: communityData, isPending } = useCommunityPreview(
    communityId ?? ""
  );
  const { data: userData, isLoading } = useGetMe();

  if (isPending || isLoading) return null;

  const fields = communityData?.config.fields;

  const [stateFields, setStateFields] = useState<Field[]>(fields ?? []);

  const [isChanged, setIsChanged] = useState<boolean>(false);

  const handleFieldChange = (index: number, value: string) => {
    const updatedFields = [...stateFields];
    if (
      updatedFields[index].type === "textinput" &&
      updatedFields[index].textinput
    ) {
      updatedFields[index].textinput.default = value;
    } else if (
      updatedFields[index].type === "textarea" &&
      updatedFields[index].textarea
    ) {
      updatedFields[index].textarea.default = value;
    }
    setStateFields(updatedFields);
    setIsChanged(fieldsNotEmpty(fields ?? []));
  };

  const joinCommunityMutation = useJoinCommunity();
  const navigate = useNavigate();
  const handleSubmit = async () => {
    const config: MemberConfig = {
      fields: fieldsToFieldValues(stateFields),
    };

    await joinCommunityMutation.mutateAsync({
      communityId: communityId ?? "",
      memberConfig: config,
    });
    navigate(`/communities`, { replace: true });
    navigate(`/community/${communityId}`);
  };

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
      <div className="w-[95%] mx-auto py-4 px-4">
        <form
          className="w-full flex flex-col mt-[25px] gap-[12px] caret-[#20C86E]"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          {stateFields.map((field, index) => {
            if (field.type === "textarea")
              return (
                <TextareaFieldComponent
                  key={index}
                  title={field.title}
                  value={field.textarea?.default || ""}
                  maxLength={230}
                  onChangeFunction={(val: string) =>
                    handleFieldChange(index, val)
                  }
                />
              );
            else if (field.type === "textinput")
              return (
                <InputFieldComponent
                  key={index}
                  title={field.title}
                  value={field.textinput?.default || ""}
                  maxLength={40}
                  onChangeFunction={(val: string) =>
                    handleFieldChange(index, val)
                  }
                />
              );
          })}

          <div className="flex w-full justify-center pt-[20px]">
            <ButtonComponent
              content="Готово"
              state={isChanged ? "active" : "disabled"}
              handleClick={() => handleSubmit()}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
