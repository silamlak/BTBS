import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { addStationFun } from "../../features/station/stationApi";
import { getRoutesListFun } from "../../features/route/routeApi";
import { getRoutesBusesListFun } from "../../features/buses/busApi";
import { addScheduleFun } from "../../features/schedule/scheduleApi";

const AddSchedule = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    schedule_id: "",
    schedule_date: "",
    from: "",
    to: "",
    departure_time: "",
    arrival_time: "",
    ticket_price: "",
    route_id: "",
    bus_id: [],
  });

  const [errors, setErrors] = useState({});
  const mutation = useMutation({
    mutationFn: addScheduleFun,
    onSuccess: (data) => {
      navigate("/schedule");
      console.log(data.msg);
    },
  });

  const {
    data: routeData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["routes"],
    queryFn: () => getRoutesListFun(),
    keepPreviousData: true,
  });

  const {
    data: busData,
    isLoading: isBusLoading,
    isError: isBusError,
  } = useQuery({
    queryKey: ["buses", formData.route_id],
    queryFn: () =>
      getRoutesBusesListFun(
        formData.route_id,
        formData.schedule_date,
        formData.from,
        formData.to
      ),
    keepPreviousData: true,
    enabled:
      !!formData.route_id &&
      !!formData.schedule_date &&
      !!formData.from &&
      !!formData.to,
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
      mutation.mutate({
        ...formData,
        bus_id: formData.bus_id.map((bus) => bus.value),
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Add Bus Schedule
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Select Route
          </label>
          <select
            name="route_id"
            value={formData.route_id}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          >
            <option value="">Select a Route</option>
            {!isLoading &&
              !isError &&
              routeData?.map((route) => (
                <option key={route._id} value={route._id}>
                  {route.route_name}
                </option>
              ))}
          </select>
          {errors.route_id && <p className="text-red-500">{errors.route_id}</p>}
        </div>

        {formData.route_id && (
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Schedule Date
            </label>
            <input
              name="schedule_date"
              value={formData.schedule_date}
              onChange={handleChange}
              type="date"
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-2 bg-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
            {errors.schedule_date && (
              <p className="text-red-500">{errors.schedule_date}</p>
            )}
          </div>
        )}

        {formData.schedule_date && (
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              From
            </label>
            <input
              name="from"
              value={formData.from}
              onChange={handleChange}
              type="text"
              className="w-full px-4 py-2 bg-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
            {errors.from && <p className="text-red-500">{errors.from}</p>}
          </div>
        )}

        {formData.from && (
          <div>
            <label className="block text-gray-700 dark:text-gray-300">To</label>
            <input
              name="to"
              value={formData.to}
              onChange={handleChange}
              type="text"
              className="w-full px-4 py-2 bg-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
            {errors.to && <p className="text-red-500">{errors.to}</p>}
          </div>
        )}

        {formData.to && (
          <>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">
                Buses
              </label>
              <Select
                isMulti
                name="bus_id"
                options={
                  !isBusLoading && !isBusError
                    ? busData?.map((bus) => ({
                        value: bus._id,
                        label: bus.bus_id,
                      }))
                    : []
                }
                value={formData.bus_id}
                onChange={(selectedOptions) => {
                  if (selectedOptions.length <= 2) {
                    setFormData((prevData) => ({
                      ...prevData,
                      bus_id: selectedOptions,
                    }));
                  } else {
                    alert("You can select up to 2 buses only.");
                  }
                }}
                className="basic-multi-select"
                classNamePrefix="select"
              />
              {errors.bus_id && <p className="text-red-500">{errors.bus_id}</p>}
            </div>

            {[
              "schedule_id",
              "departure_time",
              "arrival_time",
              "ticket_price",
            ].map((field) => (
              <div key={field}>
                <label className="block text-gray-700 dark:text-gray-300 capitalize">
                  {field.replace("_", " ")}
                </label>
                <input
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  type="text"
                  className="w-full px-4 py-2 bg-gray-100 border text-slate-9 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                />
                {errors[field] && (
                  <p className="text-red-500">{errors[field]}</p>
                )}
              </div>
            ))}
          </>
        )}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? "Submitting..." : "Submit"}
        </button>

        {mutation.isSuccess && (
          <p className="text-green-500 mt-4">Schedule added successfully!</p>
        )}
      </form>
    </div>
  );
};

export default AddSchedule;
