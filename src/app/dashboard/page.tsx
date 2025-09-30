"use client";

import Link from "next/link";
import { 
  Package, 
  Calculator, 
  MapPin, 
  Ticket, 
  History,
  TrendingUp,
  Users,
  Truck,
  DollarSign,
  ArrowRight,
  Star,
  Clock,
  CheckCircle
} from "lucide-react";

export default function DashboardPage() {
  // Mock data - replace with actual data from your API
  const stats = [
    { name: "Total Orders", value: "1,234", change: "+12%", changeType: "positive", icon: Package, bgColor: "bg-blue-50", iconColor: "text-blue-600" },
    { name: "Active Shipments", value: "89", change: "+5%", changeType: "positive", icon: Truck, bgColor: "bg-green-50", iconColor: "text-green-600" },
    { name: "Revenue", value: "$45,678", change: "+8%", changeType: "positive", icon: DollarSign, bgColor: "bg-yellow-50", iconColor: "text-yellow-600" },
    { name: "Customers", value: "2,456", change: "+15%", changeType: "positive", icon: Users, bgColor: "bg-purple-50", iconColor: "text-purple-600" },
  ];

  const recentOrders = [
    { id: "ORD-001", customer: "John Smith", status: "Shipped", amount: "$125.00", date: "2024-01-15" },
    { id: "ORD-002", customer: "Sarah Johnson", status: "Processing", amount: "$89.50", date: "2024-01-15" },
    { id: "ORD-003", customer: "Mike Wilson", status: "Delivered", amount: "$234.75", date: "2024-01-14" },
    { id: "ORD-004", customer: "Emily Davis", status: "Pending", amount: "$156.25", date: "2024-01-14" },
  ];

  const tools = [
    {
      name: "Order",
      description: "Create and manage new shipping orders",
      href: "/dashboard/tools/order",
      icon: Package,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      name: "Rate Calculator",
      description: "Calculate shipping rates for different destinations",
      href: "/dashboard/tools/rate-calculator",
      icon: Calculator,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      name: "Zone Wise Rate",
      description: "View and manage zone-based pricing for different companies",
      href: "/dashboard/tools/zone-rates",
      icon: MapPin,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      name: "Ticketing",
      description: "Create and manage support tickets",
      href: "/dashboard/tools/ticketing",
      icon: Ticket,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      name: "Orders History",
      description: "View complete history of all orders",
      href: "/dashboard/tools/orders-history",
      icon: History,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-success/10 text-success";
      case "shipped":
        return "bg-primary/10 text-primary";
      case "processing":
        return "bg-warning/10 text-warning";
      case "pending":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your shipments today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-success mr-1" />
                <span className="text-sm text-success font-medium">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tools Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Tools</h2>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                Quick access to essential features
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.name}
                    href={tool.href}
                    className="group p-6 border border-gray-200 rounded-xl hover:border-primary/30 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${tool.bgColor} group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-6 h-6 ${tool.iconColor}`} />
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {tool.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <Link
                href="/dashboard/orders"
                className="text-primary hover:text-primary-light text-sm font-medium flex items-center"
              >
                View all
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900">{order.id}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{order.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-primary to-accent rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Need Help?</h3>
            <p className="text-white/90">Get support or learn more about our features</p>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/dashboard/tools/ticketing"
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <Ticket className="w-4 h-4 mr-2" />
              Create Ticket
            </Link>
            <Link
              href="/help"
              className="bg-white text-primary hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <Star className="w-4 h-4 mr-2" />
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

