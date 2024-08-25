import mongoose from "mongoose";

const TicketSalesOfficerSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    middle_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    hire_date: {
      type: Date,
      default: Date.now,
    },
    salary: {
      type: Number,
      required: true,
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
    },
    employment_status: {
      type: String,
      required: true,
      enum: ["Active", "Inactive", "Suspended"],
    },
    profile_picture_url: {
      type: String,
      required: false,
    },
    id_picture_url: {
      type: String,
      required: true,
    },
    assigned_station: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station", // Reference to a Station schema (if applicable)
      required: true,
    },
    ticket_sales: [
      {
        sale_date: {
          type: Date,
        //   required: true,
        },
        bus_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Bus",
        //   required: true,
        },
        route_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Route",
        //   required: true,
        },
        tickets_sold: {
          type: Number,
        //   required: true,
        },
        total_amount: {
          type: Number,
        //   required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("TicketSalesOfficer", TicketSalesOfficerSchema);
