import axios from "axios";
import axiosInstance, { endpoints } from "../../api/endpoints";
import { handleError } from "../../api/handleError";

export const getBookingSearchFun = async (fromPlace, toPlace, travelDate) => {
  try {
    console.log(fromPlace, toPlace, travelDate);
    const res = await axios.get(
      `${endpoints.search_booking}?from=${fromPlace}&to=${toPlace}&date=${travelDate}`,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const listBookingSearchFun = async (id) => {
  try {
    const res = await axios.get(`${endpoints.list_booking}/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getSingleCatagorieFun = async (id) => {
  try {
    const res = await axiosInstance.get(`${endpoints.get_catagories}/${id}`, {
      withCredentials: true, // Make sure cookies are sent with the request
    });
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const postCatagorieFun = async (form) => {
  try {
    const res = await axios.post(`${endpoints.post_product}`, form, {
      withCredentials: true,
    });

    return res.data;
  } catch (error) {
    console.error("Error posting category:", error);
    return handleError(error);
  }
};
