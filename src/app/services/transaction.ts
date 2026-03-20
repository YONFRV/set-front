import { api } from "./api";

export const transactionForUserId = async (userId: string) => {
  const response = await api.get(`/api/v1/transaccion/historial/${userId}`);
  return response.data;
};

export const createTransaction = async (userId: string,fundId: string, amount: number, notificationPreference: 'EMAIL' | 'SMS') => {
  const response = await api.post(`/api/v1/transaccion/apertura`, 
    { userId, fundId, amount, notificationPreference });
  return response.data;
};

