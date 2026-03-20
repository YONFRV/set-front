import { api } from "./api";

export const foundAll = async () => {
  const response = await api.get("/api/v1/fund/all-founts");
  return response.data;
};

export const foundForUserId = async (userId: string) => {
  const response = await api.get(`/api/v1/configuration-soft/${userId}`);
  return response.data;
};

