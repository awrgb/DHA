import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  isModalOpen: boolean;
  userOrgId: string | null;
  setUserOrgId: (orgId: string) => void;
  checkOrg: () => Promise<void>;
  openModal: () => void;
  closeModal: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isModalOpen: false,
      userOrgId: null,
      setUserOrgId: (orgId) => {
        set({ userOrgId: orgId, isModalOpen: false });
      },
      checkOrg: async () => {
        if (get().userOrgId) {
          try {
            const response = await fetch('/api/places/verify-org', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ organizationId: get().userOrgId }),
            });

            if (response.ok) {
              const data = await response.json();
              if (data.success) {
                set({ isModalOpen: false });
                return;
              }
            }
          } catch (error) {
            console.error('Error verifying organization ID:', error);
          }
        }
        set({ isModalOpen: true });
      },
      openModal: () => {
        set({ isModalOpen: true });
      },
      closeModal: () => {
        set({ isModalOpen: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
