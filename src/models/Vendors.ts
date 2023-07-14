import mongoose from "mongoose";

const VendorsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Vendor name is required"],
  },
  description: {
    type: String,
    default: "",
  },
  bills: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bill",
    },
  ],
});

const Vendor = mongoose.model("Vendor", VendorsSchema);

export default Vendor;
