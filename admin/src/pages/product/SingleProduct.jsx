import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCategoryForProductCreationFun,
  getSingleProductFun,
  putProductFun,
} from "../../features/product/productApi";
import { FaRegSave } from "react-icons/fa";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import app from "../../firebase/firebase";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";

const SingleProduct = () => {
  const navigate = useNavigate()
  const [uploading, setUploading] = useState(false);
  const [product, setProduct] = useState({
    s_img: "",
    price: "",
    discount: "",
    desc: "",
    name: "",
    category: "",
  });

  const [initialProduct, setInitialProduct] = useState({
    s_img: "",
    price: "",
    discount: "",
    desc: "",
    name: "",
    category: "",
  });

  const [activeTab, setActiveTab] = useState("image");

  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories", id],
    queryFn: () => getSingleProductFun(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (data) {
      setInitialProduct({
        s_img: data.s_img,
        price: data.price,
        discount: data.discount,
        desc: data.desc,
        name: data.name,
        category: data.category,
      });

      setProduct({
        s_img: data.s_img,
        price: data.price,
        discount: data.discount,
        desc: data.desc,
        name: data.name,
        category: data.category,
      });
    }
  }, [data]);

  const {
    data: categories,
    isLoading: catLoading,
    isError: catError,
  } = useQuery({
    queryKey: ["catagory_for_product_update"],
    queryFn: getCategoryForProductCreationFun,
  });

  const mutation = useMutation({
    mutationFn: (d) => putProductFun(d),
    onSuccess: (data) => {
      toast.success("Product Updated Successfully");
      setProduct({});
      setInitialProduct({});
      navigate("/product");
    },
    onError: (err) => {
      toast.error(err?.data || "Something Went Wrong");
    },
  });

  const handleSubmit = async () => {
    // console.log(product);
    if (
      !product.name ||
      !product.desc ||
      !product.s_img ||
      !product.category ||
      !product.price
    ) {
      return toast.error("All Field Are Required");
    }
    mutation.mutate({id, product});
  };

  const hasChanges =
    initialProduct.s_img !== product.s_img ||
    product.price !== initialProduct.price ||
    product.details !== initialProduct.details;

  const handleFileChange = async (e) => {
    try {
      const images = e.target.files[0];
      setUploading(true);
      const storage = getStorage(app);
      const storageRef = ref(storage, "images/" + images.name);
      await uploadBytes(storageRef, images);
      const downloadURL = await getDownloadURL(storageRef);
      setProduct((prev) => ({ ...prev, s_img: downloadURL }));
      setUploading(false);
    } catch (err) {
      console.log(err);
      toast.error("Error occurred");
      setUploading(false);
    }
  };

  const isSubmittable = () => {
    return (
      product.category &&
      product.desc &&
      product.name &&
      product.price &&
      product.s_img
    );
  };
  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl overflow-hidden shadow-md">
      <div className="border-b">
        {/* Button Group */}
        <button
          onClick={() => setActiveTab("image")}
          className={`px-6 py-3 tracking-widest text-semibold uppercase ${
            activeTab === "image"
              ? "border-b-4 border-blue-500 dark:border-orange-400"
              : ""
          }`}
        >
          Image
        </button>
        <button
          onClick={() => setActiveTab("price")}
          className={`px-6 py-3 tracking-widest text-semibold uppercase ${
            activeTab === "price"
              ? "border-b-4 border-blue-500 dark:border-orange-400"
              : ""
          }`}
        >
          Price
        </button>
        <button
          onClick={() => setActiveTab("details")}
          className={`px-6 py-3 tracking-widest text-semibold uppercase ${
            activeTab === "details"
              ? "border-b-4 border-blue-500 dark:border-orange-400"
              : ""
          }`}
        >
          Details
        </button>
      </div>

      {activeTab === "image" && (
        <div className="p-6">
          <div className="mb-2">
            <img
              src={product.s_img || initialProduct.s_img}
              alt="Product"
              className="mt-2 w-[200px] h-[200px] object-cover rounded-lg overflow-hidden"
            />
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
            </label>
            <input
              id="price"
              type="number"
              placeholder="Enter price..."
              value={product.price}
              onChange={(e) =>
                setProduct((prev) => ({ ...prev, price: e.target.value }))
              }
              className="rounded-t-md p-2 w-full bg-slate-200 dark:bg-slate-700 focus:outline-none"
            />
          </div>
          <div className="border-b-2 mt-6 border-slate-500 dark:border-slate-300 ">
            <label htmlFor="discount" className="text-[14px] m-1">
              Discount
            </label>

            <input
              id="discount"
              type="number"
              placeholder="Enter discount..."
              value={product.discount}
              onChange={(e) =>
                setProduct((prev) => ({ ...prev, discount: e.target.value }))
              }
              className="rounded-t-md p-2 w-full bg-slate-200 dark:bg-slate-700 focus:outline-none"
            />
          </div>
        </div>
      )}

      {activeTab === "details" && (
        <div className="p-6 w-1/2 max-lg:w-full grid grid-cols-2 max-lg:grid-cols-1 gap-3">
          <div className="border-b-2 border-slate-500 dark:border-slate-300 ">
            <label htmlFor="name" className="text-[14px] m-1">
              Name of Product
              <span className="text-red-600 font-extrabold">*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter Name of Product"
              value={product.name}
              onChange={(e) =>
                setProduct((prev) => ({ ...prev, name: e.target.value }))
              }
              className="rounded-t-md p-2 w-full bg-slate-200 dark:bg-slate-700 focus:outline-none"
            />
          </div>

          <div className="border-b-2 border-slate-500 dark:border-slate-300 ">
            <label htmlFor="category" className="text-[14px] m-1 flex">
              <p>Category</p>
              <span className="text-red-600 font-extrabold">*</span>
              {catLoading && !catError && (
                <span className="ml-2">
                  <Loader s={10} />
                </span>
              )}
            </label>
            <select
              name="category"
              id="category"
              onChange={(e) =>
                setProduct((prev) => ({ ...prev, category: e.target.value }))
              }
              value={product.category}
              className="rounded-t-md p-2 w-full bg-slate-200 dark:bg-slate-700 focus:outline-none"
            >
              <option value="">Choose Category</option>
              {categories?.map((cat, i) => (
                <option key={i} value={cat?.title}>
                  {cat?.title}
                </option>
              ))}
            </select>
          </div>

          <div className="border-b-2 border-slate-500 dark:border-slate-300 ">
            <label htmlFor="details" className="text-[14px] m-1">
              Details
            </label>
            <textarea
              id="details"
              rows={3}
              placeholder="Enter details..."
              value={product.desc}
              onChange={(e) =>
                setProduct((prev) => ({ ...prev, desc: e.target.value }))
              }
              className="rounded-t-md p-2 w-full bg-slate-200 dark:bg-slate-700 focus:outline-none"
            />
          </div>
        </div>
      )}

      <div className="flex justify-end p-4">
        {hasChanges && isSubmittable() && (
          <button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg flex items-center space-x-2"
          >
            <FaRegSave />
            <span>Save Changes</span>
            {mutation.isPending && <Loader />}
          </button>
        )}
      </div>
    </div>
  );
};

export default SingleProduct;
