import useCommunityPreview from "../hooks/communities/fetchHooks/useCommunityPreview";
import useInitDataStore from "../stores/InitData.store";
import useGetMe from "../hooks/users/fetchHooks/useGetMe";
import { handleImageError } from "../utils/imageErrorHandler";
import DevImage from "../assets/dev.png";
import { useState } from "react";
import { fieldsToFieldValues } from "../mappers/FieldValues";
import { MemberConfig } from "../types/member/memberConfig.interface";
import ButtonComponent from "../components/button.component";
import InputFieldComponent from "../components/form/inputField.component";
import TextareaFieldComponent from "../components/form/textareaField.component";
import useJoinCommunity from "../hooks/communities/mutations/useJoinCommunity";
import { useNavigate } from "react-router-dom";
import { FieldType } from "../types/fields/field.type";
import { FieldValue } from "../types/fields/fieldValue.interface";
import fieldsAreEqual from "../utils/equalFields";

const RegistrationPage = () => {
  const { initDataStartParam: communityId } = useInitDataStore();
  const { data: communityData, isPending } = useCommunityPreview(
    communityId ?? ""
  );
  const { data: userData, isLoading } = useGetMe();

  if (isPending || isLoading) return null;

  const orderedFieldsPattern = communityData?.config.fields;
  const baseValues = fieldsToFieldValues(orderedFieldsPattern!);
  const [fields, setFields] = useState<Record<string, FieldValue>>(baseValues);

  const [isChanged, setIsChanged] = useState<boolean>(false);

  const handleFieldChange = (title: string, value: string, type: FieldType) => {
    const updatedFields: Record<string, FieldValue> = structuredClone(fields);
    updatedFields[title][type]!.value = value;
    setIsChanged(!fieldsAreEqual(updatedFields, baseValues));
    console.log(isChanged);
    setFields(updatedFields);
  };

  const joinCommunityMutation = useJoinCommunity();
  const navigate = useNavigate();
  const handleSubmit = async () => {
    if (isChanged) {
      const config: MemberConfig = {
        fields: fields,
      };

      await joinCommunityMutation.mutateAsync({
        communityId: communityId ?? "",
        memberConfig: config,
      });
      navigate(`/communities`, { replace: true });
      navigate(`/community/${communityId}`);
    }
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
          {orderedFieldsPattern &&
            orderedFieldsPattern.map((field, index) => {
              if (field.type === "textarea") {
                return (
                  <TextareaFieldComponent
                    key={index}
                    title={field.title}
                    value={fields[field.title][field.type]?.value || ""}
                    maxLength={230}
                    onChangeFunction={(val: string) =>
                      handleFieldChange(field.title, val, field.type)
                    }
                  />
                );
              }

              if (field.type === "textinput") {
                return (
                  <InputFieldComponent
                    key={index}
                    title={field.title}
                    value={fields[field.title][field.type]?.value || ""}
                    maxLength={40}
                    onChangeFunction={(val: string) =>
                      handleFieldChange(field.title, val, field.type)
                    }
                  />
                );
              }
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
