import { createApi } from "@reduxjs/toolkit/query/react";
import { LoginCredentials, RegistrationData, AuthResponse } from "@/types/user";
import { createBaseQuery } from "./baseQuery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: createBaseQuery("http://localhost/auth", true), // excludeAuthApis = true, no toasts
  endpoints: (builder) => ({
    loginUser: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
    }),
    registerUser: builder.mutation<AuthResponse, RegistrationData>({
      query: (userData) => ({
        url: "register",
        method: "POST",
        body: userData,
      }),
    }),
    forgotPassword: builder.mutation<{ message: string }, { email?: string; phonenumber?: string; countryCode?: string }>({
      query: (data) => ({
        url: "forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<{ message: string }, { token: string; password: string }>({
      query: (data) => ({
        url: "reset-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { 
  useLoginUserMutation, 
  useRegisterUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation
} = authApi;
