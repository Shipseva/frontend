"use client";

import { useState } from "react";
import { 
  MapPin, 
  Building2, 
  DollarSign,
  ArrowLeft,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import Link from "next/link";

export default function ZoneRatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedZone, setSelectedZone] = useState("all");

  // Mock data - replace with actual data from your API
  const companies = [
    { id: 1, name: "Express Logistics", logo: "EL" },
    { id: 2, name: "FastTrack Shipping", logo: "FS" },
    { id: 3, name: "QuickDeliver", logo: "QD" },
    { id: 4, name: "SpeedPost", logo: "SP" },
  ];

  const zoneRates = [
    {
      id: 1,
      company: "Express Logistics",
      zone: "Zone A",
      description: "Local delivery within city",
      baseRate: 5.99,
      perKgRate: 2.50,
      maxWeight: 10,
      deliveryTime: "1-2 days",
      coverage: ["New York", "Los Angeles", "Chicago", "Houston"]
    },
    {
      id: 2,
      company: "Express Logistics",
      zone: "Zone B",
      description: "Regional delivery",
      baseRate: 8.99,
      perKgRate: 3.25,
      maxWeight: 15,
      deliveryTime: "2-3 days",
      coverage: ["Boston", "Miami", "Seattle", "Denver"]
    },
    {
      id: 3,
      company: "FastTrack Shipping",
      zone: "Zone A",
      description: "Local delivery within city",
      baseRate: 6.50,
      perKgRate: 2.75,
      maxWeight: 12,
      deliveryTime: "1-2 days",
      coverage: ["New York", "Los Angeles", "Chicago", "Houston"]
    },
    {
      id: 4,
      company: "FastTrack Shipping",
      zone: "Zone C",
      description: "Cross-country delivery",
      baseRate: 12.99,
      perKgRate: 4.50,
      maxWeight: 20,
      deliveryTime: "3-5 days",
      coverage: ["All major cities"]
    },
    {
      id: 5,
      company: "QuickDeliver",
      zone: "Zone A",
      description: "Local delivery within city",
      baseRate: 4.99,
      perKgRate: 2.25,
      maxWeight: 8,
      deliveryTime: "Same day",
      coverage: ["New York", "Los Angeles", "Chicago", "Houston"]
    },
    {
      id: 6,
      company: "SpeedPost",
      zone: "Zone B",
      description: "Regional delivery",
      baseRate: 9.50,
      perKgRate: 3.50,
      maxWeight: 18,
      deliveryTime: "2-4 days",
      coverage: ["Boston", "Miami", "Seattle", "Denver"]
    }
  ];

  const filteredRates = zoneRates.filter(rate => {
    const matchesSearch = rate.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rate.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rate.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = selectedCompany === "all" || rate.company === selectedCompany;
    const matchesZone = selectedZone === "all" || rate.zone === selectedZone;
    
    return matchesSearch && matchesCompany && matchesZone;
  });

  const uniqueZones = [...new Set(zoneRates.map(rate => rate.zone))];

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
            <div className="p-3 bg-purple-50 rounded-lg mr-4">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Zone Wise Rates</h1>
              <p className="text-gray-600">View and manage zone-based pricing for different companies</p>
            </div>
          </div>
          <button className="bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-lg hover:from-primary-light hover:to-accent-light transition-all flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add New Rate
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
              placeholder="Search rates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Companies</option>
              {companies.map(company => (
                <option key={company.id} value={company.name}>{company.name}</option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Zones</option>
              {uniqueZones.map(zone => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </select>
          </div>
          
          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Rates Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Base Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Per Kg Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Max Weight
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRates.map((rate) => (
                <tr key={rate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                        {rate.company.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{rate.company}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {rate.zone}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{rate.description}</div>
                    <div className="text-sm text-gray-500">
                      {rate.coverage.slice(0, 2).join(", ")}
                      {rate.coverage.length > 2 && ` +${rate.coverage.length - 2} more`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm font-medium text-gray-900">{rate.baseRate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm font-medium text-gray-900">{rate.perKgRate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{rate.maxWeight} kg</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{rate.deliveryTime}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-primary hover:text-primary-light">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-error hover:text-error/80">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredRates.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No rates found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Building2 className="w-8 h-8 text-primary mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Companies</p>
              <p className="text-2xl font-bold text-gray-900">{companies.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <MapPin className="w-8 h-8 text-primary mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Zones</p>
              <p className="text-2xl font-bold text-gray-900">{uniqueZones.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-primary mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Rate Plans</p>
              <p className="text-2xl font-bold text-gray-900">{zoneRates.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Filter className="w-8 h-8 text-primary mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Filtered Results</p>
              <p className="text-2xl font-bold text-gray-900">{filteredRates.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

