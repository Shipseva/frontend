"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { AuthWrapper } from "@/components/AuthWrapper";
import { ToastTest } from "@/components/ToastTest";
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
        <Navbar user={user} currentPath={pathname} />
        <main className="flex-1">
          {children}
        </main>
        <Footer />

      </div>
    </AuthWrapper>
  );
}

