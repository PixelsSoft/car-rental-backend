import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  returnDate: {
    type: String,
    default: new Date(),
  },
  description: {
    type: String,
    default: "",
  },
});

const Service = mongoose.model("Service", ServiceSchema);

export default Service;
