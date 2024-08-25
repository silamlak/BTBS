// ResetPasswordPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { resetPasswordApi } from "../../features/auth/authApi";
import Loader from "../../components/Loader";

const ResetPasswordPage = () => {
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

      const mutation = useMutation({
        mutationFn: resetPasswordApi,
        onSuccess: (data) => {
          toast.success("Reset Token Sent Check Your Email");
          navigate("/", { replace: true });
        },
        onError: (err) => {
          toast.error(err.data.msg);
        },
      });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      password: newPassword,
      resetToken: code
    };
    mutation.mutate(data)
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">Reset Password</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label htmlFor="code" className="block text-sm font-medium">
            Confirmation Code
          </label>
          <input
            type="text"
            id="code"
            name="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="newPassword" className="block text-sm font-medium">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="flex gap-3 justify-center items-center px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          <p>Reset Password</p>
          {mutation.isPending && <Loader />}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
