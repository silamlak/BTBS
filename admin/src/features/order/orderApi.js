import axios from "axios";
import axiosInstance, { endpoints } from "../../api/endpoints";
import { handleError } from "../../api/handleError";

export const getOrderFun = async ({
  currentPage,
  limit,
  searchQuery,
  selectedCategory,
  dateValue,
  price
}) => {
  try {
    const res = await axiosInstance.get(
      endpoints.get_orders,
      {
        params: {
          page: currentPage,
          limit: limit,
          search: searchQuery,
          category: selectedCategory,
          date: dateValue,
          minPrice: price,
        },
      },
      {
        withCredentials: true, // Make sure cookies are sent with the request
      }
    );
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getSingleOrderFun = async (id) => {
  try {
    const res = await axiosInstance.get(`${endpoints.get_orders}/${id}`, {
      withCredentials: true, // Make sure cookies are sent with the request
    });
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getDeleteOrdersFun = async (ids) => {
  try {
    const res = await axiosInstance.post(
      `${endpoints.delete_orders}`,
      { ids },
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

