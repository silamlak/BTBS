import axios from "axios";
import { store } from "../store/store";
import { login, logout } from "../feature/auth/authSlice";
const api = "http://10.10.34.224:8000/api";

export const endpoints = {
  // signin: `${api}/auth/signin`,
  // signup: `${api}/auth/signup`,
  // confirm: `${api}/auth/confirm-otp`,
  // request_reset: `${api}/auth/request/reset`,
  // reset_password: `${api}/auth/reset`,

  //tsoo
  booking: `${api}/tso/book`,
  seat: `${api}/tso/seat`,
  get_total_seat: `${api}/bo/total/seat`,
  get_booking: `${api}/tso/booking`,
  cancel_booking: `${api}/tso/booking/cancel`,

  //booking
  search_booking: `${api}/tso/search`,

};
