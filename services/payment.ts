import apiClient from "@/lib/api";
import { Payment, PaymentData } from "@/lib/types";

export const initiatePayment = async (data: PaymentData): Promise<Payment> => {
  const response = await apiClient.post("parking/payments/", data);
  return response.data;
};