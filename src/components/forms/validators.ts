import * as Yup from "yup";

export const emailValidator = Yup.string().email("Invalid email").required("Email is required");
export const passwordValidator = Yup.string().min(6, "Minimum 6 characters").required("Password is required");
export const requiredValidator = (fieldName: string) =>
  Yup.string().required(`${fieldName} is required`);
