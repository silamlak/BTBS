import axios from "axios";
import axiosInstance, { endpoints } from "../../api/endpoints";
import { handleError } from "../../api/handleError";

export const getDriversFun = async ({
  currentPage,
  limit,
  searchQuery,
  //   dateValue,
}) => {
  try {
    const res = await axiosInstance.get(
      endpoints.get_driver,
      {
        params: {
          page: currentPage,
          limit: limit,
          search: searchQuery,
          // date: dateValue,
        },
      },
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getDriversListFun = async () => {
  try {
    const res = await axiosInstance.get(endpoints.get_driver_list, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};
  
export const viewDriversFun = async (id) => {
  try {
    const res = await axiosInstance.get(`${endpoints.get_driver}/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateDriverFun = async ({ id, formData }) => {
  try {
    const res = await axiosInstance.post(
      `${endpoints.update_driver}/${id}`,
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

export const deleteDriverFun = async (id) => {
  try {
    const res = await axiosInstance.delete(`${endpoints.delete_driver}/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const addDriverFun = async (data) => {
  try {
    const res = await axiosInstance.post(endpoints.add_driver, data, {
      withCredentials: true,
    });
    return res.data
  } catch (error) {
    return handleError(error);
  }
};
