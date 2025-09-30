import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LoginCredentials, RegistrationData, AuthResponse, UserProfile } from "@/types/user";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getUser: builder.query<UserProfile, void>({
      query: () => "user/profile",
    }),
    loginUser: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    registerUser: builder.mutation<AuthResponse, RegistrationData>({
      query: (userData) => ({
        url: "auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    forgotPassword: builder.mutation<{ message: string }, { email?: string; phonenumber?: string; countryCode?: string }>({
      query: (data) => ({
        url: "auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<{ message: string }, { token: string; password: string }>({
      query: (data) => ({
        url: "auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { 
  useGetUserQuery, 
  useLoginUserMutation, 
  useRegisterUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation
} = userApi;
