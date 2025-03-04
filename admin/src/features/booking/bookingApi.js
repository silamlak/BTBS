import axios from "axios";
import axiosInstance, { endpoints } from "../../api/endpoints";
import { handleError } from "../../api/handleError";

export const bookingFun = async (data) => {
  try {
    console.log("object");
    const res = await axiosInstance.post(endpoints.booking, data, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const rescheduleBookingFun = async ({ id, bookingData }) => {
  try {
    console.log("object");
    const res = await axiosInstance.post(
      `${endpoints.reschedule_booking}/${id}`,
      bookingData,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};
export const totalSeatFun = async ({ totalPass, scheduleId }) => {
  console.log(totalPass, scheduleId);
  try {
    const res = await axiosInstance.post(
      endpoints.get_total_seat,
      { totalPass, scheduleId },
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const seatFun = async (data) => {
  try {
    console.log(data);
    const res = await axiosInstance.post(endpoints.seat, data, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getSeatFun = async ({ scheduleId, bus_id }) => {
  try {
    console.log(scheduleId, bus_id);
    const res = await axiosInstance.get(
      `${endpoints.seat}/${scheduleId}?bus_id=${bus_id}`,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getBookingFun = async (id) => {
  try {
    console.log(id);
    const res = await axiosInstance.get(`${endpoints.get_booking}/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const cancelBookingFun = async (id) => {
  try {
    console.log(id);
    const res = await axiosInstance.delete(
      `${endpoints.cancel_booking}/${id}`,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateBookingPassengerFun = async ({ id, data }) => {
  try {
    console.log(id);
    const res = await axiosInstance.post(
      `${endpoints.update_booking_pass}/${id}`,
      data,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateBookingSeatFun = async ({ id, data, seats }) => {
  try {
    console.log(id);
    const res = await axiosInstance.post(
      `${endpoints.update_booking_seat}/${id}`,
      { data, seats },
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};
