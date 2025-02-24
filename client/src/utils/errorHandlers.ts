import DevImage from '@/assets/dev.png';
export const handleImageError = (event: any) => {
  const target = event.target as HTMLImageElement;
  if (target) {
    target.src = DevImage;
  }
};
