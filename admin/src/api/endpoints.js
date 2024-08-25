import axios from "axios";
import { store } from "../app/store";
import { login, logout } from "../features/auth/authSlice";
const api = import.meta.env.VITE_API;

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Request interceptor to add auth token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    // console.log(token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(
          "http://localhost:8000/api/auth/refresh",{},
          {
            withCredentials: true,
          }
        );
        console.log(response.data);
        const newAccessToken = response.data;
        store.dispatch(login(newAccessToken));
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // store.dispatch(logout());
        console.error("Refresh token failed", refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;


export const endpoints = {
  signin: `${api}/auth/signin`,
  signup: `${api}/auth/signup`,
  confirm: `${api}/auth/confirm-otp`,
  request_reset: `${api}/auth/request/reset`,
  reset_password: `${api}/auth/reset`,

  //service or prioduct
  update_product: `/admin/service/edit`,
  get_product: `/admin/service/get`,
  create_product: `/admin/service/add`,

  //orders
  get_orders: `/admin/order/get`,
  delete_orders: `/admin/order/delete`,

  //category
  get_catagories: `/admin/catagorie/get`,
  post_product: `${api}/admin/catagorie/add`,

  //dashboard
  get_each_total: `/admin/dashboard/total/get`,
  get_category_destribution: `/admin/dashboard/catagory`,
  get_top_user: `/admin/dashboard/top/users`,
  get_pending_orders: `/admin/dashboard/pendings`,
  get_sales_revenue: `/admin/dashboard/sales`,

  //customers
  get_customers: `/admin/customers/all`,
  delete_customers: `/admin/customer/delete`,
  get_customer: `/admin/customer/get`,
};