import { useNavigate, useParams } from "react-router-dom";
import StarByak from "../../assets/star_buka.png";
import CopyFieldComponent from "../../components/copyField.component";
import { BOT_USERNAME } from "../../shared/constants";
import FixedBottomButtonComponent from "../../components/fixedBottomButton.component";
import { useState } from "react";
import useCommunity from "../../hooks/communities/fetchHooks/useСommunity";
import { QRCodeSVG } from "qrcode.react";
const CommunitySettingsLinksPage = () => {
  const { communityId } = useParams();
  const { data: communityData } = useCommunity(communityId!);
  const [isQrShowing, setIsQrShowing] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <div className="w-[95%] mx-auto px-4 overflow-y-auto ">
      {!isQrShowing && (
        <div className="flex mt-[25px] flex-col  justify-center gap-[24px]">
          <div className="flex flex-col justify-center gap-[12px] items-center py-[24px]">
            <img className="max-w-[60%]" src={StarByak} alt="" />
            <div className="text-center text-[20px] font-semibold"></div>
          </div>

          <div className="flex flex-col gap-[16px]">
            <p className="text-[17px] text-[#707579] px-[12px]">
              Ссылка для вашего сообщества
            </p>
            <CopyFieldComponent
              content={`https://t.me/${BOT_USERNAME}/app?startapp=${communityId}`}
              link
            />
          </div>

          <div
            onClick={() => {
              setIsQrShowing(true);
            }}
          >
            QRRR
          </div>
        </div>
      )}
      {isQrShowing && (
        <div className="flex flex-col items-center justify-center gap-[28px] h-screen">
          <div className="flex flex-col gap-[6px] text-center ">
            <p>{communityData?.name}</p>
            <p className="text-[15px] text-[#707579]">
              qr-код для присоединения
            </p>
          </div>
          <QRCodeSVG
            size={150}
            value={`https://t.me/${BOT_USERNAME}/app?startapp=${communityId}`}
          />
        </div>
      )}
      <FixedBottomButtonComponent
        content={isQrShowing ? "Назад" : "К профилю"}
        state={isQrShowing ? "disabled" : "active"}
        handleClick={() => {
          if (isQrShowing) {
            setIsQrShowing(false);
          } else {
            navigate(-1);
          }
        }}
      />
    </div>
  );
};

export default CommunitySettingsLinksPage;
