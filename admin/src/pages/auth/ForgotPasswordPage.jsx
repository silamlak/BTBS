// ForgotPasswordPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { requestResetApi } from "../../features/auth/authApi";
import Loader from "../../components/Loader";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

    const mutation = useMutation({
      mutationFn: requestResetApi,
      onSuccess: (data) => {
        toast.success("Reset Token Sent Check Your Email");
        navigate("/reset/password", { replace: true });
      },
      onError: (err) => {
        toast.error(err.data.msg);
      },
    });


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email)
    mutation.mutate({email})
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">Forgot Password</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="flex gap-3 justify-center items-center px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          <p>Send Confirmation Code</p>
          {mutation.isPending && <Loader />}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
