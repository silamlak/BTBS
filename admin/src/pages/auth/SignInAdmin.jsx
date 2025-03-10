import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signinSchema } from "../../utils/authentication";
import { useMutation } from "@tanstack/react-query";
import { signinApi } from "../../features/auth/authApi";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, loginData } from "../../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";

const SignInAdmin = () => {
  const isAuth = useSelector((state) => state.auth);
  // console.log(isAuth)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(signinSchema) });

  const mutation = useMutation({
    mutationFn: signinApi,
    onSuccess: (data) => {
      toast.success("successfully loggedin");
      const accessToken = jwtDecode(data.token);
      dispatch(login(data.token));
      dispatch(loginData(accessToken?.user));
      navigate("/", { replace: true });
      reset();
      console.log(accessToken.user);
    },
    onError: (err) => {
      toast.error(err.data.msg);
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    mutation.mutate(data);
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Sign In</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          <div className="flex justify-between items-center">
            <a
              href="/request/reset"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </a>
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign In
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/sign-up" className="text-blue-600 hover:underline">
                Sign Up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInAdmin;
