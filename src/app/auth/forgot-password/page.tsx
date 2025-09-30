"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight, ArrowLeft, CheckCircle, Phone } from "lucide-react";

export default function ForgotPasswordPage() {
  const [resetMethod, setResetMethod] = useState<"email" | "phone">("email");
  const [formData, setFormData] = useState({
    email: "",
    phonenumber: "",
    countryCode: "+1",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleResetMethodChange = (method: "email" | "phone") => {
    setResetMethod(method);
    // Clear the other field when switching methods
    setFormData({
      ...formData,
      email: method === "email" ? formData.email : "",
      phonenumber: method === "phone" ? formData.phonenumber : "",
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-accent flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">ShipSeva</h1>
            <p className="text-white/80">Password reset sent successfully</p>
          </div>

          {/* Success Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {resetMethod === "email" ? "Check Your Email" : "Check Your Phone"}
              </h2>
              <p className="text-gray-600">
                We've sent a password reset {resetMethod === "email" ? "link" : "code"} to{" "}
                <strong>
                  {resetMethod === "email" 
                    ? formData.email 
                    : `${formData.countryCode} ${formData.phonenumber}`
                  }
                </strong>
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Didn't receive the {resetMethod === "email" ? "email" : "SMS"}? 
                {resetMethod === "email" ? " Check your spam folder or try again." : " Check your messages or try again."}
              </p>
              
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Try Different {resetMethod === "email" ? "Email" : "Phone"}
              </button>
            </div>

            {/* Back to login */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link
                href="/auth/login"
                className="inline-flex items-center text-primary hover:text-primary-light font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Link>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-accent flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">ShipSeva</h1>
          <p className="text-white/80">Reset your password securely</p>
        </div>

        {/* Forgot Password Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
            <p className="text-gray-600">
              No worries! Enter your {resetMethod === "email" ? "email address" : "phone number"} and we'll send you a {resetMethod === "email" ? "link" : "code"} to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Reset Method Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => handleResetMethodChange("email")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  resetMethod === "email"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Mail className="h-4 w-4 inline mr-2" />
                Email
              </button>
              <button
                type="button"
                onClick={() => handleResetMethodChange("phone")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  resetMethod === "phone"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Phone className="h-4 w-4 inline mr-2" />
                Phone
              </button>
            </div>

            {/* Email or Phone Field */}
            {resetMethod === "email" ? (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="Enter your registered email"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="phonenumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <div className="w-24">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    >
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+91">+91</option>
                      <option value="+86">+86</option>
                      <option value="+33">+33</option>
                      <option value="+49">+49</option>
                      <option value="+81">+81</option>
                      <option value="+61">+61</option>
                    </select>
                  </div>
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phonenumber"
                      name="phonenumber"
                      type="tel"
                      required
                      value={formData.phonenumber}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder="Enter your registered phone number"
                    />
                  </div>
                </div>
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
                  Send Reset {resetMethod === "email" ? "Link" : "Code"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Back to login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Remembered your password?{" "}
              <Link
                href="/auth/login"
                className="text-primary hover:text-primary-light font-medium transition-colors"
              >
                Sign in here
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
