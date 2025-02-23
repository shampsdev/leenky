export const handleImageError = (event: any) => {
  event.target.src = '';
  event.target.classList.add('bg-gray-300');
};
