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
      tso_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TicketSalesOfficer",
      },
    // assigned_officers: [
    // ],
  },
  { timestamps: true }
);

export default mongoose.model("StationPlaces", StationPlaceSchema);
