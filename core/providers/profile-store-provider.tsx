"use client";
import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { type profileType, createProfileStore } from "../stores/profile-store";

export type profileStoreApi = ReturnType<typeof createProfileStore>;

export const ProfileStoreContext = createContext<profileStoreApi | undefined>(
  undefined,
);

export interface ProfileStoreProviderProps {
  children: ReactNode;
}

export const ProfileStoreProvider = ({
  children,
}: ProfileStoreProviderProps) => {
  const storeRef = useRef<profileStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createProfileStore();
  }

  return (
    <ProfileStoreContext.Provider value={storeRef.current}>
      {children}
    </ProfileStoreContext.Provider>
  );
};

export const useProfileStore = <T,>(selector: (store: profileType) => T): T => {
  const profileStoreContext = useContext(ProfileStoreContext);

  if (!profileStoreContext) {
    throw new Error(`useProfileStore must be used within ProfileStoreProvider`);
  }

  return useStore(profileStoreContext, selector);
};
