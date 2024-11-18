import axios from "axios";
import axiosInstance, { endpoints } from "../../api/endpoints";
import { handleError } from "../../api/handleError";

export const getTsoFun = async ({
  currentPage,
  limit,
  searchQuery,
  //   dateValue,
}) => {
  try {
    const res = await axiosInstance.get(
      endpoints.get_tso,
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

export const viewTsoFun = async (id) => {
  try {
    const res = await axiosInstance.get(`${endpoints.get_tso}/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateTsoFun = async ({ id, formData }) => {
  try {
    const res = await axiosInstance.post(
      `${endpoints.update_tso}/${id}`,
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

export const addTsoFun = async (data) => {
  try {
    const res = await axiosInstance.post(endpoints.add_tso, data, {
      withCredentials: true,
    });
  } catch (error) {
    return handleError(error);
  }
};
