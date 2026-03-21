import { api } from "./api";

export const customForEmail = async (email: string) => {
  const response = await api.get(`/api/v1/customers?email=${email}`);
  return response.data;
};

export const saveCustomer = async (email: string, name: string, phone: string, password: string) => {
  const response = await api.post(`/api/v1/customers`, 
    { email, name, phone, password });
  return response;
};