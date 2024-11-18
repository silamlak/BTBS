import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { cancelBookingFun, getBookingFun } from "../../features/booking/bookingApi";
import { useLocation } from "react-router-dom";

const MyBooking = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const search = params.get("search");
  const { data } = useQuery({
    queryKey: ["booking"],
    queryFn: () => getBookingFun(search),
    enabled: !!search,
  });
//   console.log(data);
const mutation = useMutation({
  mutationFn: cancelBookingFun,
  onSuccess: (data) => {
    console.log(data);
  }
});
  const handleCancel = () => {
    console.log("Cancel clicked");
    mutation.mutate(data?._id);
  };
  return (
    <div>
      <button onClick={handleCancel}>Cancel</button>
      {/* <button>Cancel</button> */}
    </div>
  );
};

export default MyBooking;
