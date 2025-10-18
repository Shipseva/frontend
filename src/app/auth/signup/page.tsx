"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Check, Building2, Clock, RefreshCw } from "lucide-react";
import { RegistrationData, UserRole } from "@/types/user";
import { useRegisterUserMutation, useVerifyEmailMutation, useResendOtpMutation } from "@/store/api/authApi";
import Input from "@/components/forms/Input";
import Select from "@/components/forms/Select";
import Checkbox from "@/components/forms/Checkbox";
import { useForm } from "@/components/forms/useForm";
import { emailValidator, passwordValidator, phoneValidator, nameValidator, requiredValidator } from "@/components/forms/validators";
import * as Yup from "yup";

export default function SignupPage() {
  const [userRole, setUserRole] = useState<UserRole>("individual");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();
  const [registerUser, { isLoading, error }] = useRegisterUserMutation();
  const [verifyEmail, { isLoading: isVerifying, error: verifyError }] = useVerifyEmailMutation();
  const [resendOtp, { isLoading: isResending, error: resendError }] = useResendOtpMutation();

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const countryCodeOptions = [
    { label: "+1", value: "+1" },
    { label: "+44", value: "+44" },
    { label: "+91", value: "+91" },
    { label: "+86", value: "+86" },
    { label: "+33", value: "+33" },
    { label: "+49", value: "+49" },
    { label: "+81", value: "+81" },
    { label: "+61", value: "+61" },
    { label: "91", value: "+91" },
  ];

  const formik = useForm({
    initialValues: {
      companyName: "",
      name: "",
      email: "",
      phonenumber: "",
      countryCode: "+1",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
      role: "individual" as UserRole,
    },
    validationSchema: {
      companyName: userRole === "agency" ? requiredValidator("Company name") : Yup.string(),
      name: nameValidator,
      email: emailValidator,
      phonenumber: phoneValidator,
      countryCode: Yup.string().required(),
      password: passwordValidator,
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
      acceptTerms: Yup.boolean()
        .oneOf([true], 'You must accept the terms and conditions'),
      role: Yup.string().required(),
    },
    onSubmit: async (values) => {
      try {
        const registrationData: RegistrationData = {
          name: values.name,
          phone: `${values.countryCode}${values.phonenumber}`,
          email: values.email,
          companyName: values.companyName || "",
          password: values.password,
          role: values.role
        };
        
        const result = await registerUser(registrationData).unwrap();
        console.log('Registration successful:', result);
        
        // Show OTP verification screen
        setUserEmail(values.email);
        setShowOtpVerification(true);
        setCountdown(60); // 1 minute countdown
      } catch (err) {
        console.error('Registration failed:', err);
        // Error is handled by the error state from the mutation
      }
    },
  });

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    formik.setFieldValue('role', role);
    if (role === "individual") {
      formik.setFieldValue('companyName', '');
    }
  };

  // OTP verification form
  const otpForm = useForm({
    initialValues: {
      otp: "",
    },
    validationSchema: {
      otp: Yup.string()
        .required("OTP is required")
        .length(6, "OTP must be 6 digits")
        .matches(/^\d+$/, "OTP must contain only numbers"),
    },
    onSubmit: async (values) => {
      try {
        const result = await verifyEmail({
          code: values.otp,
          email: userEmail,
        }).unwrap();
        console.log('Email verified:', result);
        router.push("/dashboard");
      } catch (err) {
        console.error('Email verification failed:', err);
      }
    },
  });

  const handleResendOtp = async () => {
    try {
      await resendOtp({ email: userEmail }).unwrap();
      setCountdown(60); // Reset countdown
    } catch (err) {
      console.error('Resend OTP failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-accent flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">ShipSeva</h1>
          <p className="text-white/80">Join thousands of businesses shipping smarter</p>
        </div>

        {/* OTP Verification Screen */}
        {showOtpVerification ? (
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
              <p className="text-gray-600">
                We've sent a 6-digit verification code to
                <br />
                <span className="font-medium text-primary">{userEmail}</span>
              </p>
            </div>

            <form onSubmit={otpForm.handleSubmit} className="space-y-6">
              {/* OTP Input */}
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Verification Code <span className="text-red-500">*</span>
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  maxLength={6}
                  value={otpForm.values.otp}
                  onChange={otpForm.handleChange}
                  onBlur={otpForm.handleBlur}
                  className={`block w-full px-4 py-3 border rounded-lg text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-colors ${
                    otpForm.touched.otp && otpForm.errors.otp ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="000000"
                />
                {otpForm.touched.otp && otpForm.errors.otp && (
                  <p className="mt-1 text-sm text-red-600">{otpForm.errors.otp}</p>
                )}
              </div>

              {/* Error Display */}
              {(verifyError || resendError) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">
                    {verifyError?.data?.message || resendError?.data?.message || "Verification failed. Please try again."}
                  </p>
                </div>
              )}

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 px-4 rounded-lg font-medium hover:from-primary-light hover:to-accent-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                {isVerifying ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Verify Email
                    <Check className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>

              {/* Resend OTP */}
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-2">
                  Didn't receive the code?
                </p>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || isResending}
                  className="text-primary hover:text-primary-light font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                >
                  {isResending ? (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                </button>
              </div>

              {/* Back to Signup */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpVerification(false);
                    setUserEmail("");
                    setCountdown(0);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
                >
                  ← Back to signup
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Signup Form */
          <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Get started with your logistics management journey</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* User Role Selection */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => handleRoleChange("individual")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  userRole === "individual"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <User className="h-4 w-4 inline mr-2" />
                Individual
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange("agency")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  userRole === "agency"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Building2 className="h-4 w-4 inline mr-2" />
                Agency
              </button>
            </div>

            {/* Company Name Field (only for agency) */}
            {userRole === "agency" && (
              <Input
                label="Company Name"
                name="companyName"
                type="text"
                required
                value={formik.values.companyName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.companyName && formik.errors.companyName ? formik.errors.companyName : undefined}
                icon={<Building2 className="h-5 w-5 text-gray-400" />}
                placeholder="Enter your company name"
              />
            )}

            {/* Name Field */}
            <Input
              label={userRole === "agency" ? "Contact Person Name" : "Full Name"}
              name="name"
              type="text"
              required
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && formik.errors.name ? formik.errors.name : undefined}
              icon={<User className="h-5 w-5 text-gray-400" />}
              placeholder={userRole === "agency" ? "Contact person name" : "Enter your full name"}
            />

            {/* Email Field */}
            <Input
              label="Email Address"
              name="email"
              type="email"
              required
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
              icon={<Mail className="h-5 w-5 text-gray-400" />}
              placeholder="Enter your email"
            />

            {/* Phone Field */}
            <div>
              <label htmlFor="phonenumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="w-24">
                  <Select
                    name="countryCode"
                    options={countryCodeOptions}
                    value={formik.values.countryCode}
                    onChange={formik.handleChange}
                    className="text-sm"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    name="phonenumber"
                    type="tel"
                    value={formik.values.phonenumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.phonenumber && formik.errors.phonenumber ? formik.errors.phonenumber : undefined}
                    icon={<Phone className="h-5 w-5 text-gray-400" />}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-colors ${
                      formik.touched.password && formik.errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Create password"
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

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-colors ${
                      formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <Checkbox
              name="acceptTerms"
              checked={formik.values.acceptTerms}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.acceptTerms && formik.errors.acceptTerms ? formik.errors.acceptTerms : undefined}
              required
              label={
                <>
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:text-primary-light">
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:text-primary-light">
                    Privacy Policy
                  </Link>
                </>
              }
            />

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">
                  Registration failed. Please check your information and try again.
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
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-primary hover:text-primary-light font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
        )}

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