import { useNavigate } from "react-router-dom";
import AboutComponent from "../components/about.component";
import AboutFirst from "../assets/about_1.png";
import AboutSecond from "../assets/about_2.png";
import DBBComponent from "../components/disableBackButton.component";
import EBBComponent from "../components/enableBackButtonComponent";
import useCreateMe from "../hooks/users/mutations/useCreateMe";
import AboutDecline from "../assets/about_decline.png";
import AboutThird from "../assets/about_third.png";
import useInitDataStore from "../stores/InitData.store";
export const AboutFirstPage = () => {
  const navigate = useNavigate();
  const goToNextPage = () => {
    navigate("/about/2");
  };
  return (
    <DBBComponent>
      <AboutComponent
        handleButtonClick={goToNextPage}
        imageSrc={AboutFirst}
        contentText={"Расширяйте круг полезных знакомств"}
        buttonText={"Далее"}
      />
    </DBBComponent>
  );
};

export const AboutSecondPage = () => {
  const navigate = useNavigate();
  const goToNextPage = () => {
    navigate("/about/3", { replace: true });
  };
  return (
    <EBBComponent>
      <AboutComponent
        handleButtonClick={goToNextPage}
        imageSrc={AboutSecond}
        contentText={
          "Рассказывайте о себе и узнавайте больше о других участниках чата"
        }
        buttonText={"Далее"}
      />
    </EBBComponent>
  );
};

export const AboutThirdPage = () => {
  const navigate = useNavigate();
  const { initData } = useInitDataStore();
  const createMeMutation = useCreateMe();

  const registerUser = async () => {
    console.log(initData);
    try {
      await createMeMutation.mutateAsync().finally(() => navigate("/"));
    } catch (error) {
      alert("Произошла ошибка при регистрации");
      console.error("Произошла ошибка при создании пользователя:", error);
    }
    navigate("/");
  };

  const goToDeclinePage = () => {
    navigate("/about/decline", { replace: true });
  };

  const goToPolicy = () => {
    navigate("/policy");
  };
  return (
    <DBBComponent>
      <AboutComponent
        handleButtonClick={registerUser}
        imageSrc={AboutThird}
        contentText={"Небольшая формальность прежде, чем мы начнём"}
        politics
        cancelButtonText="Отмена"
        handleCancelButtonClick={goToDeclinePage}
        buttonText={"Принимаю"}
        onPolicyClick={goToPolicy}
      />
    </DBBComponent>
  );
};

export const AboutDeclinePolicy = () => {
  const navigate = useNavigate();

  const { initData } = useInitDataStore();
  const createMeMutation = useCreateMe();

  const registerUser = async () => {
    console.log(initData);
    try {
      await createMeMutation.mutateAsync();
    } catch (error) {
      alert("Произошла ошибка при регистрации");
      console.error("Произошла ошибка при создании пользователя:", error);
    }
    navigate("/");
  };
  const goToPolicy = () => {
    navigate("/policy");
  };
  return (
    <DBBComponent>
      <AboutComponent
        handleButtonClick={registerUser}
        imageSrc={AboutDecline}
        politics
        contentText={
          "В таком случае вы не сможете перейти к приложению... уверены, что хотите выйти?"
        }
        handleCancelButtonClick={() => {}}
        onPolicyClick={goToPolicy}
        buttonText={"Принимаю"}
      />
    </DBBComponent>
  );
};
