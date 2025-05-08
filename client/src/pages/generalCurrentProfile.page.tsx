import { handleImageError } from "../utils/imageErrorHandler";
import { useNavigate } from "react-router-dom";
import EBBComponent from "../components/enableBackButtonComponent";
import DevImage from "../assets/dev.png";
import FixedBottomButtonComponent from "../components/fixedBottomButton.component";
import useGetMe from "../hooks/users/fetchHooks/useGetMe";
import FieldsComponent from "../components/fields.component";

const GeneralCurrentProfilePage = () => {
  const { data, isLoading } = useGetMe();
  const userData = data?.user;

  const members = data?.members;

  const navigate = useNavigate();
  const goToEditProfilePage = () => {
    navigate("/profile/edit");
  };

  if (!data || isLoading) return null;
  return (
    <EBBComponent>
      <div className="flex flex-col h-screen">
        <div className="flex-1 overflow-y-auto w-[95%] mx-auto px-4">
          <div className="flex flex-col mt-6 items-center gap-4">
            <img
              className="w-[115px] h-[115px] rounded-full object-cover"
              src={userData?.avatar || DevImage}
              onError={handleImageError}
            />
            <div className="text-center">
              <p className="font-semibold inline-flex text-lg gap-2 items-center">
                {userData?.firstName} {userData?.lastName}
              </p>
              <p className="text-hint text-sm">
                {`@${userData?.telegramUsername}`}
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-[15px]">
            {members?.map((member, index) => (
              <FieldsComponent
                key={index}
                fields={member.config.fields}
                community={member.community}
              />
            ))}
          </div>
          {/* <div className="rounded-lg mt-4 mx-auto">
            <InfoBlockComponent>
              {textInputs.map((field, index) => (
                <InfoParagraphComponent
                  title={field.name}
                  content={field.value}
                  key={index}
                />
              ))}
            </InfoBlockComponent>
            <div className="px-4 text-hint mb-2 mt-4 text-sm">ПОДРОБНЕЕ</div>
            <InfoBlockComponent>
              {textAreas.map((field, index) => (
                <InfoParagraphComponent
                  title={field.name}
                  content={field.value}
                  key={index}
                />
              ))}
            </InfoBlockComponent>
          </div> */}
          <div className="pt-[40px] pb-[39px]"></div>
        </div>
      </div>
      <FixedBottomButtonComponent
        content="Редактировать"
        handleClick={goToEditProfilePage}
        state="active"
      />
    </EBBComponent>
  );
};

export default GeneralCurrentProfilePage;
