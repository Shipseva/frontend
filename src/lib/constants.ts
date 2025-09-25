// ==============================
//  API Endpoints
// ==============================
export const API = {
  BASE_URL: "/api",               // base URL for your backend
  AUTH_LOGIN: "/auth/login",
  AUTH_SIGNUP: "/auth/signup",
  USER_PROFILE: "/user/profile",
  ORDERS: "/orders",
  SHIPMENTS: "/shipments",
  PAYMENTS: "/payments",
};

// ==============================
//  Routes / App paths
// ==============================
export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  FORGOT_PASSWORD: "/auth/forgot-password",
  DASHBOARD: "/dashboard",
  ORDERS: "/dashboard/orders",
  SHIPMENTS: "/dashboard/shipments",
  PAYMENTS: "/dashboard/payments",
  SETTINGS: "/dashboard/settings",
};

// ==============================
//  UI / Layout Constants
// ==============================
export const UI = {
  SIDEBAR_WIDTH: 250,             // px
  HEADER_HEIGHT: 60,              // px
  MAX_CONTENT_WIDTH: 1200,        // px
};

// ==============================
//  Status / Flags
// ==============================
export const STATUS = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

// ==============================
//  Other reusable constants
// ==============================
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
};
