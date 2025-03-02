import axios from "axios";
import axiosInstance, { endpoints } from "../../api/endpoints";
import { handleError } from "../../api/handleError";

export const getScheduleFun = async ({
  currentPage,
  limit,
  searchQuery,
  //   dateValue,
}) => {
  try {
    const res = await axiosInstance.get(
      endpoints.get_schedule,
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

export const viewScheduleFun = async (id) => {
  try {
    const res = await axiosInstance.get(`${endpoints.get_schedule}/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateScheduleFun = async ({ id, formData }) => {
  try {
    const res = await axiosInstance.post(
      `${endpoints.update_schedule}/${id}`,
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

export const addScheduleFun = async (data) => {
  try {
    const res = await axiosInstance.post(endpoints.add_schedule, data, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteScheduleFun = async (id) => {
  try {
    const res = await axiosInstance.delete(`${endpoints.delete_schedule}/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};
