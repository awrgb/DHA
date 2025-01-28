import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Import Organization type (adjust path if needed)
// import { Organization } from '@/types';
// Or define it here if it's not defined elsewhere:
type Organization = {
  id: string;
  name: string;
  // ... other properties of your Organization type
};

interface AuthState {
  modalState: { [modalId: string]: boolean };
  userOrgId: string | null;
  orgData: Organization | null; // Add orgData to the state
  setUserOrgId: (orgId: string) => void;
  verifyOrg: (orgId: string, modalId: string) => Promise<boolean>;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  clearUserOrgId: () => void;
  setOrgData: (orgData: Organization | null) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      modalState: {},
      userOrgId: null,
      orgData: null, // Initialize orgData
      setUserOrgId: (orgId: string) => {
        set({ userOrgId: orgId });
      },
      setOrgData: (orgData: Organization | null) => {
        set({ orgData: orgData }); // Correctly update orgData
      },
      verifyOrg: async (orgId, modalId) => {
        try {
          const response = await fetch('/api/places/verify-org', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ organizationId: orgId }),
          });

          if (!response.ok) {
            console.error('Verification failed with status:', response.status);
            return false;
          }

          const data = await response.json();
          if (data.success) {
            set({
              userOrgId: orgId,
              modalState: { ...get().modalState, [modalId]: false },
            });
            // Fetch and set the organization data after successful verification
            try {
              const orgResponse = await fetch(
                `/api/places/get-org-by-id?organizationId=${orgId}`
              );
              if (orgResponse.ok) {
                const orgData = await orgResponse.json();
                if (orgData.success) {
                  set({ orgData: orgData.data }); // Correctly update orgData
                } else {
                  console.error(
                    'Failed to fetch organization data:',
                    orgData.error
                  );
                }
              } else {
                console.error(
                  'Failed to fetch organization data with status:',
                  orgResponse.status
                );
              }
            } catch (error) {
              console.error('Error fetching organization data:', error);
            }
            return true;
          } else {
            console.error('Verification failed:', data.error);
            return false;
          }
        } catch (error) {
          console.error('Error verifying organization ID:', error);
          return false;
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
      clearUserOrgId: () => {
        set({ userOrgId: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useAuthStore;
