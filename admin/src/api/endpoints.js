import axios from "axios";
import { store } from "../app/store";
import { login, logoutUser } from "../features/auth/authSlice";
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
        store.dispatch(logoutUser());
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

  //bus operators
  get_bo: `${api}/hr/bo/get`,
  update_bo: `${api}/hr/bo/update`,
  update_bo_password: `${api}/hr/bo/update/password`,
  delete_bo: `${api}/hr/bo/delete`,
  add_bo: `${api}/hr/addbo`,

  //hr
  get_hr: `${api}/admin/hr/get`,
  update_hr: `${api}/admin/hr/update`,
  update_hr_password: `${api}/admin/hr/update/password`,
  delete_hr: `${api}/admin/hr/delete`,
  add_hr: `${api}/admin/addhr`,
  //tso
  get_tso: `${api}/hr/tso/get`,
  get_tso_list: `${api}/hr/tso/get_list`,
  update_tso: `${api}/hr/tso/update`,
  delate_tso: `${api}/hr/tso/delete`,
  update_tso_password: `${api}/hr/tso/update/password`,
  add_tso: `${api}/hr/adddtso`,

  //drivers
  get_driver_list: `${api}/hr/driver/get_list`,
  get_driver: `${api}/hr/driver/get`,
  update_driver: `${api}/hr/driver/update`,
  delete_driver: `${api}/hr/driver/delete`,
  add_driver: `${api}/hr/adddriver`,

  //buses
  get_bus: `${api}/hr/bus/get`,
  get_bus_list: `${api}/hr/bus/get_list`,
  update_bus: `${api}/hr/bus/update`,
  delete_bus: `${api}/hr/bus/delete`,
  add_bus: `${api}/hr/addbus`,

  //station
  get_station: `${api}/bo/place/get`,
  update_station: `${api}/bo/place/update`,
  add_station: `${api}/bo/addplace`,

  //schedule
  get_schedule: `${api}/bo/schedule/get`,
  update_schedule: `${api}/bo/schedule/update`,
  add_schedule: `${api}/bo/addschedule`,

  //route
  get_route: `${api}/bo/route/get`,
  get_route_list: `${api}/bo/route/get_list`,
  update_route: `${api}/bo/route/update`,
  add_route: `${api}/bo/addroute`,

  //tsoo
  booking: `${api}/tso/book`,
  seat: `${api}/tso/seat`,
  get_total_seat: `${api}/bo/total/seat`,
  get_booking: `${api}/tso/booking`,
  cancel_booking: `${api}/tso/booking/cancel`,
  get_bo_schedule: `${api}/tso/schedule/get`,

  //booking
  search_booking: `${api}/tso/search`,

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