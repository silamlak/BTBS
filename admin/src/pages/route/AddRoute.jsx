import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addRouteFun } from "../../features/route/routeApi";
import { getBusesListFun } from "../../features/buses/busApi";
import Select from "react-select";

const AddRoute = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    route_id: "",
    route_name: "",
    start_location: "",
    end_location: "",
    total_distance: "",
    estimated_time: "",
    stops: {
      stop_name: "",
      location: "",
    },
    bus_id: [], // Updated to store multiple selected buses
  });

  const [errors, setErrors] = useState({});
  const mutation = useMutation({
    mutationFn: addRouteFun,
    onSuccess: (data) => {
      navigate("/route");
      console.log(data.msg);
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["buses_list"],
    queryFn: getBusesListFun,
    keepPreviousData: true,
  });

  console.log(formData.bus_id);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("stops.")) {
      const field = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        stops: {
          ...prevData.stops,
          [field]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.bus_id.length) {
      errors.bus_id = "At least 1 bus must be selected.";
    } else if (formData.bus_id.length > 2) {
      errors.bus_id = "You can select up to 2 buses only.";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      mutation.mutate({
        ...formData,
        bus_id: formData.bus_id.map((bus) => bus.value), // Extract IDs for API submission
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add Route</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input Fields */}
        {[
          "route_id",
          "route_name",
          "start_location",
          "end_location",
          "total_distance",
          "estimated_time",
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

        <div>
          <label className="block text-gray-700">Stops</label>
          <input
            name="stops.stop_name"
            value={formData.stops.stop_name}
            onChange={handleChange}
            type="text"
            placeholder="Stop Name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors["stops.stop_name"] && (
            <p className="text-red-500">{errors["stops.stop_name"]}</p>
          )}
        </div>
        <div>
          <input
            name="stops.location"
            value={formData.stops.location}
            onChange={handleChange}
            type="text"
            placeholder="Location"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors["stops.location"] && (
            <p className="text-red-500">{errors["stops.location"]}</p>
          )}
        </div>

        {/* Multi-Select Dropdown for Buses */}
        <div>
          <label className="block text-gray-700">Buses</label>
          <Select
            isMulti
            name="bus_id"
            options={
              !isLoading && !isError
                ? data?.map((bus) => ({
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

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
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
