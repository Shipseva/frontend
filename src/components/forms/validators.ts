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
