import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addRouteFun } from "../../features/route/routeApi";

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
     location: ""
   },
 });

 const [errors, setErrors] = useState({});
 const mutation = useMutation({
   mutationFn: addRouteFun,
   onSuccess: (data) => {
     navigate("/route");
     console.log(data.msg);
   },
 });

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
   for (const [key, value] of Object.entries(formData)) {
     if (key === "stops") {
       for (const [subKey, subValue] of Object.entries(value)) {
         if (!subValue) {
           errors[`stops.${subKey}`] = `${
             subKey.charAt(0).toUpperCase() + subKey.slice(1)
           } is required.`;
         }
       }
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
         <label className="block text-gray-700">stop_name</label>
         <input
           name="stops.stop_name"
           value={formData.stops.stop_name}
           onChange={handleChange}
           type="text"
           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
         />
         {errors["stops.stop_name"] && (
           <p className="text-red-500">{errors["stops.stop_name"]}</p>
         )}
       </div>
       <div>
         <label className="block text-gray-700">location</label>
         <input
           name="stops.location"
           value={formData.stops.location}
           onChange={handleChange}
           type="text"
           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
         />
         {errors["stops.location"] && (
           <p className="text-red-500">{errors["stops.location"]}</p>
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

export default AddRoute;
