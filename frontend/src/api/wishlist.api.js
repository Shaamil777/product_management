import api from './axios';

export const getWishlist = async () => {
  const response = await api.get('/wishlist');
  return response.data;
};

export const toggleWishlist = async (productId) => {
  const response = await api.post(`/wishlist/${productId}`);
  return response.data;
};
