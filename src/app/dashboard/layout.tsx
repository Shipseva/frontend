"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  // Mock user data - replace with actual user data from your auth system
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
  };

  return (
    <div className="min-h-screen bg-bg-light">
      <Navbar user={user} currentPath={pathname} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

