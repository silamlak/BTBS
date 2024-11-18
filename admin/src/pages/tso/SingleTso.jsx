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
  updateTsoFun,
  viewTsoFun,
} from "../../features/tso/tsoApi";
import { addTsoDetail } from "../../features/tso/tsoSlice";

// Validation Schema
const validationSchema = yup.object().shape({
  first_name: yup.string().required("First Name is required"),
  middle_name: yup.string().required("Middle Name is required"),
  last_name: yup.string().required("Last Name is required"),
  email: yup
    .string()
    .email("Must be a valid email")
    .required("Email is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^09\d{8}$/, "Phone number must be Ethiopian"),
  employment_status: yup.string().required("Employment Status is required"),
  city: yup.string().required("City is required"),
  street: yup.string().required("Street is required"),
});

const SingleTso = () => {
  const currentData = useSelector((state) => state.tso.currentData);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [password, setPassword] = useState("");
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["singleTso", id],
    queryFn: () => viewTsoFun(id),
    enabled: !!id,
  });
  // console.log(data)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
      phone: "",
      employment_status: "",
      city: "",
      street: "",
    },
  });

  useEffect(() => {
    if (data) {
      dispatch(addTsoDetail(data));
      reset({
        first_name: data?.first_name || "",
        middle_name: data.middle_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        phone: data.phone || "",
        employment_status: data.employment_status || "",
        city: data.address?.city || "",
        street: data.address?.street || "",
      });
    }
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: updateTsoFun,
    onSuccess: (data) => {
      dispatch(addTsoDetail(data?.tso));
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
              Driver Identity
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="w-full m-3 gap-2 grid grid-cols-2 max-md:grid-cols-1 my-4 text-slate-800 dark:text-slate-100">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col">
                    <label htmlFor="first_name" className="text-[13px]">
                      First Name
                    </label>
                    <input
                      id="first_name"
                      {...register("first_name")}
                      type="text"
                      className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                    />
                    {errors.first_name && (
                      <p className="text-red-500 text-sm">
                        {errors.first_name.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="middle_name" className="text-[13px]">
                      Middle Name
                    </label>
                    <input
                      id="middle_name"
                      {...register("middle_name")}
                      type="text"
                      className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                    />
                    {errors.middle_name && (
                      <p className="text-red-500 text-sm">
                        {errors.middle_name.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="last_name" className="text-[13px]">
                      Last Name
                    </label>
                    <input
                      id="last_name"
                      {...register("last_name")}
                      type="text"
                      className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                    />
                    {errors.last_name && (
                      <p className="text-red-500 text-sm">
                        {errors.last_name.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="email" className="text-[13px]">
                      Email
                    </label>
                    <input
                      id="email"
                      {...register("email")}
                      type="email"
                      className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="phone" className="text-[13px]">
                      Phone
                    </label>
                    <input
                      id="phone"
                      {...register("phone")}
                      type="text"
                      className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="hired_date" className="text-[13px]">
                      Hired Date
                    </label>
                    <input
                      id="hired_date"
                      type="text"
                      value={
                        new Date(currentData?.hire_date).toLocaleDateString() ||
                        ""
                      }
                      disabled
                      className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex flex-col">
                    <label htmlFor="employment_status" className="text-[13px]">
                      Employment Status
                    </label>
                    <select
                      id="employment_status"
                      {...register("employment_status")}
                      className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                    >
                      <option value="">Select Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    {errors.employment_status && (
                      <p className="text-red-500 text-sm">
                        {errors.employment_status.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="city" className="text-[13px]">
                      City
                    </label>
                    <input
                      id="city"
                      {...register("city")}
                      type="text"
                      className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="street" className="text-[13px]">
                      Street
                    </label>
                    <input
                      id="street"
                      {...register("street")}
                      type="text"
                      className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                    />
                    {errors.street && (
                      <p className="text-red-500 text-sm">
                        {errors.street.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-center items-center max-sm:flex-col gap-6 mb-4">
                <div className="flex flex-col">
                  <label htmlFor="password" className="text-[13px]">
                    New Password
                  </label>
                  <input
                    id="password"
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-2 w-full rounded"
                  />
                </div>
                <button
                  onClick={onPasswordSubmit}
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded"
                >
                  New Password
                </button>
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

export default SingleTso;
