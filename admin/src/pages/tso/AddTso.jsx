import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDriverFun } from "../../features/drivers/driversApi";
import { addTsoFun } from "../../features/tso/tsoApi";

const AddTso = () => {
 const navigate = useNavigate();
 const [formData, setFormData] = useState({
   first_name: "",
   middle_name: "",
   last_name: "",
   email: "",
   phone: "",
   password: "",
   hire_date: "",
   salary: "",
   address: {
     street: "",
     city: "",
   },
   employment_status: "",
 });

 const [errors, setErrors] = useState({});
 const mutation = useMutation({
   mutationFn: addTsoFun,
   onSuccess: () => {
     navigate("/tso");
   },
 });

 const handleChange = (e) => {
   const { name, value } = e.target;
   if (name.includes("address.")) {
     const field = name.split(".")[1];
     setFormData((prevData) => ({
       ...prevData,
       address: {
         ...prevData.address,
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
     if (key === "address") {
       for (const [subKey, subValue] of Object.entries(value)) {
         if (!subValue) {
           errors[`address.${subKey}`] = `${
             subKey.charAt(0).toUpperCase() + subKey.slice(1)
           } is required.`;
         }
       }
     } else if (!value && key !== "hire_date") {
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
     <h2 className="text-2xl font-bold mb-4">Add Ticket Sells Officer</h2>
     <form onSubmit={handleSubmit} className="space-y-4">
       {/* Input Fields */}
       {[
         "first_name",
         "middle_name",
         "last_name",
         "email",
         "phone",
         "password",
         "salary",
         "employment_status",
       ].map((field) => (
         <div key={field}>
           <label className="block text-gray-700 capitalize">
             {field.replace("_", " ")}
           </label>
           <input
             name={field}
             value={formData[field]}
             onChange={handleChange}
             type={field === "password" ? "password" : "text"}
             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
           />
           {errors[field] && <p className="text-red-500">{errors[field]}</p>}
         </div>
       ))}

       {/* Address Fields */}
       <div>
         <label className="block text-gray-700">Street</label>
         <input
           name="address.street"
           value={formData.address.street}
           onChange={handleChange}
           type="text"
           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
         />
         {errors["address.street"] && (
           <p className="text-red-500">{errors["address.street"]}</p>
         )}
       </div>
       <div>
         <label className="block text-gray-700">City</label>
         <input
           name="address.city"
           value={formData.address.city}
           onChange={handleChange}
           type="text"
           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
         />
         {errors["address.city"] && (
           <p className="text-red-500">{errors["address.city"]}</p>
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
         <p className="text-green-500 mt-4">Driver added successfully!</p>
       )}
     </form>
   </div>
 );
};

export default AddTso;
