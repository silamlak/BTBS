import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaRegSave } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loader from "../../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteRouteFun,
  updateRouteFun,
  viewRouteFun,
} from "../../features/route/routeApi";
import { addRouteDetail } from "../../features/route/routeSlice";

// Validation Schema
const validationSchema = yup.object().shape({
  route_id: yup.string().required("route_id is required"),
  route_name: yup.string().required("route_name is required"),
  start_location: yup.string().required("start_location is required"),
  end_location: yup.string().required("end_location is required"),
  total_distance: yup.string().required("total_distance is required"),
  estimated_time: yup.string().required("estimated_time is required"),
  stops: yup.object().shape({
    stop_name: yup.string(),
    location: yup.string(),
  }),
});


const SingleRoute = () => {
 const currentData = useSelector((state) => state.bus.currentData);
 const dispatch = useDispatch();
 const navigate = useNavigate()
 const { id } = useParams();
 const [password, setPassword] = useState("");
 const { data, isLoading, isError, error } = useQuery({
   queryKey: ["singleRoute", id],
   queryFn: () => viewRouteFun(id),
   enabled: !!id,
 });
//  console.log(data);
 const {
   register,
   handleSubmit,
   reset,
   formState: { errors, isDirty },
 } = useForm({
   resolver: yupResolver(validationSchema),
   defaultValues: {
     route_id: "",
     route_name: "",
     start_location: "",
     end_location: "",
     total_distance: "",
     estimated_time: "",
     stops: {
      stop_name: "",
      location: "",
     }
   },
 });

 useEffect(() => {
   if (data) {
     dispatch(addRouteDetail(data));
     reset({
       route_id: data?.route_id || "",
       route_name: data.route_name || "",
       start_location: data.start_location || "",
       end_location: data.end_location || "",
       total_distance: data.total_distance || "",
       estimated_time: data.estimated_time || "",
       stops: {
         stop_name: data.stops?.stop_name || "",
         location: data.stops?.location || "",
       },
     });
   }
 }, [data, reset]);

 const mutation = useMutation({
   mutationFn: updateRouteFun,
   onSuccess: (data) => {
     dispatch(addRouteDetail(data?.Bus));
     // console.log(data);
     // reset()
   },
   onError: (err) => {
     console.log(err);
   },
 });

 const mutationd = useMutation({
   mutationFn: deleteRouteFun,
   onSuccess: (data) => {
     navigate("/route");
   },
   onError: (err) => {
     console.log(err);
   },
 });

 const onSubmit = (formData) => {
   mutation.mutate({ id, formData });
 };

 const onDelete = () => {
   mutationd.mutate(id)
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
                   <label htmlFor="route_id" className="text-[13px]">
                     route_id
                   </label>
                   <input
                     id="route_id"
                     {...register("route_id")}
                     type="text"
                     className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                   />
                   {errors.route_id && (
                     <p className="text-red-500 text-sm">
                       {errors.route_id.message}
                     </p>
                   )}
                 </div>
                 <div className="flex flex-col">
                   <label htmlFor="route_name" className="text-[13px]">
                     route_name
                   </label>
                   <input
                     id="route_name"
                     {...register("route_name")}
                     type="text"
                     className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                   />
                   {errors.route_name && (
                     <p className="text-red-500 text-sm">
                       {errors.route_name.message}
                     </p>
                   )}
                 </div>
                 <div className="flex flex-col">
                   <label htmlFor="start_location" className="text-[13px]">
                     start_location
                   </label>
                   <input
                     id="start_location"
                     {...register("start_location")}
                     type="text"
                     className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                   />
                   {errors.start_location && (
                     <p className="text-red-500 text-sm">
                       {errors.start_location.message}
                     </p>
                   )}
                 </div>
                 <div className="flex flex-col">
                   <label htmlFor="end_location" className="text-[13px]">
                     end_location
                   </label>
                   <input
                     id="end_location"
                     {...register("end_location")}
                     type="text"
                     className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                   />
                   {errors.end_location && (
                     <p className="text-red-500 text-sm">
                       {errors.end_location.message}
                     </p>
                   )}
                 </div>
                 <div className="flex flex-col">
                   <label htmlFor="total_distance" className="text-[13px]">
                     total_distance
                   </label>
                   <input
                     id="total_distance"
                     {...register("total_distance")}
                     type="text"
                     className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                   />
                   {errors.total_distance && (
                     <p className="text-red-500 text-sm">
                       {errors.total_distance.message}
                     </p>
                   )}
                 </div>
                 <div className="flex flex-col">
                   <label htmlFor="estimated_time" className="text-[13px]">
                     estimated_time
                   </label>
                   <input
                     id="estimated_time"
                     {...register("estimated_time")}
                     type="text"
                     className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                   />
                   {errors.estimated_time && (
                     <p className="text-red-500 text-sm">
                       {errors.estimated_time.message}
                     </p>
                   )}
                 </div>
                 <div className="flex flex-col">
                   <label htmlFor="stop_name" className="text-[13px]">
                     Stop Name
                   </label>
                   <input
                     id="stop_name"
                     {...register("stops.stop_name")}
                     type="text"
                     className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                   />
                   {errors.stops?.stop_name && (
                     <p className="text-red-500 text-sm">
                       {errors.stops.stop_name.message}
                     </p>
                   )}
                 </div>
                 <div className="flex flex-col">
                   <label htmlFor="location" className="text-[13px]">
                     Location
                   </label>
                   <input
                     id="location"
                     {...register("stops.location")}
                     type="text"
                     className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                   />
                   {errors.stops?.location && (
                     <p className="text-red-500 text-sm">
                       {errors.stops.location.message}
                     </p>
                   )}
                 </div>
               </div>
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

export default SingleRoute;
