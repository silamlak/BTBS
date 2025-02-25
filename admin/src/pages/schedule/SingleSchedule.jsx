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
import {
  updateScheduleFun,
  viewScheduleFun,
} from "../../features/schedule/scheduleApi";
import { addScheduleDetail } from "../../features/schedule/scheduleSlice";

function formatDate(dateString) {
  const date = new Date(dateString); // Convert the date string to a Date object

  const year = date.getFullYear(); // Get the year
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Get the month (0-indexed, so add 1) and pad it with zero if necessary
  const day = String(date.getDate()).padStart(2, "0"); // Get the day of the month and pad it with zero if necessary

  // Return the formatted date as 'YYYY-MM-DD'
  return `${year}-${month}-${day}`;
}
// Validation Schema
const validationSchema = yup.object().shape({
  schedule_id: yup.string().required("schedule_id is required"),
  schedule_date: yup.string().required("schedule_date is required"),
  from: yup.string().required("from is required"),
  to: yup.string().required("to is required"),
  departure_time: yup.string().required("departure_time is required"),
  arrival_time: yup.string().required("arrival_time is required"),
  ticket_price: yup.string().required("ticket_price is required"),
  available_seats: yup.string().required("available_seats is required"),
  status: yup.string().required("status is required"),
});

const SingleSchedule = () => {
  const currentData = useSelector((state) => state.schedule.currentData);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [password, setPassword] = useState("");
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["singleSchedule", id],
    queryFn: () => viewScheduleFun(id),
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
      schedule_id: "",
      schedule_date: "",
      from: "",
      to: "",
      departure_time: "",
      arrival_time: "",
      ticket_price: "",
      available_seats: "",
      status: "",
    },
  });

  useEffect(() => {
    if (data) {
      dispatch(addScheduleDetail(data));
      reset({
        schedule_id: data?.schedule_id || "",
        schedule_date: formatDate(data?.schedule_date) || "",
        departure_time: formatDate(data.departure_time) || "",
        arrival_time: formatDate(data.arrival_time) || "",
        from: data.from || "",
        to: data.to || "",
        ticket_price: data.ticket_price || "",
        available_seats: data.available_seats || "",
        status: data.status || "",
      });
    }
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: updateScheduleFun,
    onSuccess: (data) => {
      dispatch(addScheduleDetail(data?.Bus));
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
              Schedule Detail
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="w-full m-3 gap-2 grid grid-cols-2 max-md:grid-cols-1 my-4 text-slate-800 dark:text-slate-100">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col">
                    <label htmlFor="schedule_id" className="text-[13px]">
                      schedule_id
                    </label>
                    <input
                      id="schedule_id"
                      {...register("schedule_id")}
                      type="text"
                      className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                    />
                    {errors.schedule_id && (
                      <p className="text-red-500 text-sm">
                        {errors.schedule_id.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="schedule_date" className="text-[13px]">
                      schedule_date
                    </label>
                    <input
                      id="schedule_date"
                      {...register("schedule_date")}
                      type="text"
                      className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                    />
                    {errors.schedule_date && (
                      <p className="text-red-500 text-sm">
                        {errors.schedule_date.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="from" className="text-[13px]">
                      from
                    </label>
                    <input
                      id="from"
                      {...register("from")}
                      type="text"
                      className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                    />
                    {errors.from && (
                      <p className="text-red-500 text-sm">
                        {errors.from.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="to" className="text-[13px]">
                      to
                    </label>
                    <input
                      id="to"
                      {...register("to")}
                      type="text"
                      className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                    />
                    {errors.to && (
                      <p className="text-red-500 text-sm">
                        {errors.to.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="departure_time" className="text-[13px]">
                      departure_time
                    </label>
                    <input
                      id="departure_time"
                      {...register("departure_time")}
                      type="text"
                      className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                    />
                    {errors.departure_time && (
                      <p className="text-red-500 text-sm">
                        {errors.departure_time.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="arrival_time" className="text-[13px]">
                      arrival_time
                    </label>
                    <input
                      id="arrival_time"
                      {...register("arrival_time")}
                      type="text"
                      className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                    />
                    {errors.arrival_time && (
                      <p className="text-red-500 text-sm">
                        {errors.arrival_time.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="ticket_price" className="text-[13px]">
                      ticket_price
                    </label>
                    <input
                      id="ticket_price"
                      {...register("ticket_price")}
                      type="text"
                      className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                    />
                    {errors.ticket_price && (
                      <p className="text-red-500 text-sm">
                        {errors.ticket_price.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="available_seats" className="text-[13px]">
                      available_seats
                    </label>
                    <input
                      id="available_seats"
                      {...register("available_seats")}
                      type="text"
                      className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                    />
                    {errors.available_seats && (
                      <p className="text-red-500 text-sm">
                        {errors.available_seats.message}
                      </p>
                    )}
                  </div>
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

                <div className="flex flex-col gap-2">
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
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Delayed">Delayed</option>
                    </select>
                    {errors.status && (
                      <p className="text-red-500 text-sm">
                        {errors.status.message}
                      </p>
                    )}
                  </div>
                  {/* <div className="flex flex-col">
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
                 </div> */}
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

export default SingleSchedule;
