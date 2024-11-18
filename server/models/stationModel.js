import mongoose from "mongoose";

const StationPlaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
        type: String,
        required: true
    },
    contact_number: {
      type: String,
      required: true,
    },
    // operating_hours: {
    //   open: {
    //     type: String,
    //     required: true,
    //   },
    //   close: {
    //     type: String,
    //     required: true,
    //   },
    // },
    // assigned_officers: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "TicketSalesOfficer",
    //   },
    // ],
  },
  { timestamps: true }
);

export default mongoose.model("StationPlaces", StationPlaceSchema);
