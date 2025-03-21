import { useNavigate } from "react-router-dom";
import { ChatMemverComponentProps } from "./chatMember.component";
import { handleImageError } from "../utils/imageErrorHandler";
import DevImage from "../assets/dev.png";
import InfoBlockComponent from "./infoBlock.component";
import useUserStore from "../stores/user.store";
// const ChatMemberCardComponent = (props: ChatMemverComponentProps) => {
//   const navigate = useNavigate();
//   return (
//     <>
//       <li
//         className="chat-item rounded-[15px] relative flex w-full items-stretch gap-[7px] cursor-pointer overflow-hidden"
//         onClick={() => {
//           navigate(`/profile/${props.userData.id}`);
//         }}
//       >
//         <div className="chat-content flex items-center gap-[7px] w-full transition-transform duration-300 ">
//           <div className="flex flex-col h-[85%] items-center ">
//             <img
//               src={props.userData.avatar || DevImage}
//               onError={handleImageError}
//               className="w-[70px] h-[70px] rounded-full aspect-square object-cover"
//             />
//             <div className="flex-grow"></div>
//             <ButtonComponent
//               content={
//                 <img src={TGWhite} className="min-w-[15px] min-h-[15px]" />
//               }
//               handleClick={() => console.log("")}
//               state={"previewMessage"}
//             />
//           </div>
//           <InfoBlockComponent>
//             <div className="flex flex-col w-full pl-[3px]  py-[12px] divide-y-[1px] divide-[#a1aab2]  ">
//               <div className="flex flex-row justify-between pb-[4px]">
//                 <p className="font-normal text-[17px]">
//                   {props.userData.firstName} {props.userData.lastName}
//                 </p>
//                 <img src={NavArrow} />
//               </div>
//               <div className="flex flex-col gap-[2px] pt-[2px]">
//                 <p className="text-hint   text-[15px]">
//                   {props.userData.company}
//                 </p>

//                 <p className="text-hint font-light text-[15px]">
//                   {props.userData.role}
//                 </p>
//                 <p className="text-hint font-light text-[15px] mt-[3px]">
//                   {props.userData.bio && props.userData.bio.length > 40
//                     ? props.userData.bio.slice(0, 40) + "..."
//                     : props.userData.bio}
//                 </p>
//               </div>
//             </div>
//           </InfoBlockComponent>
//         </div>
//       </li>
//     </>
//   );
// };

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
        className="chat-item rounded-[15px] relative flex flex-col w-full border-[1px] border-[#a1aab2] items-center gap-[7px] cursor-pointer overflow-hidden"
        onClick={goToProfile}
      >
        <div className="chat-content flex flex-col items-center gap-[5px] w-full p-[5px] ">
          <div className="flex w-full gap-[10px]  items-center justify-between flex-row">
            <img
              src={props.userData.avatar || DevImage}
              onError={handleImageError}
              className="w-[70px] h-[70px] rounded-full aspect-square object-cover"
            />
            <InfoBlockComponent className="flex-1">
              <div className="flex flex-col w-[90%] pl-[3px]  py-[12px] divide-y-[1px] divide-[#a1aab2]  ">
                <div className="flex flex-row justify-between pb-[4px]">
                  <p className="font-normal text-[17px]">
                    {props.userData.firstName} {props.userData.lastName}
                  </p>
                </div>
                <div className="flex flex-col gap-[2px] pt-[2px]">
                  <p className="text-hint   text-[15px]">
                    {props.userData.company}
                  </p>
                  <p className="text-hint font-light text-[15px]">
                    {props.userData.role}
                  </p>
                </div>
              </div>
            </InfoBlockComponent>
          </div>

          <InfoBlockComponent>
            <div className="flex flex-col w-full pl-[3px]  py-[12px] divide-y-[1px] divide-[#a1aab2]  ">
              <div className="flex flex-col gap-[2px] pt-[2px]">
                <p className="text-hint font-light text-[15px] mt-[3px]">
                  {props.userData.bio && props.userData.bio.length > 120
                    ? props.userData.bio.slice(0, 120) + "..."
                    : props.userData.bio}
                </p>
              </div>
            </div>
          </InfoBlockComponent>
        </div>
      </li>
    </>
  );
};

export default ChatMemberCardComponent;
