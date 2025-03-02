import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addBusFun } from "../../features/buses/busApi";
import { getDriversListFun } from "../../features/drivers/driversApi";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const AddBus = () => {
  const navigate = useNavigate();

  // React Hook Form setup
  const schema = Yup.object({
    status: Yup.string().required("Status is required."),
    fuel_type: Yup.string().required("Fuel type is required."),
    seating_capacity: Yup.string().required("Seating capacity is required."),
    model: Yup.string().required("Model is required."),
    make: Yup.string().required("Make is required."),
    license_plate: Yup.string().required("License plate is required."),
    bus_id: Yup.string().required("Bus ID is required."),
    driver_id: Yup.string().required("Driver is required."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["drivers_list"],
    queryFn: getDriversListFun,
    keepPreviousData: true,
  });

  const mutation = useMutation({
    mutationFn: addBusFun,
    onSuccess: () => {
      navigate("/buses");
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Add Bus
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Status Dropdown */}
        <div className="flex flex-col">
          <label
            htmlFor="status"
            className="text-[13px] text-gray-700 dark:text-gray-300"
          >
            Status
          </label>
          <select
            id="status"
            {...register("status")}
            className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="In Service">In Service</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Retired">Retired</option>
          </select>
          {errors.status && (
            <p className="text-red-500">{errors.status.message}</p>
          )}
        </div>

        {/* Other input fields (excluding year_of_manufacture) */}
        {[
          "fuel_type",
          "seating_capacity",
          "make",
          "model",
          "license_plate",
          "bus_id",
        ].map((field) => (
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

        {/* Driver Dropdown */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Driver
          </label>
          <select
            {...register("driver_id")}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option value="">Select a driver</option>
            {!isLoading &&
              !isError &&
              data?.map((driver) => (
                <option key={driver._id} value={driver._id}>
                  {driver.first_name} {driver.last_name}
                </option>
              ))}
          </select>
          {errors.driver_id && (
            <p className="text-red-500">{errors.driver_id.message}</p>
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
          <p className="text-green-500 mt-4">Bus added successfully!</p>
        )}
      </form>
    </div>
  );
};

export default AddBus;
