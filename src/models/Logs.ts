import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: ["reservation", "exit", "entry", "cancellation"],
  },
  userId: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Log", logSchema);
