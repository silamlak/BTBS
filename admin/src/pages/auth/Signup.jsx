import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../../utils/authentication";
import { useMutation } from "@tanstack/react-query";
import { signupApi } from "../../features/auth/authApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

    const mutation = useMutation({
      mutationFn: signupApi,
      onSuccess: (data) => {
        // console.log(data)
        navigate(`/confirmation?email=${encodeURIComponent(data.email)}`, {
          replace: true,
        });
        reset();
      },
      onError: (err) => {
        // console.log(err)
        toast.error(err.data.msg)
        navigate(`/confirmation?email=${encodeURIComponent(data.email)}`, {
          replace: true,
        });
        reset();
      },
    });

  const onSubmit = (data) => {
        const formattedData = {
          ...data,
          ethPhone: data.ethPhone.startsWith("9")
            ? `+251${data.ethPhone}`
            : data.ethPhone,
        };
    console.log("Form data:", formattedData);
    mutation.mutate(formattedData)
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              {...register("first_name")}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.first_name ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {errors.first_name && (
              <div className="mt-2 text-sm text-red-600">
                {errors.first_name.message}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="father_name"
              className="block text-sm font-medium text-gray-700"
            >
              Father Name
            </label>
            <input
              id="father_name"
              name="father_name"
              type="text"
              {...register("father_name")}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.father_name ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {errors.father_name && (
              <div className="mt-2 text-sm text-red-600">
                {errors.father_name.message}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="ethPhone"
              className="block text-sm font-medium text-gray-700"
            >
              Ethiopian Phone
            </label>
            <input
              id="ethPhone"
              name="ethPhone"
              type="text"
              {...register("ethPhone")}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.ethPhone ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {errors.ethPhone && (
              <div className="mt-2 text-sm text-red-600">
                {errors.ethPhone.message}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              {...register("email")}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {errors.email && (
              <div className="mt-2 text-sm text-red-600">
                {errors.email.message}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              {...register("password")}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {errors.password && (
              <div className="mt-2 text-sm text-red-600">
                {errors.password.message}
              </div>
            )}
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
