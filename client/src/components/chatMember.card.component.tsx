import { useNavigate } from "react-router-dom";
import { ChatMemverComponentProps } from "./chatMember.component";
import { handleImageError } from "../utils/imageErrorHandler";
import DevImage from "../assets/dev.png";
import useUserStore from "../stores/user.store";
import NavImage from "../assets/navigation.svg";
import Case from "../assets/case.svg";
import Person from "../assets/person.svg";
const ChatMemberCardComponent = (props: ChatMemverComponentProps) => {
  const navigate = useNavigate();
  const userStore = useUserStore();
  const goToProfile = () => {
    if (props.userData.id !== userStore.userData.id) {
      navigate(`/profile/${props.userData.id}`);
    } else {
      navigate(`/profile`);
    }
  };

  return (
    <>
      <li
        className=" relative rounded-[18px] flex flex-col w-full items-center cursor-pointer overflow-hidden"
        onClick={goToProfile}
      >
        <div className="bg-form flex flex-col px-[10px] rounded-[12px] divide-y divide-[#D9D9D9] items-center  w-full py-[15px] ">
          <div className="flex w-full gap-[10px]  items-center justify-between flex-row pb-[10px]">
            <img
              src={props.userData.avatar || DevImage}
              onError={handleImageError}
              className="w-[70px] h-[70px] rounded-full aspect-square object-cover"
            />
            <div className="flex-1 ">
              <div className="flex flex-col w-[90%] ">
                <p className="font-normal text-[17px]">
                  {props.userData.firstName} {props.userData.lastName}
                </p>

                <div className="flex flex-col">
                  <p className="text-hint flex gap-[4px] text-[13px]">
                    <img src={Case} />
                    {props.userData.company}
                  </p>
                  <p className="text-hint flex gap-[4px] text-[13px]">
                    <img src={Person} />
                    {props.userData.role}
                  </p>
                </div>
              </div>
            </div>
            <img src={NavImage} />
          </div>

          <p className="text-hint font-light text-[13px] pt-[10px]">
            {props.userData.bio && props.userData.bio.length > 90
              ? props.userData.bio.slice(0, 90) + "..."
              : props.userData.bio}
          </p>
        </div>
      </li>
    </>
  );
};

export default ChatMemberCardComponent;
