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

// Login credentials - can use either email or phone
export interface LoginCredentials {
  email?: string;
  phonenumber?: string;
  countryCode?: string;
  password: string;
}

// Registration data
export interface IndividualRegistration {
  name: string;
  email: string;
  phonenumber: string;
  countryCode: string;
  password: string;
  role: "individual";
}

export interface AgencyRegistration {
  companyName: string;
  name: string;
  email: string;
  phonenumber: string;
  countryCode: string;
  password: string;
  role: "agency";
}

export type RegistrationData = IndividualRegistration | AgencyRegistration;

// API Response types
export interface AuthResponse {
  token: string;
  user: User;
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
  createdAt: string;
  updatedAt: string;
}
