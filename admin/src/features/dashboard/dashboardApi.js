import axios from "axios";
import axiosInstance, { endpoints } from "../../api/endpoints";
import { handleError } from "../../api/handleError";

export const getEachTotalFun = async (form) => {
  try {
    const res = await axiosInstance.get(endpoints.get_each_total, {
      withCredentials: true, // Make sure cookies are sent with the request
    });
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getCatagoryDestributionFun = async (id) => {
  try {
    const res = await axiosInstance.get(
      `${endpoints.get_category_destribution}`,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getTopUsersFun = async (id) => {
  try {
    const res = await axiosInstance.get(`${endpoints.get_top_user}`, {
      withCredentials: true, // Make sure cookies are sent with the request
    });
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getPendingOrdersFun = async (id) => {
  try {
    const res = await axiosInstance.get(`${endpoints.get_pending_orders}`, {
      withCredentials: true, // Make sure cookies are sent with the request
    });
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getSalesRevenueFun = async (id) => {
  try {
    const res = await axiosInstance.get(`${endpoints.get_sales_revenue}`, {
      withCredentials: true, // Make sure cookies are sent with the request
    });
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};
