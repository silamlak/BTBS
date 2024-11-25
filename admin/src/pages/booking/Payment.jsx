import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { bookingFun, seatFun } from "../../features/booking/bookingApi";
import { useNavigate } from "react-router-dom";
import { clearAll } from "../../features/catagorie/catagorieSlice";

const Payment = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
      const {
        passengerData,
        selectedPassengerIndex,
        selectedSeats,
        seats,
        busId,
        scheduleId,
      } = useSelector((state) => state.catagorie);

      // console.log(scheduleId, busId);
      const seatData = []
      for (let i = 0; i < seats.length; i++) {
        seatData.push({
          seat_no: seats[i].seatNo
        })
      }
      const bookingData = {
        busId,
        scheduleId,
        passengers: passengerData,
        seats,
      };
      const { mutate: seatMutate } = useMutation({
        mutationFn: seatFun,
        onSuccess: (data) => {
          console.log(data.msg);
          dispatch(clearAll())
          navigate('/categorie')
        },
      });
      const {mutate: bookMutate} = useMutation({
        mutationFn: bookingFun,
        onSuccess: (data) => {
            console.log(data.booked);
            const updatedData = seatData.map((s,i) => {
              return {
                ...s,
                bookId: data?.booked?._id,
                scheduleId,
                bus_id: busId,
              };
            })
            seatMutate(updatedData);
        }
      })
  const handleBooking = () => {
    bookMutate(bookingData);
  };
  return (
    <div>
      pay
      <button onClick={handleBooking}>book</button>
    </div>
  );
};

export default Payment;
