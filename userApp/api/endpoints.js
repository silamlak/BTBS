import axios from "axios";
import { store } from "../store/store";
import { login, logout } from "../feature/auth/authSlice";
const api = "http://10.10.34.17:8000/api";

export const endpoints = {
  //tsoo
  booking: `${api}/tso/book`,
  seat: `${api}/tso/seat`,
  get_total_seat: `${api}/bo/total/seat`,
  get_booking: `${api}/tso/booking`,
  cancel_booking: `${api}/tso/booking/cancel`,

  my_booking: `${api}/tso/booking/my`,
  my_booking_detail: `${api}/tso/booking/my-booking-detail`,
  update_booking_pass: `${api}/tso/booking/my-booking/edit/passenger`,
  update_booking_seat: `${api}/tso/booking/my-booking/edit/seat`,

  //booking
  search_booking: `${api}/tso/search`,
};
