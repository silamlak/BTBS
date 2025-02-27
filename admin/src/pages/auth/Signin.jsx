import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signinSchema } from "../../utils/authentication";
import {useMutation} from '@tanstack/react-query'
import { signinApi } from "../../features/auth/authApi";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, loginData } from "../../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";

const Signin = () => {
  const isAuth = useSelector((state) => state.auth);
// console.log(isAuth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(signinSchema) });

  const mutation = useMutation({
    mutationFn: signinApi,
    onSuccess: (data) => {
      toast.success('successfully loggedin')
      const accessToken = jwtDecode(data.token);
      dispatch(login(data.token));
      dispatch(loginData(accessToken?.user));
      navigate("/", { replace: true });
      reset()
      console.log(accessToken.user);
    },
    onError: (err) => {
      toast.error(err.data.msg)
    },
  })

  const onSubmit = (data) => {
    console.log(data)
    mutation.mutate(data)
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Sign In
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Input */}
          <div className="relative">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="relative">
              <AiOutlineMail
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              />
              <input
                id="email"
                type="email"
                {...register("email", { required: "Email is required" })}
                className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <AiOutlineLock
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              />
              <input
                id="password"
                type="password"
                {...register("password", { required: "Password is required" })}
                className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your password"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signin;
