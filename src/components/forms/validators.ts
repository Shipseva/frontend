import * as Yup from "yup";

export const emailValidator = Yup.string().email("Invalid email").required("Email is required");
export const passwordValidator = Yup.string()
  .min(8, "Password must be at least 8 characters")
  .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number")
  .required("Password is required");
export const phoneValidator = Yup.string()
  .matches(/^\d{10,15}$/, "Please enter a valid phone number")
  .required("Phone number is required");
export const nameValidator = Yup.string()
  .min(2, "Name must be at least 2 characters")
  .required("Name is required");
export const requiredValidator = (fieldName: string) =>
  Yup.string().required(`${fieldName} is required`);
export const emailOrPhoneValidator = Yup.string()
  .test('email-or-phone', 'Please enter a valid email or phone number', function(value) {
    if (!value) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10,15}$/;
    return emailRegex.test(value) || phoneRegex.test(value.replace(/\D/g, ''));
  })
  .required("Email or phone number is required");

// KYC Validators
export const panValidator = Yup.string()
  .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format (e.g., ABCDE1234F)")
  .required("PAN number is required");

export const aadharValidator = Yup.string()
  .matches(/^[0-9]{12}$/, "Aadhar number must be exactly 12 digits")
  .required("Aadhar number is required");

export const gstValidator = Yup.string()
  .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST format")
  .optional();

export const ifscValidator = Yup.string()
  .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format")
  .optional();

export const accountNumberValidator = Yup.string()
  .matches(/^[0-9]{9,18}$/, "Account number must be 9-18 digits")
  .optional();