import axios from "axios";
import axiosInstance, { endpoints } from "../../api/endpoints";
import { handleError } from "../../api/handleError";

export const getBusOperator = async ({
  currentPage,
  limit,
  searchQuery,
  //   selectedCategory,
  dateValue,
  price,
}) => {
  try {
    const res = await axiosInstance.get(
      endpoints.get_bo,
    //   {
    //     params: {
    //       page: currentPage,
    //       limit: limit,
    //       search: searchQuery,
    //       //   category: selectedCategory,
    //       date: dateValue,
    //       minPrice: price,
    //     },
    //   },
      {
        withCredentials: true, // Make sure cookies are sent with the request
      }
    );
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getSingleBusOperatorFun = async (id) => {
  try {
    const res = await axiosInstance.get(`${endpoints.get_bo}/${id}`, {
      withCredentials: true, // Make sure cookies are sent with the request
    });
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateBusOperatorFun = async ({ id, formData }) => {
  try {
    const res = await axiosInstance.post(`${endpoints.update_bo}/${id}`,formData, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateBusOperatorPasswordFun = async (id) => {
  try {
    const res = await axiosInstance.put(
      `${endpoints.update_bo_password}/${id}`,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteBusOperatorFun = async (id) => {
  try {
    const res = await axiosInstance.delete(
      `${endpoints.delete_bo}/${id}`,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};
