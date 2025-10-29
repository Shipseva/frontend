"use client";

import React from 'react';
import { 
  Truck, 
  MapPin, 
  Package, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  User,
  Phone,
  Mail,
  Weight,
  Ruler
} from 'lucide-react';
import Link from 'next/link';

type PageProps = {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function ShipmentDetailsPage({ params }: PageProps) {
  const { id } = params;

  // Mock data - replace with actual data from your API
  const shipment = {
    id: id,
    orderId: "ORD-001",
    trackingNumber: "TRK123456789",
    status: "delivered",
    carrier: "Express Logistics",
    service: "Standard",
    origin: {
      name: "John Smith",
      address: "123 Main St, New York, NY 10001",
      phone: "+1 (555) 123-4567",
      email: "john.smith@email.com"
    },
    destination: {
      name: "Sarah Johnson",
      address: "456 Oak Ave, Los Angeles, CA 90210",
      phone: "+1 (555) 234-5678",
      email: "sarah.j@email.com"
    },
    package: {
      type: "Electronics",
      weight: "2.5 kg",
      dimensions: "30x20x15 cm",
      value: "$299.99",
      description: "Gaming laptop and accessories"
    },
    timeline: [
      {
        status: "Order Placed",
        timestamp: "2024-01-15T10:00:00Z",
        location: "New York, NY",
        description: "Order received and payment processed"
      },
      {
        status: "Processing",
        timestamp: "2024-01-15T14:30:00Z",
        location: "New York, NY",
        description: "Package prepared for shipment"
      },
      {
        status: "In Transit",
        timestamp: "2024-01-16T08:00:00Z",
        location: "New York, NY",
        description: "Package picked up and in transit"
      },
      {
        status: "In Transit",
        timestamp: "2024-01-16T20:00:00Z",
        location: "Chicago, IL",
        description: "Package arrived at sorting facility"
      },
      {
        status: "Out for Delivery",
        timestamp: "2024-01-17T06:00:00Z",
        location: "Los Angeles, CA",
        description: "Package out for delivery"
      },
      {
        status: "Delivered",
        timestamp: "2024-01-17T14:30:00Z",
        location: "Los Angeles, CA",
        description: "Package delivered successfully"
      }
    ],
    createdAt: "2024-01-15",
    deliveredAt: "2024-01-17",
    estimatedDelivery: "2024-01-17",
    totalCost: "$24.99"
  };

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link
            href="/dashboard/shipments"
            className="flex items-center text-gray-600 hover:text-primary transition-colors mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Shipments
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg mr-4">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shipment Details</h1>
              <p className="text-gray-600">Shipment #{shipment.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(shipment.status)}`}>
              {getStatusIcon(shipment.status)}
              <span className="ml-1">{shipment.status.replace('_', ' ').toUpperCase()}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipment Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipment Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Tracking Number</h3>
                <p className="text-lg font-mono text-gray-900">{shipment.trackingNumber}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Order ID</h3>
                <p className="text-lg text-gray-900">{shipment.orderId}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Carrier</h3>
                <p className="text-lg text-gray-900">{shipment.carrier}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Service</h3>
                <p className="text-lg text-gray-900">{shipment.service}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Created</h3>
                <p className="text-lg text-gray-900">{shipment.createdAt}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Total Cost</h3>
                <p className="text-lg font-semibold text-gray-900">{shipment.totalCost}</p>
              </div>
            </div>
          </div>

          {/* Package Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Package Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Package Type</h3>
                <p className="text-lg text-gray-900">{shipment.package.type}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Weight</h3>
                <div className="flex items-center">
                  <Weight className="w-4 h-4 text-gray-400 mr-2" />
                  <p className="text-lg text-gray-900">{shipment.package.weight}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Dimensions</h3>
                <div className="flex items-center">
                  <Ruler className="w-4 h-4 text-gray-400 mr-2" />
                  <p className="text-lg text-gray-900">{shipment.package.dimensions}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Declared Value</h3>
                <p className="text-lg text-gray-900">{shipment.package.value}</p>
              </div>
              
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-lg text-gray-900">{shipment.package.description}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Tracking Timeline</h2>
            
            <div className="space-y-4">
              {shipment.timeline.map((event, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    index === shipment.timeline.length - 1 
                      ? 'bg-success text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index === shipment.timeline.length - 1 ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">{event.status}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(event.timestamp).toLocaleDateString()} at {new Date(event.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{event.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Origin Address */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Origin</h3>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{shipment.origin.name}</p>
                  <p className="text-sm text-gray-500">{shipment.origin.address}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <p className="text-sm text-gray-900">{shipment.origin.phone}</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <p className="text-sm text-gray-900">{shipment.origin.email}</p>
              </div>
            </div>
          </div>

          {/* Destination Address */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Destination</h3>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{shipment.destination.name}</p>
                  <p className="text-sm text-gray-500">{shipment.destination.address}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <p className="text-sm text-gray-900">{shipment.destination.phone}</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <p className="text-sm text-gray-900">{shipment.destination.email}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors">
                Print Label
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Download Invoice
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Share Tracking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
