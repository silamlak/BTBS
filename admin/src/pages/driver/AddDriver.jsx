import { useMutation } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDriverFun } from "../../features/drivers/driversApi";

const AddDriver = () => {
  const navigate = useNavigate();

  // Define validation schema using Yup
const schema = Yup.object({
  first_name: Yup.string()
    .matches(/^[A-Za-z]+$/, "First name should contain only letters.")
    .required("First name is required."),
  middle_name: Yup.string()
    .matches(/^[A-Za-z]+$/, "Middle name should contain only letters.")
    .required("Middle name is required."),
  last_name: Yup.string()
    .matches(/^[A-Za-z]+$/, "Last name should contain only letters.")
    .required("Last name is required."),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required."),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits.")
    .required("Phone number is required."),
  password: Yup.string()
    .min(6, "Password should be at least 6 characters.")
    .required("Password is required."),
  salary: Yup.number()
    .positive("Salary must be a positive number.")
    .required("Salary is required."),
  employment_status: Yup.string()
    .matches(
      /^[A-Za-z\s]+$/,
      "Employment status should contain only letters and spaces."
    )
    .required("Employment status is required."),
  address: Yup.object({
    street: Yup.string()
      .matches(
        /^[A-Za-z\s]+$/,
        "Street name should contain only letters and spaces."
      )
      .required("Street is required."),
    city: Yup.string()
      .matches(
        /^[A-Za-z\s]+$/,
        "City name should contain only letters and spaces."
      )
      .required("City is required."),
  }),
});


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: addDriverFun,
    onSuccess: () => {
      navigate("/drivers");
    },
    onError: (err) => {
      console.log(err)
    }
  });

  const onSubmit = (data) => {
    console.log(data)
    mutation.mutate(data);
  };

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Add Driver
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Input Fields */}
        {[
          "first_name",
          "middle_name",
          "last_name",
          "email",
          "phone",
          "password",
          "salary",
          "employment_status",
        ].map((field) => (
          <div key={field}>
            <label className="block text-gray-700 dark:text-gray-300 capitalize">
              {field.replace("_", " ")}
            </label>
            <input
              {...register(field)}
              type={field === "password" ? "password" : "text"}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            {errors[field] && (
              <p className="text-red-500">{errors[field].message}</p>
            )}
          </div>
        ))}

        {/* Address Fields */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Street
          </label>
          <input
            {...register("address.street")}
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
          {errors.address?.street && (
            <p className="text-red-500">{errors.address.street.message}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">City</label>
          <input
            {...register("address.city")}
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
          {errors.address?.city && (
            <p className="text-red-500">{errors.address.city.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          {mutation.isLoading ? "Submitting..." : "Submit"}
        </button>

        {/* Success Message */}
        {mutation.isSuccess && (
          <p className="text-green-500 mt-4">Driver added successfully!</p>
        )}
      </form>
    </div>
  );
};

export default AddDriver;
