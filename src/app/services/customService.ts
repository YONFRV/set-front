import { api } from "./api";

export const customForEmail = async (email: string) => {
  const response = await api.get(`/api/v1/customers?email=${email}`);
  return response.data;
};