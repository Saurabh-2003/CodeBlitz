import { User } from "@prisma/client";
import { createStore } from "zustand";

export type profileType = {
  user: User | null;
  success: boolean | null;
  error: boolean | null;
  isAuthenticated: boolean | null;
  message: string | null;
  setUser: (user: User | null) => void; // Accept a user object
};

export const defaultProfileState: profileType = {
  user: null,
  success: null,
  error: null,
  isAuthenticated: null,
  message: null,
  setUser: (user: User | null) => {}, // Provide a default implementation
};

export const createProfileStore = (
  initState: profileType = defaultProfileState,
) => {
  return createStore<profileType>()((set) => ({
    ...initState,
    setUser: (user: User | null) => set((state) => ({ user })), // Update state with new user
  }));
};
