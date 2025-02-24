import axios from "axios";
import axiosInstance, { endpoints } from "../../api/endpoints";
import { handleError } from "../../api/handleError";

export const getHrFun = async ({
  currentPage,
  limit,
  searchQuery,
  dateValue,
}) => {
  try {
    const res = await axiosInstance.get(
      endpoints.get_hr,
      {
        params: {
          page: currentPage,
          limit: limit,
          search: searchQuery,
          // date: dateValue,
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

export const getSingleHrFun = async (id) => {
  try {
    const res = await axiosInstance.get(`${endpoints.get_hr}/${id}`, {
      withCredentials: true, // Make sure cookies are sent with the request
    });
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateHrFun = async ({ id, formData }) => {
  try {
    const res = await axiosInstance.post(
      `${endpoints.update_hr}/${id}`,
      formData,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateHrPasswordFun = async ({ id, password }) => {
  console.log(id, password);
  try {
    const res = await axiosInstance.post(
      `${endpoints.update_hr_password}/${id}`,
      { password },
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteHrFun = async (id) => {
  try {
    const res = await axiosInstance.delete(`${endpoints.delete_hr}/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const addHrFun = async (data) => {
  try {
    const res = await axiosInstance.post(endpoints.add_hr, data, {
      withCredentials: true,
    });
  } catch (error) {}
};
