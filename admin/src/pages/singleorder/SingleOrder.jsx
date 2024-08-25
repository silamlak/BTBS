import React, { useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getSingleOrderFun } from "../../features/order/orderApi";
import {
  addOrderDetail,
  nextOrderDetail,
  prevOrderDetail,
} from "../../features/order/orderSlice";
import Loader from "../../components/Loader";

const SingleOrder = () => {
  const currentId = useSelector((state) => state.order.currentDataId);
  const od = useSelector((state) => state.order.orderData);
  const current = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["singleOrder", id],
    queryFn: () => getSingleOrderFun(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (data) {
      dispatch(addOrderDetail(id));
    }
  }, [data]);

  useEffect(() => {
    navigate(`/order/${currentId}`);
  }, [currentId]);

  console.log(current, od);
  const handleNext = () => {
    dispatch(nextOrderDetail());
  };
  const handlePrev = () => {
    dispatch(prevOrderDetail());
  };

  const taxRate = 0.12;
  const deliveryRate = 0.1;
  const priceBeforeTaxAndDelivery = Math.round(
    data?.service?.totalPrice / (1 + taxRate + deliveryRate)
  );
  const taxAmount = Math.round(priceBeforeTaxAndDelivery * taxRate);
  const deliveryCharge = Math.round(priceBeforeTaxAndDelivery * deliveryRate);

  return (
    <div>
      {isError && error && (
        <div className="p-2 flex bg-red-500 text-white rounded">
          <p>{error?.data || "Something Went Wrong"}</p>
        </div>
      )}
      <div>
        <div className="flex items-center gap-4">
          <div className="flex gap-4 mb-2 ml-1 items-center">
            {current?.currentIndex > current?.min_index && (
              <button
                onClick={handlePrev}
                className="text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 p-2 rounded-full  duration-500"
              >
                <IoIosArrowBack />
              </button>
            )}
            <p className="text-slate-800 dark:text-slate-100">
              {current.currentIndex}/{current.max_index}
            </p>
            {current?.currentIndex < current?.max_index && (
              <button
                onClick={handleNext}
                className="text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 p-2 rounded-full  duration-500"
              >
                <IoIosArrowForward />
              </button>
            )}
          </div>
          {isLoading && !isError && !error && (
            <div>
              <Loader />
            </div>
          )}
        </div>

        <div className="rounded-xl border max-w-4xl bg: bg-slate-50 dark:bg-slate-900 shadow-md p-6">
          <p className="text-slate-800 dark:text-slate-100 text-lg font-semibold max-sm:text-md">
            Order
          </p>

          <div className=" m-3 grid grid-cols-3 mt-2 text-slate-800 dark:text-slate-100">
            <div>
              <div>
                <p className="text-sm font-normal">date</p>
                <p className="text-md font-semibold">
                  {new Date(data?.service?.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-2">
                <p className="text-sm font-normal">Status</p>
                <p className="text-md font-semibold">{data?.service?.status}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-normal">reference</p>
              <p className="text-md font-semibold">GASHG122</p>
            </div>
            <div>
              <p className="text-sm font-normal">Customer Info</p>
              <p className="text-md font-semibold">
                {data?.user?.first_name} {data?.user?.father_name}
              </p>
              <p className="text-md font-semibold">{data?.user?.email}</p>
              <p className="text-md font-semibold">{data?.user?.ethPhone}</p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl mt-24">
            <div className="border-b">
              <h1 className=" mb-6 text-xl font-semibold text-slate-800 dark:text-slate-100">
                Items
              </h1>
            </div>
            <div className=" m-3">
              <table className="w-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
                <thead className="bg-slate-100 dark:bg-slate-800 ">
                  <tr className="uppercase text-slate-800 dark:text-slate-100 text-sm">
                    <th className="py-2 text-start px-4 border-b">Item</th>
                    <th className="py-2 text-center px-4 border-b">Price</th>
                    <th className="py-2 text-center px-4 border-b">Quantity</th>
                    <th className="py-2 max-sm:hidden text-end px-4 border-b">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  <tr
                    // key={index}
                    className="text-slate-800 text-sm dark:text-slate-100 font-medium"
                  >
                    <td className="py-3 px-4 border-b">
                      {data?.service?.category}
                    </td>
                    <td className="py-3 px-4 border-b text-center font-normal">
                      {data?.service?.price}
                    </td>
                    <td className="py-3 px-4 border-b text-center text-green-500">
                      {data?.service?.quantity}
                    </td>
                    <td className="py-3 max-sm:hidden text-end px-4 border-b">
                      {data?.service?.totalPrice}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-14">
            <div className="border-b">
              <p className="mb-6 text-slate-800 dark:text-slate-100 text-lg font-semibold max-sm:text-md">
                Totals
              </p>
            </div>
            <div className=" m-3">
              <table className="w-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
                <thead className="bg-slate-100 dark:bg-slate-800 ">
                  <tr className="uppercase text-slate-800 dark:text-slate-100 text-sm">
                    <th className="py-2 text-start px-4 border-b">
                      Distribution
                    </th>
                    <th className="py-2 text-end px-4 border-b">Price</th>
                  </tr>
                </thead>
                <tbody className="">
                  <tr className="text-slate-800 text-sm dark:text-slate-100 font-medium">
                    <td className="py-3 px-4 border-b">Sum</td>
                    <td className="py-3 px-4 border-b font-normal text-end">
                      {priceBeforeTaxAndDelivery}
                    </td>
                  </tr>
                  <tr className="text-slate-800 text-sm dark:text-slate-100 font-medium">
                    <td className="py-3 px-4 border-b">Delivery</td>
                    <td className="py-3 px-4 border-b font-normal text-end">
                      {deliveryCharge}
                    </td>
                  </tr>
                  <tr className="text-slate-800 text-sm dark:text-slate-100 font-medium">
                    <td className="py-3 px-4 border-b">Tax (12%)</td>
                    <td className="py-3 px-4 border-b font-normal text-end">
                      {taxAmount}
                    </td>
                  </tr>
                  <tr className="text-slate-800 text-sm dark:text-slate-100 font-medium">
                    <td className="py-3 px-4 border-b font-semibold">Total</td>
                    <td className="py-3 px-4 border-b font-semibold text-end">
                      {data?.service?.totalPrice}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-14 flex justify-between items-center bg-slate-100 rounded-xl dark:bg-slate-800 p-5">
            <button className="flex p-2 text-blue-400 dark:text-orange-400 bg-slate-200 dark:bg-slate-900 gap-3 rounded-md items-center">
              <p className="text-bold">Save</p>
              <FaRegSave />
            </button>
            <button className="flex p-2 text-red-500 bg-slate-200 dark:bg-slate-900 gap-3 rounded-md items-center">
              <p>Delete</p>
              <MdDeleteOutline />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleOrder;
