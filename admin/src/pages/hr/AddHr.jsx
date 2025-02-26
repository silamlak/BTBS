import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { addHrFun } from "../../features/hr/hrApi";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import app from "../../firebase/firebase";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";
import {schema} from '../../schemas/validationSchema'


const AddHr = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

  const mutation = useMutation({
    mutationFn: addHrFun,
    onSuccess: () => {
      navigate("/hr");
    },
    onError: (err) => {
      console.log(err)
    }
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const watchImages = watch("images"); // Watch for images input

  const onSubmit = async (data) => {
    try {
      setUploading(true);

      // Upload images to Firebase
      const storage = getStorage(app);
      const uploadPromises = Array.from(data.images).map(async (file) => {
        const storageRef = ref(storage, "images/" + file.name);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
      });

      const imageUrls = await Promise.all(uploadPromises);

      // Prepare formData with image URLs
      const formData = {
        ...data,
        id_url: imageUrls,
      };

      mutation.mutate(formData);
      setUploading(false);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while uploading images.");
      setUploading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
        Add HR Officer
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Input Fields */}
        {[
          "first_name",
          "middle_name",
          "last_name",
          "email",
          "phone",
          "password",
          "salary",
        ].map((field) => (
          <div key={field}>
            <label className="block text-gray-700 capitalize dark:text-gray-300">
              {field.replace("_", " ")}
            </label>
            <input
              {...register(field)}
              type={field === "password" ? "password" : "text"}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white dark:border-slate-600"
            />
            {errors[field] && (
              <p className="text-red-500">{errors[field].message}</p>
            )}
          </div>
        ))}

        {/* File Input for Images */}
        <div className="border-b-2 flex flex-col w-fit border-slate-500 dark:border-slate-300">
          <label
            htmlFor="images"
            className="text-[14px] flex m-1 dark:text-gray-300"
          >
            <p>Choose Images </p>
            <span className="text-red-600 font-extrabold">*</span>
            {uploading && (
              <span className="ml-2">
                <Loader s={10} />
              </span>
            )}
          </label>
          <input
            id="images"
            type="file"
            accept="image/*"
            multiple
            {...register("images")}
            className="border p-2 rounded-t-lg overflow-hidden bg-slate-100 dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:outline-none"
          />
          {errors.images && (
            <p className="text-red-500">{errors.images.message}</p>
          )}
        </div>

        {/* Dropdown for Education */}
        <div className="border-b-2 flex flex-col w-fit border-slate-500 dark:border-slate-300">
          <label
            htmlFor="education"
            className="text-[14px] flex m-1 dark:text-gray-300"
          >
            Education Level
          </label>
          <select
            id="education"
            {...register("education")}
            className="border p-2 rounded-t-lg bg-slate-100 dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:outline-none"
          >
            <option value="" disabled>
              Select your education level
            </option>
            <option value="bachelors">Bachelor's Degree</option>
            <option value="masters">Master's Degree</option>
            <option value="phd">Ph.D.</option>
            <option value="other">Other</option>
          </select>
          {errors.education && (
            <p className="text-red-500">{errors.education.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none dark:bg-blue-700 dark:hover:bg-blue-600"
          disabled={uploading || mutation.isLoading}
        >
          {mutation.isLoading || uploading ? "Submitting..." : "Submit"}
        </button>

        {/* Success Message */}
        {mutation.isSuccess && (
          <p className="text-green-500 mt-4">Officer added successfully!</p>
        )}
      </form>
    </div>
  );
};

export default AddHr;
