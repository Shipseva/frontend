// src/auth.ts

// Save token to localStorage or cookies
export const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

// Get token
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

// Remove token
export const removeToken = () => {
  localStorage.removeItem("token");
};
