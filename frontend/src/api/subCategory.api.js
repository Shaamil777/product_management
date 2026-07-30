import api from './axios';

export const getSubCategories = async (params) => {
  const response = await api.get('/subcategories', { params });
  return response.data;
};

export const getSubCategoryById = async (id) => {
  const response = await api.get(`/subcategories/${id}`);
  return response.data;
};

export const createSubCategory = async (data) => {
  const response = await api.post('/subcategories', data);
  return response.data;
};

export const updateSubCategory = async (id, data) => {
  const response = await api.put(`/subcategories/${id}`, data);
  return response.data;
};

export const deleteSubCategory = async (id) => {
  const response = await api.delete(`/subcategories/${id}`);
  return response.data;
};
