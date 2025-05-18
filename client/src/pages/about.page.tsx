import { useNavigate } from "react-router-dom";
import AboutComponent from "../components/about.component";
import AboutFirst from "../assets/about_1.png";
import AboutSecond from "../assets/about_2.png";
import DBBComponent from "../components/disableBackButton.component";
import EBBComponent from "../components/enableBackButtonComponent";
import useCreateMe from "../hooks/users/mutations/useCreateMe";

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
  const goToRegistration = () => {
    navigate("/registration");
  };
  return (
    <EBBComponent>
      <AboutComponent
        handleButtonClick={goToRegistration}
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
  const createMeMutation = useCreateMe();

  const registerUser = async () => {
    try {
      const response = await createMeMutation.mutateAsync();
      navigate("/");
    } catch (error) {
      alert("Произошла ошибка при регистрации");
      console.error("Произошла ошибка при создании пользователя:", error);
    }
  };

  const goToDeclinePage = () => {
    navigate("/registration/decline");
  };
  return (
    <EBBComponent>
      <AboutComponent
        handleButtonClick={registerUser}
        imageSrc={AboutSecond}
        contentText={"Небольшая формальность прежде, чем мы начнём"}
        politics
        cancelButtonText="Отмена"
        handleCancelButtonClick={goToDeclinePage}
        buttonText={"Принимаю"}
      />
    </EBBComponent>
  );
};

export const AboutDeclinePolicy = () => {
  const navigate = useNavigate();
  const goToRegistration = () => {
    navigate("/registration");
  };

  const createMeMutation = useCreateMe();

  const registerUser = async () => {
    try {
      const response = await createMeMutation.mutateAsync();
      navigate("/");
    } catch (error) {
      alert("Произошла ошибка при регистрации");
      console.error("Произошла ошибка при создании пользователя:", error);
    }
  };

  const decline = () => {};
  return (
    <EBBComponent>
      <AboutComponent
        handleButtonClick={goToRegistration}
        imageSrc={AboutSecond}
        politics
        contentText={
          "В таком случае вы не сможете перейти к приложению... уверены, что хотите выйти?"
        }
        buttonText={"Принимаю"}
      />
    </EBBComponent>
  );
};
