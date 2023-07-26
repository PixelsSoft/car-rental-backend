import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
  },
  servicesDate: {
    type: Date,
    default: new Date(),
  },
  description: {
    type: String,
    default: "",
  },
});

const Service = mongoose.model("Service", ServiceSchema);

export default Service;
