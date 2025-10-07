"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, User, Lock, ArrowRight } from "lucide-react";
import { useLoginUserMutation } from "@/store/api/authApi";
import { setUser, clearRedirectUrl } from "@/store/slices/userSlice";
import { RootState } from "@/store";
import Input from "@/components/forms/Input";
import { useForm } from "@/components/forms/useForm";
import { emailOrPhoneValidator, requiredValidator } from "@/components/forms/validators";
import * as Yup from "yup";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { redirectUrl } = useSelector((state: RootState) => state.user);
  const [loginUser, { isLoading, error }] = useLoginUserMutation();

  const formik = useForm({
    initialValues: {
      emailOrPhone: "",
      password: "",
    },
    validationSchema: {
      emailOrPhone: emailOrPhoneValidator,
      password: requiredValidator("Password"),
    },
    onSubmit: async (values) => {
      try {
        const loginData = {
          identifier: values.emailOrPhone,
          password: values.password
        };
        
        const result = await loginUser(loginData).unwrap();
        // Token is automatically set as HTTP-only cookie by the server
        // AuthWrapper will handle getUser call with the cookie
        
        // Clear the redirect URL and navigate
        dispatch(clearRedirectUrl());
        
        // Navigate to the stored redirect URL or dashboard
        const targetUrl = redirectUrl || "/dashboard";
        router.push(targetUrl);
      } catch (err) {
        console.error('Login failed:', err);
        // Error is handled by the error state from the mutation
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-accent flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">ShipSeva</h1>
          <p className="text-white/80">Welcome back to your logistics dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-600">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Email or Phone Field */}
            <Input
              label="Email or Phone Number"
              name="emailOrPhone"
              type="text"
              required
              value={formik.values.emailOrPhone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.emailOrPhone && formik.errors.emailOrPhone ? formik.errors.emailOrPhone : undefined}
              icon={<User className="h-5 w-5 text-gray-400" />}
              placeholder="Enter your email or phone number"
            />

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-colors ${
                    formik.touched.password && formik.errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary hover:text-primary-light transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">
                  Login failed. Please check your credentials and try again.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 px-4 rounded-lg font-medium hover:from-primary-light hover:to-accent-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-primary hover:text-primary-light font-medium transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">
            © 2024 ShipSeva. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}