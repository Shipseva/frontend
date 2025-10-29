"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Shield, Users, Package, BarChart3 } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();

  const adminSections = [
    {
      title: "User Management",
      description: "Manage users, roles, and permissions",
      icon: Users,
      href: "/admin/users",
      color: "bg-blue-500"
    },
    {
      title: "Order Management",
      description: "View and manage all orders",
      icon: Package,
      href: "/admin/orders",
      color: "bg-green-500"
    },
    {
      title: "KYC Verification",
      description: "Review and verify KYC documents",
      icon: Shield,
      href: "/admin/kyc",
      color: "bg-purple-500"
    },
    {
      title: "Analytics",
      description: "View system analytics and reports",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your logistics platform</p>
        </div>

        {/* Admin Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <div
                key={section.title}
                onClick={() => router.push(section.href)}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 ${section.color} rounded-lg flex items-center justify-center mb-4`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h3>
                <p className="text-gray-600 text-sm">{section.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

