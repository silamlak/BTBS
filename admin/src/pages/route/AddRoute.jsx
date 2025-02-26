import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addRouteFun } from "../../features/route/routeApi";
import { getBusesListFun } from "../../features/buses/busApi";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const AddRoute = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["buses_list"],
    queryFn: getBusesListFun,
    keepPreviousData: true,
  });

  // Validation schema with Yup
  const validationSchema = Yup.object({
    route_id: Yup.string().required("Route ID is required"),
    route_name: Yup.string().required("Route name is required"),
    start_location: Yup.string().required("Start location is required"),
    end_location: Yup.string().required("End location is required"),
    total_distance: Yup.string().required("Total distance is required"),
    estimated_time: Yup.string().required("Estimated time is required"),
    stops: Yup.object({
      stop_name: Yup.string(),
      location: Yup.string(),
    }),
    bus_id: Yup.array().min(1, "At least one bus must be selected").max(2, "You can select up to 2 buses"),
  });

  // React Hook Form setup
  const { control, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      bus_id: [],
      stops: {
        stop_name: "",
        location: "",
      },
    },
  });

  const [selectedBuses, setSelectedBuses] = useState([]);

  const mutation = useMutation({
    mutationFn: addRouteFun,
    onSuccess: (data) => {
      navigate("/route");
      console.log(data.msg);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate({
      ...data,
      bus_id: data.bus_id.map((bus) => bus.value),
    });
  };

  return (
    <div className="max-w-lg mx-auto bg-gray-900 p-6 rounded-lg shadow-md dark:bg-gray-900">
      <h2 className="text-3xl font-bold mb-6 text-white">Add Route</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Route ID */}
        <div>
          <label className="block text-gray-300 dark:text-gray-100">Route ID</label>
          <input
            {...control.register("route_id")}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
          {errors.route_id && <p className="text-red-500 mt-2">{errors.route_id.message}</p>}
        </div>

        {/* Route Name */}
        <div>
          <label className="block text-gray-300 dark:text-gray-100">Route Name</label>
          <input
            {...control.register("route_name")}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
          {errors.route_name && <p className="text-red-500 mt-2">{errors.route_name.message}</p>}
        </div>

        {/* Start Location */}
        <div>
          <label className="block text-gray-300 dark:text-gray-100">Start Location</label>
          <input
            {...control.register("start_location")}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
          {errors.start_location && <p className="text-red-500 mt-2">{errors.start_location.message}</p>}
        </div>

        {/* End Location */}
        <div>
          <label className="block text-gray-300 dark:text-gray-100">End Location</label>
          <input
            {...control.register("end_location")}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
          {errors.end_location && <p className="text-red-500 mt-2">{errors.end_location.message}</p>}
        </div>

        {/* Total Distance */}
        <div>
          <label className="block text-gray-300 dark:text-gray-100">Total Distance</label>
          <input
            {...control.register("total_distance")}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
          {errors.total_distance && <p className="text-red-500 mt-2">{errors.total_distance.message}</p>}
        </div>

        {/* Estimated Time */}
        <div>
          <label className="block text-gray-300 dark:text-gray-100">Estimated Time</label>
          <input
            {...control.register("estimated_time")}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
          {errors.estimated_time && <p className="text-red-500 mt-2">{errors.estimated_time.message}</p>}
        </div>

        {/* Stops - Stop Name */}
        <div>
          <label className="block text-gray-300 dark:text-gray-100">Stop Name</label>
          <input
            {...control.register("stops.stop_name")}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
          {errors.stops?.stop_name && <p className="text-red-500 mt-2">{errors.stops.stop_name.message}</p>}
        </div>

        {/* Stops - Location */}
        <div>
          <label className="block text-gray-300 dark:text-gray-100">Location</label>
          <input
            {...control.register("stops.location")}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
          {errors.stops?.location && <p className="text-red-500 mt-2">{errors.stops.location.message}</p>}
        </div>

        {/* Multi-Select Dropdown for Buses */}
        <div>
          <label className="block text-gray-300 dark:text-gray-100">Select Buses</label>
          <Controller
            name="bus_id"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                options={
                  !isLoading && !isError
                    ? data?.map((bus) => ({
                        value: bus._id,
                        label: bus.bus_id,
                      }))
                    : []
                }
                onChange={(selected) => {
                  setSelectedBuses(selected);
                  field.onChange(selected);
                }}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            )}
          />
          {errors.bus_id && <p className="text-red-500 mt-2">{errors.bus_id.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          {mutation.isLoading ? "Submitting..." : "Submit"}
        </button>

        {/* Success Message */}
        {mutation.isSuccess && (
          <p className="text-green-500 mt-4">Route added successfully!</p>
        )}
      </form>
    </div>
  );
};

export default AddRoute;
