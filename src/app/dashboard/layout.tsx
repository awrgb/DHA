"use client";

import { useEffect, useState } from 'react';
import React from 'react';
import Modal from '@/components/ui/modal';
import useAuthStore from '@/store';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
    const { isModalOpen, checkOrg, userOrgId } = useAuthStore();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const check = async () => {
            await checkOrg();
            setLoading(false);
        };
        check();
    }, [checkOrg]);

    useEffect(() => {
        if (!loading && !userOrgId && !isModalOpen) {
            router.push('/auth');
        }
    }, [loading, userOrgId, isModalOpen, router]);

    if (loading) {
        return <div className="flex items-center justify-center h-screen font-mono">Loading...</div>;
    }

    return (
        <div className={cn("text-white bg-black h-full w-full flex flex-col", isModalOpen ? "overflow-hidden" : "")}>
            {isModalOpen && <Modal isOpen={isModalOpen} />}
            {!isModalOpen && userOrgId && (
                <div className="flex-1 flex flex-col">
                    <p className="text-white text-xl p-4 font-mono text-center">Welcome, User!</p>
                    <div className="flex-1 overflow-y-auto">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProtectedLayout;
