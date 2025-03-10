import axios from "axios";
import axiosInstance, { endpoints } from "../../api/endpoints";
import { handleError } from "../../api/handleError";

export const getBusesFun = async ({
  currentPage,
  limit,
  searchQuery,
  //   dateValue,
}) => {
  try {
    const res = await axiosInstance.get(
      endpoints.get_bus,
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

export const getBusesListFun = async () => {
  try {
    const res = await axiosInstance.get(endpoints.get_bus_list, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};
export const getRoutesBusesListFun = async (id, date, from, to) => {
  try {
    console.log(id, date, from, to);

    const res = await axiosInstance.get(`${endpoints.get_bo_bus_list}/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};


export const viewBusFun = async (id) => {
  try {
    const res = await axiosInstance.get(`${endpoints.get_bus}/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateBusFun = async ({ id, formData }) => {
  try {
    const res = await axiosInstance.post(
      `${endpoints.update_bus}/${id}`,
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

export const deleteBusFun = async (id) => {
  try {
    const res = await axiosInstance.delete(`${endpoints.delete_bus}/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const addBusFun = async (data) => {
  try {
    const res = await axiosInstance.post(endpoints.add_bus, data, {
      withCredentials: true,
    });
  } catch (error) {
    return handleError(error);
  }
};
