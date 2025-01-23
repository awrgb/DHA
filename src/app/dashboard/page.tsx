'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store';
import { cn } from '@/lib/utils';

const AdminPage: React.FC = () => {
  const router = useRouter();
  const { userOrgId } = useAuthStore();

  useEffect(() => {
    if (!userOrgId) {
      router.push('/auth');
    }
  }, [router, userOrgId]);

  return (
    <div className={cn("flex items-center justify-center h-full w-full text-white font-mono")}>
      <h1 className="text-2xl">Admin Dashboard</h1>
    </div>
  );
};

export default AdminPage;
