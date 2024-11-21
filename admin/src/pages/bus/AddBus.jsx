import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addBusFun } from "../../features/buses/busApi";
import { getDriversListFun } from "../../features/drivers/driversApi";

const AddBus = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    status: "",
    fuel_type: "",
    seating_capacity: "",
    year_of_manufacture: "",
    model: "",
    make: "",
    license_plate: "",
    bus_id: "",
    driver_id: "",
  });

    const { data, isLoading, isError } = useQuery({
    queryKey: ["drivers_list"],
    queryFn: () =>
      getDriversListFun(),
    keepPreviousData: true,
  });
  const [errors, setErrors] = useState({});
  const mutation = useMutation({
    mutationFn: addBusFun,
    onSuccess: () => {
      navigate("/buses");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = () => {
    const errors = {};
    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
        errors[key] = `${key.replace("_", " ")} is required.`;
      }
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      mutation.mutate(formData);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add Bus</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input Fields */}
        <div className="flex flex-col">
          <label htmlFor="status" className="text-[13px]">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="In Service">In Service</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Retired">Retired</option>
          </select>
          {errors.status && <p className="text-red-500">{errors.status}</p>}
        </div>
        {[
          // "status",
          "fuel_type",
          "seating_capacity",
          "year_of_manufacture",
          "model",
          "make",
          "license_plate",
          "bus_id",
        ].map((field) => (
          <div key={field}>
            <label className="block text-gray-700 capitalize">
              {field.replace("_", " ")}
            </label>
            <input
              name={field}
              value={formData[field]}
              onChange={handleChange}
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors[field] && <p className="text-red-500">{errors[field]}</p>}
          </div>
        ))}

        {/* Dropdown for Driver Selection */}
        <div>
          <label className="block text-gray-700">Driver</label>
          <select
            name="driver_id"
            value={formData.driver_id}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a driver</option>
            {!isLoading &&
              !isError &&
              data?.map((driver) => (
                <option key={driver._id} value={driver._id}>
                  {driver.first_name}{" "}
                  {/* Replace "name" with the appropriate field */}
                </option>
              ))}
          </select>
          {errors.driver_id && (
            <p className="text-red-500">{errors.driver_id}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
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
