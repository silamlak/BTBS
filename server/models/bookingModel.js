import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },
    scheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
    },
    seats: [
      {
        seat_id: {
          type: mongoose.Schema.Types.ObjectId,
          required: false,
        },
        seatId: {
          type: String,
          required: true,
        },
        name: {
          type: String,
        },
        seatNo: {
          type: Number,
        }
      },
    ],
    passengers: [
      {
        type: {
          type: String,
          required: true,
        },
        first_name: {
          type: String,
          required: true,
        },
        last_name: {
          type: String,
          required: true,
        },
        gender: {
          type: String,
          required: true,
        },
        // age: {
        //   type: Number,
        //   required: true,
        // },
        id: {
          type: String,
          required: true,
        },
        // gender: {
        //   type: String,
        //   required: true,
        // },
        // contactInfo: {
          email: {
            type: String,
            // required: true,
          },
          phone: {
            type: String,
            // required: true,
          },
        // },
      },
    ],
    // payment: {
    //   amount: {
    //     type: Number,
    //     required: true,
    //   },
    //   paymentMethod: {
    //     type: String,
    //     required: true,
    //   },
    //   transactionId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Transaction",
    //     required: false,
    //   },
    //   status: {
    //     type: String,
    //     enum: ["pending", "success", "failed"],
    //     default: "pending",
    //   },
    // },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema)