"use client";

import { useState } from "react";
import { 
  Calculator, 
  MapPin, 
  Package, 
  Weight,
  DollarSign,
  ArrowLeft,
  RefreshCw,
  Info
} from "lucide-react";
import Link from "next/link";

export default function RateCalculatorPage() {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    weight: "",
    packageType: "parcel",
    serviceType: "standard",
    declaredValue: "",
    dimensions: {
      length: "",
      width: "",
      height: ""
    }
  });

  const [calculatedRates, setCalculatedRates] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith("dimensions.")) {
      const dimension = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [dimension]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    
    // Simulate API call
    setTimeout(() => {
      setCalculatedRates({
        standard: { price: 15.99, days: "3-5", company: "Standard Express" },
        express: { price: 24.99, days: "1-2", company: "Express Delivery" },
        overnight: { price: 39.99, days: "1", company: "Overnight Express" },
        economy: { price: 9.99, days: "5-7", company: "Economy Shipping" }
      });
      setIsCalculating(false);
    }, 1500);
  };

  const resetForm = () => {
    setFormData({
      origin: "",
      destination: "",
      weight: "",
      packageType: "parcel",
      serviceType: "standard",
      declaredValue: "",
      dimensions: {
        length: "",
        width: "",
        height: ""
      }
    });
    setCalculatedRates(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <div className="flex items-center">
          <div className="p-3 bg-green-50 rounded-lg mr-4">
            <Calculator className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Rate Calculator</h1>
            <p className="text-gray-600">Calculate shipping rates for different destinations and services</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calculator Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Calculate Rates</h2>
            <button
              onClick={resetForm}
              className="flex items-center text-gray-600 hover:text-primary transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </button>
          </div>

          <form onSubmit={handleCalculate} className="space-y-6">
            {/* Origin and Destination */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Origin City *
                </label>
                <input
                  type="text"
                  name="origin"
                  value={formData.origin}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter origin city"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Destination City *
                </label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter destination city"
                />
              </div>
            </div>

            {/* Package Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Weight className="w-4 h-4 inline mr-1" />
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  required
                  min="0.1"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter weight"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package className="w-4 h-4 inline mr-1" />
                  Package Type *
                </label>
                <select
                  name="packageType"
                  value={formData.packageType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="parcel">Parcel</option>
                  <option value="document">Document</option>
                  <option value="fragile">Fragile</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                </select>
              </div>
            </div>

            {/* Dimensions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions (cm)</label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <input
                    type="number"
                    name="dimensions.length"
                    value={formData.dimensions.length}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Length"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    name="dimensions.width"
                    value={formData.dimensions.width}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Width"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    name="dimensions.height"
                    value={formData.dimensions.height}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Height"
                  />
                </div>
              </div>
            </div>

            {/* Declared Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Declared Value ($)
              </label>
              <input
                type="number"
                name="declaredValue"
                value={formData.declaredValue}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter declared value (optional)"
              />
            </div>

            {/* Calculate Button */}
            <button
              type="submit"
              disabled={isCalculating}
              className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 px-4 rounded-lg font-medium hover:from-primary-light hover:to-accent-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              {isCalculating ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate Rates
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Rates</h2>
          
          {!calculatedRates ? (
            <div className="text-center py-12">
              <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Enter package details to calculate shipping rates</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(calculatedRates).map(([service, rate]: [string, { price: number; deliveryTime: string; description: string }]) => (
                <div
                  key={service}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                    service === formData.serviceType
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-primary/30"
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, serviceType: service }))}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 capitalize">{service} Delivery</h3>
                      <p className="text-sm text-gray-600">{rate.company}</p>
                      <p className="text-sm text-gray-500">{rate.days} business days</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">${rate.price}</p>
                      <p className="text-xs text-gray-500">per package</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Additional Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Rate Information</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Rates are estimates and may vary based on final package dimensions</li>
                      <li>• Additional charges may apply for special handling</li>
                      <li>• Insurance is included for declared values up to $100</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

