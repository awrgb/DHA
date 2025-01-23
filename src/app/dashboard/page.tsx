// src/app/dashboard/page.tsx
'use client';

import { cn } from '@/lib/utils';

const AdminPage: React.FC = () => {
  return (
    <div
      className={cn(
        'flex items-center justify-center h-full w-full text-white font-mono'
      )}
    >
      < h1 className="text-2xl" >Admin Dashboard</h1>
    </div>
  );
};

export default AdminPage;
