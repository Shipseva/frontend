"use client";

import React from "react";

interface TrackPageProps {
  params: { trackingId: string };
}

export default function TrackPage({ params }: TrackPageProps) {
  const { trackingId } = params;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xl text-center">
        <h1 className="text-2xl font-bold mb-3">Track Shipment</h1>
        <p className="text-gray-600 mb-6">Tracking ID: <span className="font-mono font-semibold">{trackingId}</span></p>
        <p className="text-gray-500">This page is set up. Implement tracking details here.</p>
      </div>
    </div>
  );
}
