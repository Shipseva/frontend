// src/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="text-center max-w-3xl px-6 py-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Fast & Reliable <span className="text-blue-600">E-Commerce Shipping</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Track your orders, manage shipments, and keep customers updated in real time.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/signup"
            className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
          <Link
            href="/auth/login"
            className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Tracking Section */}
      <section className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 mt-10">
        <h2 className="text-xl font-semibold mb-4 text-center">Track Your Shipment</h2>
        <form action="/track" method="get" className="flex gap-2">
          <input
            type="text"
            name="trackingId"
            placeholder="Enter Tracking ID"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Track
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="mt-16 text-sm text-gray-500">
        © {new Date().getFullYear()} ShipFast Inc. All rights reserved.
      </footer>
    </main>
  );
}
