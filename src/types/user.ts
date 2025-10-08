// User types for authentication and user management

export type UserRole = "individual" | "agency";

export interface BaseUser {
  email: string;
  phonenumber: string;
  countryCode: string;
  password: string;
  role: UserRole;
}

export interface IndividualUser extends BaseUser {
  name: string;
  role: "individual";
}

export interface AgencyUser extends BaseUser {
  companyName: string;
  name: string;
  role: "agency";
}

export type User = IndividualUser | AgencyUser;

// Login credentials
export interface LoginCredentials {
  identifier: string; // Can be email or phone number
  password: string;
}

// Registration data
export interface RegistrationData {
  name: string;
  phone: string;
  email: string;
  companyName: string;
  password: string;
  role: "individual" | "agency";
}

// API Response types
export interface AuthResponse {
  token: string;
  user: UserProfile;
  message?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phonenumber: string;
  countryCode: string;
  role: UserRole;
  companyName?: string; // Only for agency users
  isVerified: boolean; // KYC verification status
  createdAt: string;
  updatedAt: string;
}
