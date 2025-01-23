"use client";

import { useState, useEffect } from "react";
import { Navbar } from "./_components/navbar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {

  return (
    <div className="h-full w-full flex flex-col gap-y-10 items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-600 to-green-900">
      <Navbar />
      {children}
    </div>
  );
};

export default ProtectedLayout;
