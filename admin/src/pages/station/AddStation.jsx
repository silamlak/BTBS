import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { addStationFun } from "../../features/station/stationApi";
import { getTsoListFun } from "../../features/tso/tsoApi";

const AddStation = () => {
  const navigate = useNavigate();

  // Define Yup schema for validation
  const schema = Yup.object({
    name: Yup.string().required("Name is required."),
    location: Yup.string().required("Location is required."),
    contact_number: Yup.string().required("Contact number is required."),
    tso_id: Yup.string().required("Driver selection is required."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["stations_list"],
    queryFn: getTsoListFun,
    keepPreviousData: true,
  });

  const mutation = useMutation({
    mutationFn: addStationFun,
    onSuccess: (data) => {
      navigate("/station");
      console.log(data.msg);
    },
  });

  const onSubmit = (formData) => {
    mutation.mutate(formData);
  };

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Add Station
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Input Fields */}
        {["name", "location", "contact_number"].map((field) => (
          <div key={field}>
            <label className="block text-gray-700 dark:text-gray-300 capitalize">
              {field.replace("_", " ")}
            </label>
            <input
              {...register(field)}
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            {errors[field] && (
              <p className="text-red-500">{errors[field].message}</p>
            )}
          </div>
        ))}

        {/* Dropdown for Driver Selection */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Driver
          </label>
          <select
            {...register("tso_id")}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option value="">Select a Tso</option>
            {!isLoading &&
              !isError &&
              data?.map((tso) => (
                <option key={tso._id} value={tso._id}>
                  {tso.first_name} {/* Replace with the appropriate field */}
                </option>
              ))}
          </select>
          {errors.tso_id && (
            <p className="text-red-500">{errors.tso_id.message}</p>
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
          <p className="text-green-500 mt-4">Station added successfully!</p>
        )}
      </form>
    </div>
  );
};

export default AddStation;
