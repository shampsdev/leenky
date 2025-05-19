import { useNavigate, useParams } from "react-router-dom";
import StarByak from "../../assets/star_buka.png";
import CopyFieldComponent from "../../components/copyField.component";
import { BOT_USERNAME } from "../../shared/constants";
import FixedBottomButtonComponent from "../../components/fixedBottomButton.component";
import { useState } from "react";
import useCommunity from "../../hooks/communities/fetchHooks/useСommunity";
import { downloadFile } from "@telegram-apps/sdk-react";
import QrIcon from "../../assets/qr.svg";
import DownloadIcon from "../../assets/download_black.svg";
const CommunitySettingsLinksPage = () => {
  const { communityId } = useParams();
  const { data: communityData } = useCommunity(communityId!);
  const [isQrShowing, setIsQrShowing] = useState<boolean>(false);
  const navigate = useNavigate();

  const downloadQRCode = async () => {
    const filename = `${communityData?.name || "qr-code"}.png`;

    if (downloadFile.isAvailable()) {
      await downloadFile(
        `https://api.qrserver.com/v1/create-qr-code/?data=https://t.me/${BOT_USERNAME}/app?startapp=${communityId}&amp;size=150x150`,
        filename
      );
    }
  };

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
          <div className="flex w-fill flex-row items-center px-[24px] py-[24px] justify-between bg-[#F5F5F5] gap-[16px] rounded-[14px]">
            <div
              onClick={downloadQRCode}
              className="flex gap-[10px] justify-center flex-1 items-center py-[12px] rounded-[14px] bg-white text-black "
            >
              <img src={DownloadIcon} alt="" className="" />
              <p className=" text-[15px] font-semibold">Скачать qr-код</p>
            </div>
            <img
              onClick={() => setIsQrShowing(true)}
              src={QrIcon}
              className=" bg-white p-[10.5px] object-fit rounded-[14px]"
            />
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
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?data=https://t.me/${BOT_USERNAME}/app?startapp=${communityId}&amp;size=150x150`}
            alt=""
            title=""
            className="max-w-[50%]"
          />
        </div>
      )}
      <div className="pb-[200px]"></div>
      <FixedBottomButtonComponent
        content={"Назад"}
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
