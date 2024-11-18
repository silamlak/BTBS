import axios from "axios";
import axiosInstance, { endpoints } from "../../api/endpoints";
import { handleError } from "../../api/handleError";

export const bookingFun = async (data) => {
  try {
    console.log('object')
    const res = await axiosInstance.post(endpoints.booking, data, {
      withCredentials: true,
    });
    return res.data
  } catch (error) {
    return handleError(error);
  }
};

export const seatFun = async (data) => {
  try {
    console.log(data)
    const res = await axiosInstance.post(endpoints.seat, data, {
      withCredentials: true,
    });
    return res.data
  } catch (error) {
    return handleError(error);
  }
};

export const getSeatFun = async (id) => {
  try {
    console.log(id)
    const res = await axiosInstance.get(`${endpoints.seat}/${id}`, {
      withCredentials: true,
    });
    return res.data
  } catch (error) {
    return handleError(error);
  }
};

export const getBookingFun = async (id) => {
  try {
    console.log(id)
    const res = await axiosInstance.get(`${endpoints.get_booking}/${id}`, {
      withCredentials: true,
    });
    return res.data
  } catch (error) {
    return handleError(error);
  }
};

export const cancelBookingFun = async (id) => {
  try {
    console.log(id)
    const res = await axiosInstance.get(`${endpoints.cancel_booking}/${id}`, {
      withCredentials: true,
    });
    return res.data
  } catch (error) {
    return handleError(error);
  }
};

