import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCategoryForProductCreationFun,
  getSingleProductFun,
  postProductCreateFun,
} from "../../features/product/productApi";
import { IoIosCreate } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import { FaRegSave } from "react-icons/fa";
import app from "../../firebase/firebase";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("image");
  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    s_img: "",
    price: "",
    discount: "",
    category: "",
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["catagory_for_product_creation"],
    queryFn: getCategoryForProductCreationFun,
  });

  const [uploading, setUploading] = useState(false);

  const handleChangeValues = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    try {
      const images = e.target.files[0];
      setUploading(true);
      const storage = getStorage(app);
      const storageRef = ref(storage, "images/" + images.name);
      await uploadBytes(storageRef, images);
      const downloadURL = await getDownloadURL(storageRef);
      setFormData((prev) => {
        return { ...prev, s_img: downloadURL };
      });
      setUploading(false);
    } catch (err) {
      console.log(err);
      toast.error("error occured");
      setUploading(false);
    }
  };

  const mutation = useMutation({
    mutationFn: () => postProductCreateFun(formData),
    onSuccess: (data) => {
      toast.success("Product Created Successfully");
      setFormData({})
      navigate("/product");
    },
    onError: (err) => {
      toast.error(err?.data || 'Something Went Wrong')
    }
  });

  const handleSubmit = async () => {
    console.log(formData);
    if (!formData.name || !formData.desc || !formData.s_img || !formData.category || !formData.price) {
      return toast.error("All Field Are Required");
    }
    mutation.mutate(formData);
  };

const isSubmittable = () => {
  return (
    formData.category &&
    formData.desc &&
    formData.name &&
    formData.price &&
    formData.s_img
  );
};

  return (
    <div>
      <div className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl overflow-hidden shadow-md">
        <div className=" border-b">
          {/* Button Group */}
          <button
            onClick={() => setActiveTab("image")}
            className={` px-6 py-3 uppercase ${
              activeTab === "image"
                ? "border-b-4 border-blue-500 font-semibold dark:border-orange-400"
                : ""
            }`}
          >
            Image
          </button>
          <button
            onClick={() => setActiveTab("price")}
            className={` px-6 py-3 tracking-widest text-semibold uppercase ${
              activeTab === "price"
                ? "border-b-4 border-blue-500 font-semibold dark:border-orange-400"
                : ""
            }`}
          >
            Price
          </button>
          <button
            onClick={() => setActiveTab("details")}
            className={` px-6 py-3 tracking-widest text-semibold uppercase ${
              activeTab === "details"
                ? "border-b-4 border-blue-500 font-semibold dark:border-orange-400"
                : ""
            }`}
          >
            Details
          </button>
        </div>

        {activeTab === "image" && (
          <div className="p-6">
            <div className="mb-2">
              {!formData.s_img && (
                <div
                  htmlFor="image"
                  className="cursor-pointer shadow-lg mt-2 flex justify-center items-center w-[200px] h-[200px] object-cover rounded-lg overflow-hidden"
                >
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    Image Preview
                  </p>
                </div>
              )}
              {formData.s_img && (
                <img
                  src={formData.s_img}
                  alt="Product"
                  className="mt-2 w-[200px] h-[200px] object-cover rounded-lg overflow-hidden"
                />
              )}
            </div>
            <div className="border-b-2 flex flex-col w-fit border-slate-500 dark:border-slate-300 ">
              <label htmlFor="image" className="text-[14px] flex m-1">
                <p>Choose Image </p>
                <span className="text-red-600 font-extrabold">*</span>
                {uploading && (
                  <span className="ml-2">
                    <Loader s={10} />
                  </span>
                )}
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={handleFileChange}
                className="border p-2 rounded-t-lg overflow-hidden bg-slate-100 dark:bg-slate-700 focus:outline-none"
              />
            </div>
          </div>
        )}

        {activeTab === "price" && (
          <div className="p-6 w-1/2 max-lg:w-full">
            <div className="border-b-2 border-slate-500 dark:border-slate-300 ">
              <label htmlFor="price" className="text-[14px] m-1">
                Price
                <span className="text-red-600 font-extrabold">*</span>
              </label>
              <input
                id="price"
                type="number"
                name="price"
                placeholder="Enter price..."
                value={formData.price}
                onChange={(e) => handleChangeValues(e)}
                className="rounded-t-md p-2 w-full  bg-slate-200 dark:bg-slate-700 focus:outline-none"
              />
            </div>
            <div className="border-b-2 mt-6 border-slate-500 dark:border-slate-300 ">
              <label htmlFor="discount" className="text-[14px] m-1">
                Discount
              </label>

              <input
                id="discount"
                type="number"
                name="discount"
                placeholder="Enter discount..."
                value={formData.discount}
                onChange={(e) => handleChangeValues(e)}
                className="rounded-t-md p-2 w-full bg-slate-200 dark:bg-slate-700 focus:outline-none"
              />
            </div>
          </div>
        )}

        {activeTab === "details" && (
          <div className="p-6 w-1/2 max-lg:w-full grid grid-cols-2 max-lg:grid-cols-1 gap-3">
            <div className="border-b-2 border-slate-500 dark:border-slate-300 ">
              <label htmlFor="name" className="text-[14px] m-1">
                Name Of Product
                <span className="text-red-600 font-extrabold">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter Name of Product"
                value={formData.name}
                onChange={(e) => handleChangeValues(e)}
                className="rounded-t-md p-2 w-full  bg-slate-200 dark:bg-slate-700 focus:outline-none"
              />
            </div>
            <div className="border-b-2 border-slate-500 dark:border-slate-300 ">
              <label htmlFor="desc" className="text-[14px] m-1">
                Description
                <span className="text-red-600 font-extrabold">*</span>
              </label>
              <input
                id="desc"
                name="desc"
                type="text"
                placeholder="Enter price..."
                value={formData.desc}
                onChange={(e) => handleChangeValues(e)}
                className="rounded-t-md p-2 w-full  bg-slate-200 dark:bg-slate-700 focus:outline-none"
              />
            </div>
            <div className="border-b-2 border-slate-500 dark:border-slate-300 ">
              <label htmlFor="category" className="text-[14px] m-1 flex">
                <p>Category</p>
                <span className="text-red-600 font-extrabold">*</span>
                {isLoading && !isError && (
                  <span className="ml-2">
                    <Loader s={10} />
                  </span>
                )}
              </label>
              <select
                name="category"
                id="category"
                onChange={(e) => handleChangeValues(e)}
                className="rounded-t-md p-2 w-full  bg-slate-200 dark:bg-slate-700 focus:outline-none"
              >
                <option value="">choose Category</option>
                {data?.map((category, i) => (
                  <option key={i} value={category?.title}>
                    {category?.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="w-ffull px-6 py-3 border-t bg-slate-100 dark:bg-slate-800 flex items-center justify-between">
          {isSubmittable() && (
            <button
              onClick={handleSubmit}
              disabled={mutation.isPending}
              className="px-4 py-2 flex gap-2 text-lg items-center text-blue-500 hover:bg-blue-200 duration-300 rounded-xl"
            >
              <IoIosCreate />
              <p>Create</p>
              {mutation.isPending && <Loader />}
            </button>
          )}
          {/* <button
            className="px-4 py-2 flex gap-2 text-lg items-center hover:bg-red-200 text-red-700 duration-300 rounded-xl"
          >
            <MdDeleteOutline />
            <p>Delete</p>
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
