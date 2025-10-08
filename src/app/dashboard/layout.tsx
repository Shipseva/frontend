"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { AuthWrapper } from "@/components/AuthWrapper";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { RootState } from "@/store";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-bg-light">
        <Navbar 
          user={user ? { name: user.name, email: user.email } : undefined} 
          currentPath={pathname} 
        />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </AuthWrapper>
  );
}

