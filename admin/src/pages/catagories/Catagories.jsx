import React, { useState } from "react";
import {
  MdOutlineProductionQuantityLimits,
  MdOutlineEdit,
} from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { useQuery } from "@tanstack/react-query";
import { getCatagorieFun } from "../../features/catagorie/catagorieApi";
import { useNavigate } from "react-router-dom";
import CreateModal from "../../components/categoryPage/CreateModal";
import Loader from "../../components/Loader";

const Catagories = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: getCatagorieFun,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProduct = (id) => {
    navigate(`/categorie/${id}`);
  };

  const handleCreateCategory = (category) => {
    console.log("New category:", category);
  };

  return (
    <div className="">
      <div className="flex w-full items-center justify-between p-2">
        <h2 className="text-slate-800 dark:text-slate-100 text-lg max-sm:text-sm font-semibold">
          Categories
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 text-md font-semibold text-blue-500 dark:text-orange-400"
        >
          <IoMdAdd />
          <p className="uppercase">Create</p>
        </button>
      </div>
      {isLoading && !isError && <div className="flex w-full justify-center"><Loader /></div>}
      {data && !isLoading && <div className="grid grid-cols-6 max-2xl:grid-cols-5 max-xl:grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 w-full p-2 mx-auto gap-4">
        {data?.map((catagorie, i) => (
          <div
            key={catagorie._id}
            className="rounded-xl overflow-hidden shadow-md cursor-pointer bg-slate-50 dark:bg-slate-900"
          >
            <img src={catagorie.c_img} alt={catagorie.title} className="h-[200px] w-full" />
            <p className="text-center p-4 text-xl max-sm:text-md text-slate-800 dark:text-slate-100">
              {catagorie.title}
            </p>
            <div className="flex p-4 justify-center gap-4 items-center text-blue-500 dark:text-orange-500 text">
              <button className="flex gap-2 items-center">
                <p>Products</p>
                <MdOutlineProductionQuantityLimits />
              </button>
              <button
                onClick={() => handleProduct(catagorie._id)}
                className="flex gap-2 items-center"
              >
                <p>Edit</p>
                <MdOutlineEdit />
              </button>
            </div>
          </div>
        ))}
      </div>}
      <CreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCategory}
      />
    </div>
  );
};

export default Catagories;
