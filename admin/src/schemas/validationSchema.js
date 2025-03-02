import * as yup from "yup";

export const schema = yup.object().shape({
  first_name: yup
    .string()
    .matches(/^[a-zA-Z]+$/, "First name must contain only letters.")
    .required("First name is required."),
  middle_name: yup
    .string()
    .matches(/^[a-zA-Z]+$/, "Middle name must contain only letters.")
    .required("Middle name is required."),
  last_name: yup
    .string()
    .matches(/^[a-zA-Z]+$/, "Last name must contain only letters.")
    .required("Last name is required."),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required."),
  phone: yup
    .string()
    .matches(
      /^(\+251|0)?(9[0-9]{8})$/,
      "Phone number must be a valid Ethiopian phone number."
    )
    .required("Phone is required."),
  password: yup
    .string()
    .required("Password is required.")
    .min(8, "Password must be at least 8 characters long.")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter.")
    .matches(/[0-9]/, "Password must contain at least one number.")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character."
    )
    .test(
      "no-spaces",
      "Password must not contain spaces.",
      (value) => !/\s/.test(value)
    ),

  salary: yup
    .number()
    .typeError("Salary must be a number.")
    .required("Salary is required."),
  education: yup
    .string()
    .oneOf(
      ["bachelors", "masters", "phd", "other"],
      "Education level must be one of the predefined options."
    )
    .required("Education level is required."),
  // images: yup
  //   .mixed()
  //   .test(
  //     "required",
  //     "Please select exactly two images.",
  //     (value) => value?.length === 2
  //   )
  //   .test("fileType", "Only images are allowed.", (value) =>
  //     Array.from(value || []).every((file) =>
  //       ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
  //     )
  //   )
  //   .test("fileSize", "Each file must be less than 2MB.", (value) =>
  //     Array.from(value || []).every((file) => file.size <= 2 * 1024 * 1024)
  //   ),
});


export const validationSchema = yup.object().shape({
  first_name: yup
    .string()
    .matches(/^[a-zA-Z]+$/, "First name must contain only letters.")
    .required("First name is required."),
  middle_name: yup
    .string()
    .matches(/^[a-zA-Z]+$/, "Middle name must contain only letters.")
    .required("Middle name is required."),
  last_name: yup
    .string()
    .matches(/^[a-zA-Z]+$/, "Last name must contain only letters.")
    .required("Last name is required."),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required."),
  phone: yup
    .string()
    .matches(
      /^(\+251|0)?(9[0-9]{8})$/,
      "Phone number must be a valid Ethiopian phone number."
    )
    .required("Phone is required."),
  employment_status: yup.string().required("Employment Status is required"),
  education: yup
    .string()
    .oneOf(
      ["bachelors", "masters", "phd", "other"],
      "Education level must be one of the predefined options."
    )
    .required("Education level is required."),
});