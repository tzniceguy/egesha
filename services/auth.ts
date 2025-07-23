import apiClient from "@/lib/api";
import {
  LoginCredentials,
  RegistrationData,
  OtpVerificationData,
} from "@/lib/types";

export const registerUser = async (data: RegistrationData) => {
  const response = await apiClient.post("auth/register/", data);
  return response.data;
  console.log("User registered successfully");
};

export const verifyOtp = async (data: OtpVerificationData) => {
  const response = await apiClient.post("auth/verify-otp/", data);
  return response.data;
};

export const loginUser = async (credentials: LoginCredentials) => {
  const response = await apiClient.post("auth/login/", credentials);
  return response.data;
};

export const getProfile = async () => {
  const response = await apiClient.get("auth/profile/me/");
  return response.data;
};