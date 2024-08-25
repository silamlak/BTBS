import { useMutation } from "@tanstack/react-query";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { postCatagorieFun } from "../../features/catagorie/catagorieApi";
import toast from "react-hot-toast";
import Loader from "../Loader";
import app from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
// import { uploadImage } from "../../firebase/ImageUpload";

const CreateModal = ({ isOpen, onClose, onSubmit }) => {
    const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    c_img: null,
    desc: "",
  });
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");

  const handleFileChange = async (e) => {
    try {
      const image = e.target.files[0];
      setUploading(true);
      const storage = getStorage(app);
      const storageRef = ref(storage, "images/" + image.name);
      await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(storageRef);
      console.log(downloadURL);
      setFormData({
        ...formData,
        c_img: downloadURL,
      });
      setUploading(false);
    } catch (err) {
      console.log(err);
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const mutation = useMutation({
    mutationFn: () => postCatagorieFun(formData),
    onSuccess: (data) => {
      toast.success("Category created!");
       setFormData({});
      onClose();
      navigate("/product/create");

    },
    onError: (err) => {
      toast.error("Error creating category");
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    if (!formData.title || !formData.desc || !formData.c_img) {
      return toast.error("All Field Are Required");
    }
    mutation.mutate(formData);
  };

  const handleClose = () => {
    setFormData({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
          Create Category
        </h2>
        {formData.c_img && (
          <div className="w-full flex justify-center">
            <img src={formData.c_img} className="w-[200px] flex" />
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-800 dark:text-slate-100"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block p-2 w-full border border-gray-300 rounded-md shadow-sm text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-700 focus:outline-none sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="desc"
              className="block text-sm font-medium text-slate-800 dark:text-slate-100"
            >
              Description
            </label>
            <textarea
              id="desc"
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              className="mt-1 block p-2 w-full border border-gray-300 rounded-md shadow-sm text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-700 focus:outline-none sm:text-sm"
              rows="3"
            />
          </div>
          <div className="flex w-full gap-2 items-center">
            <div className="mb-4">
              <label
                htmlFor="c_img"
                className="block text-sm font-medium text-slate-800 dark:text-slate-100"
              >
                Image
              </label>
              <input
                id="c_img"
                name="c_img"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-700 focus:outline-none sm:text-sm"
                required
              />
            </div>
            {uploading && (
              <div>
                <Loader />
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              disabled={mutation.isPending || uploading}
              onClick={handleClose}
              className="px-4 flex items-center gap-2 py-2 bg-gray-500 text-white rounded-md shadow-sm hover:bg-gray-600"
            >
              <p>Cancel</p>{" "}
              {mutation.isPending && (
                <span>
                  <Loader />
                </span>
              )}
            </button>
            <button
              type="submit"
              disabled={mutation.isPending || uploading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 dark:bg-orange-500 dark:hover:bg-orange-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModal;
