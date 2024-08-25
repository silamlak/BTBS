import * as yup from "yup";

export const signinSchema = yup
  .object({
    email: yup
      .string()
      .email("Email must be a valid email")
      .required("Email is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  })
  .required();

const ethiopianPhoneRegExp = /^9\d{8}$/;

const formatPhoneNumber = (value) => {
  if (value && value.startsWith("9")) {
    return `+251${value}`;
  }
  return value;
};

export const signupSchema = yup
  .object({
    first_name: yup.string().required("First name is required"),
    father_name: yup.string().required("Father name is required"),
    ethPhone: yup
      .string()
      // .transform(formatPhoneNumber)
      .matches(ethiopianPhoneRegExp, "Phone number is not valid")
      .required("Phone number is required"),
    email: yup
      .string()
      .email("Email must be a valid email")
      .required("Email is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/\d/, "Password must contain at least one number")
      .matches(
        /[@$!%*?&]/,
        "Password must contain at least one special character"
      )
      .required("Password is required"),
  })
  .required();
