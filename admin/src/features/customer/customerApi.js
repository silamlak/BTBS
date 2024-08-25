import axios from "axios";
import axiosInstance, { endpoints } from "../../api/endpoints";
import { handleError } from "../../api/handleError";

export const getCustomerFun = async ({
  currentPage,
  limit,
  searchQuery,
//   selectedCategory,
  dateValue,
  price,
}) => {
  try {
    const res = await axiosInstance.get(
      endpoints.get_customers,
      {
        params: {
          page: currentPage,
          limit: limit,
          search: searchQuery,
          //   category: selectedCategory,
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

export const getSingleCustomerFun = async (id) => {
  try {
    const res = await axiosInstance.get(`${endpoints.get_customer}/${id}`, {
      withCredentials: true, // Make sure cookies are sent with the request
    });
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getDeleteCustomerFun = async (ids) => {
  try {
    const res = await axiosInstance.post(
      `${endpoints.delete_customers}`,
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
