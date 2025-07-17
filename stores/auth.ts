import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { loginUser } from "@/services/auth";
import { LoginCredentials, User } from "@/lib/types";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: async (credentials) => {
    const { access, refresh } = await loginUser(credentials);
    await SecureStore.setItemAsync("access", access);
    await SecureStore.setItemAsync("refresh", refresh);
    const decoded: User = jwtDecode(access);
    set({
      accessToken: access,
      refreshToken: refresh,
      isAuthenticated: true,
      isLoading: false,
      user: decoded,
    });
    console.log("user logged in successfully");
  },
  logout: async () => {
    await SecureStore.deleteItemAsync("access");
    await SecureStore.deleteItemAsync("refresh");
    set({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      user: null,
    });
  },
  initialize: async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("access");
      const refreshToken = await SecureStore.getItemAsync("refresh");

      if (accessToken && refreshToken) {
        const decoded: User = jwtDecode(accessToken);
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
          user: decoded,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (e) {
      set({ isLoading: false });
    }
  },
}));
