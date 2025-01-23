// src/store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  modalState: { [modalId: string]: boolean };
  userOrgId: string | null;
  setUserOrgId: (orgId: string) => void;
  verifyOrg: (orgId: string, modalId: string) => Promise<void>;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      modalState: {},
      userOrgId: null,
      setUserOrgId: (orgId) => {
        set({ userOrgId: orgId });
      },
      verifyOrg: async (orgId, modalId) => {
        try {
          const response = await fetch('/api/places/verify-org', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ organizationId: orgId }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              // Set the userOrgId in the store upon successful verification
              set({
                userOrgId: orgId,
                modalState: { ...get().modalState, [modalId]: false },
              });
            } else {
              console.error('Verification failed:', data.error);
            }
          } else {
            console.error('Verification failed with status:', response.status);
          }
        } catch (error) {
          console.error('Error verifying organization ID:', error);
        }
      },
      openModal: (modalId: string) => {
        set((state) => ({
          modalState: { ...state.modalState, [modalId]: true },
        }));
      },
      closeModal: (modalId: string) => {
        set((state) => ({
          modalState: { ...state.modalState, [modalId]: false },
        }));
      },
    }),
    {
      name: 'auth-storage', // Unique name for the storage
      storage: createJSONStorage(() => localStorage), // Use localStorage
    }
  )
);

export default useAuthStore;
