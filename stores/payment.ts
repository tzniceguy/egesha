import { create } from "zustand";
import { initiatePayment } from "@/services/payment";
import { Payment, PaymentData } from "@/lib/types";

interface PaymentState {
  payment: Payment | null;
  isLoading: boolean;
  initiatePayment: (data: PaymentData) => Promise<Payment>;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  payment: null,
  isLoading: false,
  initiatePayment: async (data) => {
    set({ isLoading: true });
    try {
      const payment = await initiatePayment(data);
      set({ payment, isLoading: false });
      return payment;
    } catch (error) {
      console.error("Failed to initiate payment:", error);
      set({ isLoading: false });
      throw error;
    }
  },
}));