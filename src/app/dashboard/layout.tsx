// src/app/dashboard/layout.tsx
'use client';

import { useEffect } from 'react';
import useAuthStore from '@/store';
import Modal from '@/components/ui/modal';

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
    const { userOrgId, modalState, openModal, verifyOrg } = useAuthStore();
    const orgVerificationModalId = 'orgVerificationModal';

    useEffect(() => {
        if (!userOrgId) {
            openModal(orgVerificationModalId);
        }
    }, [userOrgId, openModal, orgVerificationModalId]);

    const handleOrgVerification = async (orgId: string) => {
        await verifyOrg(orgId, orgVerificationModalId);
    };

    return (
        <div>
            {modalState[orgVerificationModalId] && (
                <Modal
                    isOpen={modalState[orgVerificationModalId]}
                    closeModal={() => useAuthStore().closeModal(orgVerificationModalId)}
                    onVerify={handleOrgVerification}
                />
            )}
            {children}
        </div>
    );
};

export default ProtectedLayout;
