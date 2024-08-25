import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { confirmApi } from "../../features/auth/authApi";
import toast from "react-hot-toast";
import Loader from '../../components/Loader'

const ConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if email is present, if not redirect to previous page
    if (!email) {
      navigate(-1, { replace: true }); // Go back and replace history entry
    }
  }, [email, navigate]);

  const mutation = useMutation({
    mutationFn: confirmApi,
    onSuccess: (data) => {
      toast.success(data.msg);
      navigate(`/sign-in`, {
        replace: true,
      });
    },
    onError: (err) => {
      toast.error(err.data.msg);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      email: email,
      otp: confirmationCode,
    };
    mutation.mutate(data);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">Confirmation</h1>
      <p className="mt-4">
        A confirmation email has been sent to <strong>{email}</strong>.
      </p>
      <p className="mt-2">
        Please check your inbox (and spam/junk folder) for further instructions
        to complete your registration.
      </p>

      <form onSubmit={handleSubmit} className="mt-4">
        <label
          htmlFor="confirmationCode"
          className="block text-sm font-medium text-gray-700"
        >
          Enter the 6-digit confirmation code:
        </label>
        <input
          id="confirmationCode"
          type="text"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
          maxLength={6}
          className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm"
          placeholder="123456"
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {confirmationCode.length === 6 && (
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex justify-center items-center gap-3 mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <p>Confirm</p>
            {mutation.isPending && <Loader />}
          </button>
        )}
      </form>
    </div>
  );
};

export default ConfirmationPage;
