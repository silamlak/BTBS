import mongoose from "mongoose";

const BusSchema = new mongoose.Schema(
  {
    bus_id: {
      type: String,
      required: true,
      unique: true,
    },
    driver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    route_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: false,
    },
    taken: {
      type: Boolean,
      default: false
    },
    license_plate: {
      type: String,
      required: true,
      unique: true,
    },
    make: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year_of_manufacture: {
      type: Number,
      required: true,
    },
    seating_capacity: {
      type: Number,
      required: true,
    },
    fuel_type: {
      type: String,
      enum: ["Diesel", "Petrol", "Electric", "Hybrid"],
      required: true,
    },
    last_service_date: {
      type: Date,
      //   required: true,
    },
    next_service_due: {
      type: Date,
      //   required: true,
    },
    maintenance_records: [
      {
        service_date: {
          type: Date,
          // required: true,
        },
        description: {
          type: String,
          // required: true,
        },
        performed_by: {
          type: String,
          // required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ["Active", "In Service", "Under Maintenance", "Retired"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Bus", BusSchema);
