// app/dashboard/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import useAuthStore from '@/store';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/app/dashboard/_components/app-sidebar"
import Modal from '@/app/dashboard/_components/Orgmodal';

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
    const { userOrgId, modalState, openModal, closeModal, verifyOrg } =
        useAuthStore();
    const orgVerificationModalId = 'orgVerificationModal';
    const [isStoreInitialized, setIsStoreInitialized] = useState(false);

    useEffect(() => {
        // Set isStoreInitialized to true after the component mounts
        setIsStoreInitialized(true);
    }, []);

    useEffect(() => {
        // Open the modal only if the store is initialized and userOrgId is not set
        if (isStoreInitialized && !userOrgId) {
            openModal(orgVerificationModalId);
        }
    }, [userOrgId, openModal, orgVerificationModalId, isStoreInitialized]);

    const handleOrgVerification = async (orgId: string) => {
        await verifyOrg(orgId, orgVerificationModalId);
    };

    return (
        <SidebarProvider >
            <AppSidebar />
            <SidebarInset className="bg-black">
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">

                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
            <Modal
                isOpen={modalState[orgVerificationModalId]}
                closeModal={() => closeModal(orgVerificationModalId)}
                onVerify={handleOrgVerification}
            />
            {children}
                    </div>
                </header>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default ProtectedLayout;
