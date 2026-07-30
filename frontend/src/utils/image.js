export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80';
  }
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  return `${baseUrl}/${cleanPath}`;
};
