import EBBComponent from "../../components/enableBackButtonComponent";
import TGAvatarsClusterFirst from "../../assets/telegram_avatars_cluster_1.png";
import TGAvatarsClusterSecond from "../../assets/telegram_avatars_cluster_2.png";
import Nav from "../../assets/navigation.svg";

const CreateCommunityInitial = () => {
  return (
    <EBBComponent>
      <div className="max-w-[95%] max-h-[100vh] overflow-auto scroll-container mx-auto px-4">
        <div className=" mt-[25px] flex flex-col gap-[16px]">
          <div className="bg-[#F5F5F5] flex flex-row items-center justify-between px-[24px] py-[24px] rounded-[20px]">
            <div className="flex max-w-[90%] flex-row gap-[18px] items-center">
              <img src={TGAvatarsClusterFirst} className="max-w-[107px]" />
              <p className="text-[17px]">у вас уже есть чат в telegram</p>
            </div>
            <img src={Nav} />
          </div>

          <div className="bg-[#F5F5F5] flex flex-row items-center justify-between px-[24px] py-[24px] rounded-[20px]">
            <div className="flex flex-row max-w-[90%] gap-[18px] items-center">
              <img src={TGAvatarsClusterSecond} className="max-w-[107px]" />
              <p className="text-[17px]">сообщество без общего чата</p>
            </div>
            <img src={Nav} />
          </div>
        </div>
      </div>
    </EBBComponent>
  );
};

export default CreateCommunityInitial;
