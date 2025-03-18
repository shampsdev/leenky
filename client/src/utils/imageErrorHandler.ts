import DevImage from "../assets/dev.png";
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>
) => {
  const target = event.currentTarget;
  target.src = DevImage;
};
