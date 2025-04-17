import { useNavigate } from "react-router-dom";
import AboutComponent from "../components/about.component";
import AboutFirst from "../assets/about_1.png";
import AboutSecond from "../assets/about_2.png";
import DBBComponent from "../components/disableBackButton.component";
import EBBComponent from "../components/enableBackButtonComponent";
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
          "Рассказывайте о себе и узнавайте больше о других участниках сообщества"
        }
        buttonText={"Далее"}
      />
    </EBBComponent>
  );
};
