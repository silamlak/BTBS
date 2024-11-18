import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaRegSave } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loader from "../../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { updateStationFun, viewStationFun } from "../../features/station/stationApi";
import { addStationDetail } from "../../features/station/stationSlice";

// Validation Schema
const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  contact_number: yup.string().required("contact_number is required"),
  location: yup.string().required("location is required"),
  // model: yup.string().required("Model is required"),
  // year_of_manufacture: yup
  //   .string()
  //   .required("Year of Manufacture number is required"),
  // seating_capacity: yup.string().required("Seating Capacity is required"),
  // fuel_type: yup.string().required("Fuel Type is required"),
  // status: yup.string().required("Status is required"),
});

const SingleStation = () => {
 const currentData = useSelector((state) => state.bus.currentData);
 const dispatch = useDispatch();
 const { id } = useParams();
 const [password, setPassword] = useState("");
 const { data, isLoading, isError, error } = useQuery({
   queryKey: ["singleBus", id],
   queryFn: () => viewStationFun(id),
   enabled: !!id,
 });
 console.log(data);
 const {
   register,
   handleSubmit,
   reset,
   formState: { errors, isDirty },
 } = useForm({
   resolver: yupResolver(validationSchema),
   defaultValues: {
     name: "",
     location: "",
     contact_number: "",
    //  year_of_manufacture: "",
    //  model: "",
    //  make: "",
    //  license_plate: "",
    //  bus_id: "",
   },
 });

 useEffect(() => {
   if (data) {
     dispatch(addStationDetail(data));
     reset({
       name: data?.name || "",
       location: data.location || "",
       contact_number: data.contact_number || "",
       //  seating_capacity: data.seating_capacity || "",
       //  year_of_manufacture: data.year_of_manufacture || "",
       //  model: data.model || "",
       //  make: data.make || "",
       //  license_plate: data.license_plate || "",
     });
   }
 }, [data, reset]);

 const mutation = useMutation({
   mutationFn: updateStationFun,
   onSuccess: (data) => {
     dispatch(addStationDetail(data?.Bus));
     // console.log(data);
     // reset()
   },
   onError: (err) => {
     console.log(err);
   },
 });

 const onSubmit = (formData) => {
   console.log("object");
   console.log("Saving updated data:", formData);
   mutation.mutate({ id, formData });
 };
 const onPasswordSubmit = () => {
   // Logic for saving the updated data
 };
 const onDelete = () => {
   // Logic for delete
 };
 return (
   <div>
     {isError && error && (
       <div className="p-2 flex bg-red-500 text-white rounded">
         <p>{error?.data || "Something Went Wrong"}</p>
       </div>
     )}
     {isLoading && !isError && !error && (
       <div className="w-full flex justify-center">
         <Loader />
       </div>
     )}
     {!isLoading && !isError && !error && (
       <div>
         <div className="rounded-xl border max-w-4xl bg: bg-slate-50 dark:bg-slate-900 shadow-md p-6">
           <p className="text-slate-800 dark:text-slate-100 text-lg font-semibold max-sm:text-md">
             Bus Detail
           </p>

           <form onSubmit={handleSubmit(onSubmit)}>
             <div className="w-full m-3 gap-2 grid grid-cols-2 max-md:grid-cols-1 my-4 text-slate-800 dark:text-slate-100">
               <div className="flex flex-col gap-2">
                 <div className="flex flex-col">
                   <label htmlFor="name" className="text-[13px]">
                     Name
                   </label>
                   <input
                     id="name"
                     {...register("name")}
                     type="text"
                     className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                   />
                   {errors.name && (
                     <p className="text-red-500 text-sm">
                       {errors.name.message}
                     </p>
                   )}
                 </div>
                 <div className="flex flex-col">
                   <label htmlFor="location" className="text-[13px]">
                     Location
                   </label>
                   <input
                     id="location"
                     {...register("location")}
                     type="text"
                     className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                   />
                   {errors.location && (
                     <p className="text-red-500 text-sm">
                       {errors.location.message}
                     </p>
                   )}
                 </div>
                 <div className="flex flex-col">
                   <label htmlFor="contact_number" className="text-[13px]">
                     contact_number
                   </label>
                   <input
                     id="contact_number"
                     {...register("contact_number")}
                     type="text"
                     className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                   />
                   {errors.contact_number && (
                     <p className="text-red-500 text-sm">
                       {errors.contact_number.message}
                     </p>
                   )}
                 </div>
                 {/* <div className="flex flex-col">
                   <label htmlFor="model" className="text-[13px]">
                     Model
                   </label>
                   <input
                     id="model"
                     {...register("model")}
                     type="text"
                     className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                   />
                   {errors.model && (
                     <p className="text-red-500 text-sm">
                       {errors.model.message}
                     </p>
                   )}
                 </div>
                 <div className="flex flex-col">
                   <label htmlFor="year_of_manufacture" className="text-[13px]">
                     Year of Manufacture
                   </label>
                   <input
                     id="year_of_manufacture"
                     {...register("year_of_manufacture")}
                     type="text"
                     className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                   />
                   {errors.year_of_manufacture && (
                     <p className="text-red-500 text-sm">
                       {errors.year_of_manufacture.message}
                     </p>
                   )}
                 </div> */}
                 {/* <div className="flex flex-col">
                    <label htmlFor="date" className="text-[13px]">
                      Date
                    </label>
                    <input
                      id="date"
                      type="text"
                      value={
                        new Date(currentData?.createdAt).toLocaleDateString() ||
                        ""
                      }
                      disabled
                      className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                    />
                  </div> */}
               </div>

               {/* <div className="flex flex-col gap-2">
                 <div className="flex flex-col">
                   <label htmlFor="status" className="text-[13px]">
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
                     <option value="Under Maintenance">
                       Under Maintenance
                     </option>
                     <option value="Retired">Retired</option>
                   </select>
                   {errors.status && (
                     <p className="text-red-500 text-sm">
                       {errors.status.message}
                     </p>
                   )}
                 </div>
                 <div className="flex flex-col">
                   <label htmlFor="seating_capacity" className="text-[13px]">
                     Seating Capacity
                   </label>
                   <input
                     id="seating_capacity"
                     {...register("seating_capacity")}
                     type="text"
                     className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                   />
                   {errors.seating_capacity && (
                     <p className="text-red-500 text-sm">
                       {errors.seating_capacity.message}
                     </p>
                   )}
                 </div>
                 <div className="flex flex-col">
                   <label htmlFor="fuel_type" className="text-[13px]">
                     Fuel Type
                   </label>
                   <input
                     id="fuel_type"
                     {...register("fuel_type")}
                     type="text"
                     className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                   />
                   {errors.fuel_type && (
                     <p className="text-red-500 text-sm">
                       {errors.fuel_type.message}
                     </p>
                   )}
                 </div>
               </div> */}
             </div>

             <div className="w-full flex justify-center gap-6">
               <button
                 type="submit"
                 className={`flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded ${
                   !isDirty ? "opacity-50 cursor-not-allowed" : ""
                 }`}
                 disabled={!isDirty}
               >
                 <FaRegSave /> Save
                 {mutation.isPending && <Loader />}
               </button>
               <button
                 onClick={onDelete}
                 className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded"
               >
                 <MdDeleteOutline /> Delete
               </button>
             </div>
           </form>
         </div>
       </div>
     )}
   </div>
 );
};

export default SingleStation;
