import axios from "axios";

const API_URL = "http://localhost:8082/api";

export const getOrders = async () => {
  const response = await axios.get(`${API_URL}/orders`);
  return response.data;
};

export const addOrder = async (order) => {
  const response = await axios.post(`${API_URL}/add`, order);
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await axios.delete(`${API_URL}/delete/${id}`);
  return response.data;
};

export const updateOrder = async (id, order) => {
  const response = await axios.put(`${API_URL}/update/${id}`, order);
  return response.data;
};

export const getRegularBill = async () => {
  const response = await axios.get(`${API_URL}/totalRegularBill`);
  return response.data;
};

export const getDiscountedBill = async () => {
  const response = await axios.get(`${API_URL}/totalDiscountedBill`);
  return response.data;
};
