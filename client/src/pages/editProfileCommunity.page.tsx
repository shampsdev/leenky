import useGetMe from "../hooks/users/fetchHooks/useGetMe";
import { handleImageError } from "../utils/imageErrorHandler";
import DevImage from "../assets/dev.png";
import InputFieldComponent from "../components/form/inputField.component";
import TextareaFieldComponent from "../components/form/textareaField.component";
import { useNavigate, useParams } from "react-router-dom";
import { Member } from "../types/member/member.interface";
import { useState } from "react";
import fieldsAreEqual from "../utils/equalFields";
import usePatchMember, {
  PatchMemberArgs,
} from "../hooks/members/mutations/usePatchMember";
import { MemberConfig } from "../types/member/memberConfig.interface";
import { FieldValue } from "../types/fields/fieldValue.interface";
import { FieldType } from "../types/fields/field.type";
import useCommunity from "../hooks/communities/fetchHooks/useСommunity";
import FixedBottomButtonComponent from "../components/fixedBottomButton.component";

const EditProfileCommunityPage = () => {
  const navigate = useNavigate();
  const { communityId } = useParams();
  const { data: userData, isSuccess } = useGetMe();
  const { data: communityData } = useCommunity(communityId ?? "");
  if (!isSuccess) return null;

  const memberUserData = userData?.members.find((memberData: Member) => {
    return memberData.community.id == communityId;
  });

  const fieldValues = memberUserData?.config.fields;
  const orderedFieldsPattern = communityData?.config.fields;

  const [fields, setFields] = useState<Record<string, FieldValue>>(
    fieldValues ?? {}
  );

  const [isChanged, setIsChanged] = useState<boolean>(false);

  const handleFieldChange = (title: string, value: string, type: FieldType) => {
    const updatedFields: Record<string, FieldValue> = structuredClone(fields);
    updatedFields[title][type]!.value = value;

    setIsChanged(!fieldsAreEqual(updatedFields, fieldValues!));
    setFields(updatedFields);
  };

  const patchMemberMutation = usePatchMember();
  const handleSubmit = async () => {
    if (isChanged) {
      const config: MemberConfig = {
        fields: fields,
      };

      const newMemberData: PatchMemberArgs = {
        communityId: communityId ?? "",
        memberId: userData?.user.id ?? "",
        newData: {
          config: config,
          id: communityId ?? "",
          isAdmin: communityData?.members.find(
            (member) => member.user.id == userData?.user.id
          )?.isAdmin!,
          userId: userData?.user.id ?? "",
        },
      };
      await patchMemberMutation.mutateAsync(newMemberData);
    }

    navigate(-1);
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
          autoComplete="off"
          spellCheck={false}
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
          <FixedBottomButtonComponent
            content="Готово"
            state={isChanged ? "active" : "disabled"}
            handleClick={() => handleSubmit()}
          />
        </form>
      </div>
    </div>
  );
};

export default EditProfileCommunityPage;
