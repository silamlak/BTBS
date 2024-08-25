import axios from "axios";
import axiosInstance, { endpoints } from "../../api/endpoints";
import { handleError } from "../../api/handleError";

export const getSingleProductFun = async (id) => {
  try {
    const res = await axiosInstance.get(`${endpoints.get_product}/${id}`, {
      withCredentials: true, // Make sure cookies are sent with the request
    });
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getProductFun = async ({
  currentPage,
  limit,
  searchQuery,
  selectedCategory,
}) => {
  try {
    const res = await axiosInstance.get(
      `${endpoints.get_product}`,
      {
        params: {
          page: currentPage,
          limit: limit,
          search: searchQuery,
          category: selectedCategory,
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

export const postProductCreateFun = async (data) => {
  try {
    const res = await axiosInstance.post(
      `${endpoints.create_product}`,
      data,

      {
        withCredentials: true, // Make sure cookies are sent with the request
      }
    );
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const putProductFun = async ({id, product}) => {
  try {
    console.log( id, product);
    const res = await axiosInstance.put(
      `${endpoints.update_product}/${id}`,
      product,

      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getCategoryForProductCreationFun = async () => {
  try {
    const res = await axiosInstance.get(`${endpoints.get_catagories}`, {
      withCredentials: true, // Make sure cookies are sent with the request
    });
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};
