// Order and Shipment types for the ShipSeva application

export interface Address {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface PackageDimensions {
  length: number; // in cm
  width: number;  // in cm
  height: number; // in cm
}

export interface PackageInfo {
  type: "document" | "parcel" | "fragile" | "electronics" | "clothing" | "other";
  weight: number; // in kg
  dimensions: PackageDimensions;
  value?: number; // declared value in USD
  description?: string;
}

export interface ShippingOptions {
  serviceType: "standard" | "express" | "overnight" | "economy";
  deliveryDate?: string; // ISO date string
  specialInstructions?: string;
}

export interface CreateOrderRequest {
  sender: Address;
  receiver: Address;
  package: PackageInfo;
  shipping: ShippingOptions;
}

export interface CreateOrderResponse {
  orderId: string;
  trackingNumber: string;
  status: "pending" | "confirmed" | "in_transit" | "delivered" | "cancelled";
  estimatedDelivery: string; // ISO date string
  totalCost: number;
  message: string;
}

export interface Order {
  id: string;
  trackingNumber: string;
  status: "pending" | "confirmed" | "in_transit" | "delivered" | "cancelled";
  sender: Address;
  receiver: Address;
  package: PackageInfo;
  shipping: ShippingOptions;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  estimatedDelivery?: string; // ISO date string
  actualDelivery?: string; // ISO date string
  totalCost?: number;
  notes?: string;
}
