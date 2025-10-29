"use client";

import React, { useState } from 'react';
import { 
  Truck, 
  Search, 
  Filter, 
  ArrowLeft,
  Eye,
  Package,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Plus
} from 'lucide-react';
import Link from 'next/link';

export default function ShipmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");

  // Mock data - replace with actual data from your API
  const shipments = [
    {
      id: "SHP-001",
      orderId: "ORD-001",
      trackingNumber: "TRK123456789",
      status: "delivered",
      carrier: "Express Logistics",
      service: "Standard",
      origin: "New York, NY",
      destination: "Los Angeles, CA",
      weight: "2.5 kg",
      dimensions: "30x20x15 cm",
      createdAt: "2024-01-15",
      deliveredAt: "2024-01-17",
      estimatedDelivery: "2024-01-17",
      customerName: "John Smith",
      customerEmail: "john.smith@email.com"
    },
    {
      id: "SHP-002",
      orderId: "ORD-002",
      trackingNumber: "TRK987654321",
      status: "in_transit",
      carrier: "FastTrack Shipping",
      service: "Express",
      origin: "Chicago, IL",
      destination: "Miami, FL",
      weight: "0.5 kg",
      dimensions: "25x15x5 cm",
      createdAt: "2024-01-14",
      deliveredAt: null,
      estimatedDelivery: "2024-01-16",
      customerName: "Sarah Johnson",
      customerEmail: "sarah.j@email.com"
    },
    {
      id: "SHP-003",
      orderId: "ORD-003",
      trackingNumber: "TRK456789123",
      status: "processing",
      carrier: "QuickDeliver",
      service: "Economy",
      origin: "Seattle, WA",
      destination: "San Francisco, CA",
      weight: "1.2 kg",
      dimensions: "40x30x10 cm",
      createdAt: "2024-01-13",
      deliveredAt: null,
      estimatedDelivery: "2024-01-18",
      customerName: "Mike Wilson",
      customerEmail: "mike.w@email.com"
    },
    {
      id: "SHP-004",
      orderId: "ORD-004",
      trackingNumber: "TRK789123456",
      status: "cancelled",
      carrier: "SpeedPost",
      service: "Overnight",
      origin: "Boston, MA",
      destination: "Denver, CO",
      weight: "3.0 kg",
      dimensions: "35x25x20 cm",
      createdAt: "2024-01-12",
      deliveredAt: null,
      estimatedDelivery: "2024-01-13",
      customerName: "Emily Davis",
      customerEmail: "emily.d@email.com"
    }
  ];

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || shipment.status === selectedStatus;
    
    // Date range filtering logic would go here
    const matchesDateRange = true; // Simplified for demo
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-success/10 text-success";
      case "in_transit":
        return "bg-primary/10 text-primary";
      case "processing":
        return "bg-warning/10 text-warning";
      case "cancelled":
        return "bg-error/10 text-error";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "in_transit":
        return <Truck className="w-4 h-4" />;
      case "processing":
        return <Clock className="w-4 h-4" />;
      case "cancelled":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link
            href="/dashboard"
            className="flex items-center text-gray-600 hover:text-primary transition-colors mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg mr-4">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shipments</h1>
              <p className="text-gray-600">Track and manage your shipments</p>
            </div>
          </div>
          <button className="bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-lg hover:from-primary-light hover:to-accent-light transition-all flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            New Shipment
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search shipments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="processing">Processing</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <span>{filteredShipments.length} shipments found</span>
          </div>
        </div>
      </div>

      {/* Shipments List */}
      <div className="space-y-4">
        {filteredShipments.map((shipment) => (
          <div key={shipment.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                {getStatusIcon(shipment.status)}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Shipment #{shipment.id}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Tracking: {shipment.trackingNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(shipment.status)}`}>
                  {getStatusIcon(shipment.status)}
                  <span className="ml-1">{shipment.status.replace('_', ' ').toUpperCase()}</span>
                </span>
                <Link
                  href={`/dashboard/shipments/${shipment.id}`}
                  className="flex items-center text-primary hover:text-primary-light transition-colors"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Route</h4>
                <div className="flex items-center text-sm text-gray-900">
                  <MapPin className="w-4 h-4 mr-1" />
                  {shipment.origin} → {shipment.destination}
                </div>
                <p className="text-xs text-gray-500">{shipment.carrier} • {shipment.service}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Package</h4>
                <p className="text-sm text-gray-900">{shipment.weight}</p>
                <p className="text-xs text-gray-500">{shipment.dimensions}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Customer</h4>
                <p className="text-sm text-gray-900">{shipment.customerName}</p>
                <p className="text-xs text-gray-500">{shipment.customerEmail}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Timeline</h4>
                <p className="text-sm text-gray-900">Created: {shipment.createdAt}</p>
                {shipment.deliveredAt ? (
                  <p className="text-xs text-green-600">Delivered: {shipment.deliveredAt}</p>
                ) : (
                  <p className="text-xs text-gray-500">Est. Delivery: {shipment.estimatedDelivery}</p>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {filteredShipments.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No shipments found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Truck className="w-8 h-8 text-primary mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Shipments</p>
              <p className="text-2xl font-bold text-gray-900">{shipments.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-success mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">
                {shipments.filter(s => s.status === "delivered").length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-warning mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">In Transit</p>
              <p className="text-2xl font-bold text-gray-900">
                {shipments.filter(s => s.status === "in_transit").length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-primary mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-gray-900">
                {shipments.filter(s => s.status === "processing").length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
