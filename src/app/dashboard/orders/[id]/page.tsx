"use client";

import React from 'react';
import Link from 'next/link';

type PageProps = {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

const OrderDetailsPage: React.FC<PageProps> = ({ params }) => {
  const { id } = params;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
        <p className="text-gray-600">Order ID: {id}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-700">Detailed order view coming soon.</p>
      </div>

      <div className="mt-6">
        <Link href="/dashboard/orders" className="text-primary hover:text-primary-light">
          ← Back to Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderDetailsPage;

