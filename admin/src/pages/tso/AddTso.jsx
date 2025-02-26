import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useNavigate } from "react-router-dom";
import { addTsoFun } from "../../features/tso/tsoApi";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const AddTso = () => {
  const navigate = useNavigate();

  // Define Yup schema for validation
  const schema = Yup.object({
    first_name: Yup.string().required("First name is required."),
    middle_name: Yup.string(),
    last_name: Yup.string().required("Last name is required."),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required."),
    phone: Yup.string().required("Phone is required."),
    password: Yup.string().required("Password is required."),
    hire_date: Yup.string(),
    salary: Yup.number().required("Salary is required."),
    address: Yup.object({
      street: Yup.string().required("Street is required."),
      city: Yup.string().required("City is required."),
    }),
    employment_status: Yup.string().required("Employment status is required."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: addTsoFun,
    onSuccess: () => {
      navigate("/tso");
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Add Ticket Sells Officer
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
          {errors["address.street"] && (
            <p className="text-red-500">{errors["address.street"].message}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">City</label>
          <input
            {...register("address.city")}
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
          {errors["address.city"] && (
            <p className="text-red-500">{errors["address.city"].message}</p>
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
          <p className="text-green-500 mt-4">
            Ticket Sells Officer added successfully!
          </p>
        )}
      </form>
    </div>
  );
};

export default AddTso;
