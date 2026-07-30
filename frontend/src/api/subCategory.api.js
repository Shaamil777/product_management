import api from './axios';

export const getSubCategories = async (params) => {
  const response = await api.get('/subCategory', { params });
  return response.data;
};

export const getSubCategoryById = async (id) => {
  const response = await api.get(`/subCategory/${id}`);
  return response.data;
};

export const createSubCategory = async (data) => {
  const response = await api.post('/subCategory', data);
  return response.data;
};

export const updateSubCategory = async (id, data) => {
  const response = await api.put(`/subCategory/${id}`, data);
  return response.data;
};

export const deleteSubCategory = async (id) => {
  const response = await api.delete(`/subCategory/${id}`);
  return response.data;
};
