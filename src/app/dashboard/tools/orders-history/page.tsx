"use client";

import { useState } from "react";
import { 
  History, 
  Search, 
  Filter,
  ArrowLeft,
  Download,
  Eye,
  Package,
  Calendar,
  User,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

export default function OrdersHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock data - replace with actual data from your API
  const orders = [
    {
      id: "ORD-001",
      customerName: "John Smith",
      customerEmail: "john.smith@email.com",
      customerPhone: "+1 (555) 123-4567",
      senderAddress: "123 Main St, New York, NY 10001",
      receiverAddress: "456 Oak Ave, Los Angeles, CA 90210",
      packageType: "Electronics",
      weight: "2.5 kg",
      dimensions: "30x20x15 cm",
      declaredValue: "$299.99",
      serviceType: "Express",
      status: "delivered",
      createdAt: "2024-01-15",
      deliveredAt: "2024-01-17",
      trackingNumber: "TRK123456789",
      totalCost: "$24.99",
      notes: "Fragile - Handle with care"
    },
    {
      id: "ORD-002",
      customerName: "Sarah Johnson",
      customerEmail: "sarah.j@email.com",
      customerPhone: "+1 (555) 234-5678",
      senderAddress: "789 Pine St, Chicago, IL 60601",
      receiverAddress: "321 Elm St, Miami, FL 33101",
      packageType: "Documents",
      weight: "0.5 kg",
      dimensions: "25x15x5 cm",
      declaredValue: "$50.00",
      serviceType: "Standard",
      status: "in-transit",
      createdAt: "2024-01-14",
      deliveredAt: null,
      trackingNumber: "TRK987654321",
      totalCost: "$12.99",
      notes: "Urgent delivery required"
    },
    {
      id: "ORD-003",
      customerName: "Mike Wilson",
      customerEmail: "mike.w@email.com",
      customerPhone: "+1 (555) 345-6789",
      senderAddress: "555 Broadway, Seattle, WA 98101",
      receiverAddress: "777 Market St, San Francisco, CA 94102",
      packageType: "Clothing",
      weight: "1.2 kg",
      dimensions: "40x30x10 cm",
      declaredValue: "$150.00",
      serviceType: "Economy",
      status: "processing",
      createdAt: "2024-01-13",
      deliveredAt: null,
      trackingNumber: "TRK456789123",
      totalCost: "$8.99",
      notes: "Return shipment"
    },
    {
      id: "ORD-004",
      customerName: "Emily Davis",
      customerEmail: "emily.d@email.com",
      customerPhone: "+1 (555) 456-7890",
      senderAddress: "999 First Ave, Boston, MA 02101",
      receiverAddress: "111 Second St, Denver, CO 80201",
      packageType: "Fragile",
      weight: "3.0 kg",
      dimensions: "35x25x20 cm",
      declaredValue: "$500.00",
      serviceType: "Overnight",
      status: "cancelled",
      createdAt: "2024-01-12",
      deliveredAt: null,
      trackingNumber: "TRK789123456",
      totalCost: "$45.99",
      notes: "Customer requested cancellation"
    },
    {
      id: "ORD-005",
      customerName: "David Brown",
      customerEmail: "david.b@email.com",
      customerPhone: "+1 (555) 567-8901",
      senderAddress: "222 Third St, Austin, TX 78701",
      receiverAddress: "333 Fourth Ave, Phoenix, AZ 85001",
      packageType: "Books",
      weight: "1.8 kg",
      dimensions: "30x20x8 cm",
      declaredValue: "$75.00",
      serviceType: "Standard",
      status: "delivered",
      createdAt: "2024-01-11",
      deliveredAt: "2024-01-14",
      trackingNumber: "TRK321654987",
      totalCost: "$15.99",
      notes: "Educational materials"
    }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    
    // Date range filtering logic would go here
    const matchesDateRange = true; // Simplified for demo
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-success/10 text-success";
      case "in-transit":
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
      case "in-transit":
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
            <div className="p-3 bg-indigo-50 rounded-lg mr-4">
              <History className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Orders History</h1>
              <p className="text-gray-600">View complete history of all orders</p>
            </div>
          </div>
          <button className="bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-lg hover:from-primary-light hover:to-accent-light transition-all flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Data
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
              placeholder="Search orders..."
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
              <option value="delivered">Delivered</option>
              <option value="in-transit">In Transit</option>
              <option value="processing">Processing</option>
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
              <option value="quarter">This Quarter</option>
            </select>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <span>{filteredOrders.length} orders found</span>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.id}</div>
                        <div className="text-sm text-gray-500">{order.trackingNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.packageType}</div>
                      <div className="text-sm text-gray-500">{order.weight} • {order.dimensions}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-900">
                          {order.senderAddress.split(',')[0]} → {order.receiverAddress.split(',')[0]}
                        </div>
                        <div className="text-sm text-gray-500">{order.serviceType}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status.replace('-', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm font-medium text-gray-900">{order.totalCost}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{order.createdAt}</div>
                      {order.deliveredAt && (
                        <div className="text-sm text-gray-500">Delivered: {order.deliveredAt}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-primary hover:text-primary-light flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No orders found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Order Details - {selectedOrder.id}</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {selectedOrder.customerName}</div>
                    <div><strong>Email:</strong> {selectedOrder.customerEmail}</div>
                    <div><strong>Phone:</strong> {selectedOrder.customerPhone}</div>
                  </div>
                </div>

                {/* Package Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Package Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Type:</strong> {selectedOrder.packageType}</div>
                    <div><strong>Weight:</strong> {selectedOrder.weight}</div>
                    <div><strong>Dimensions:</strong> {selectedOrder.dimensions}</div>
                    <div><strong>Value:</strong> {selectedOrder.declaredValue}</div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Shipping Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>From:</strong> {selectedOrder.senderAddress}</div>
                    <div><strong>To:</strong> {selectedOrder.receiverAddress}</div>
                    <div><strong>Service:</strong> {selectedOrder.serviceType}</div>
                    <div><strong>Tracking:</strong> {selectedOrder.trackingNumber}</div>
                  </div>
                </div>

                {/* Order Status */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Order Status</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Status:</strong> 
                      <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusIcon(selectedOrder.status)}
                        <span className="ml-1 capitalize">{selectedOrder.status.replace('-', ' ')}</span>
                      </span>
                    </div>
                    <div><strong>Created:</strong> {selectedOrder.createdAt}</div>
                    {selectedOrder.deliveredAt && (
                      <div><strong>Delivered:</strong> {selectedOrder.deliveredAt}</div>
                    )}
                    <div><strong>Total Cost:</strong> {selectedOrder.totalCost}</div>
                  </div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                  <p className="text-sm text-gray-700">{selectedOrder.notes}</p>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-primary mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-success mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.status === "delivered").length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Truck className="w-8 h-8 text-primary mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">In Transit</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.status === "in-transit").length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-success mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${orders.reduce((sum, order) => sum + parseFloat(order.totalCost.replace('$', '')), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

