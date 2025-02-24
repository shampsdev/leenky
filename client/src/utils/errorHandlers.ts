export const handleImageError = (event: any) => {
  const target = event.target as HTMLImageElement;
  if (target) {
    target.src = '/src/assets/dev.png';
  }
};
