import { useFormik, FormikConfig, FormikValues } from "formik";
import * as Yup from "yup";

interface UseFormProps<T> extends FormikConfig<T> {
  initialValues: T;
  validationSchema: Record<keyof T, Yup.Schema>; // Yup schema for each field
  onSubmit: (values: T) => void | Promise<void>;
}

export function useForm<T extends FormikValues>({ initialValues, validationSchema, onSubmit }: UseFormProps<T>) {
  return useFormik<T>({
    initialValues,
    validationSchema: Yup.object().shape(validationSchema),
    onSubmit,
  });
}
