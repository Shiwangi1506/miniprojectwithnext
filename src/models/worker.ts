import mongoose from "mongoose";

const WorkerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  skills: { type: [String], required: true, index: true },
  experience: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  location: {
    city: { type: String, required: true, index: true },
    coordinates: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
  },
  rating: { type: Number, default: 0 },
  availability: {
    type: [String],
    default: ["morning", "afternoon", "evening"],
  },
  createdAt: { type: Date, default: Date.now },
});

WorkerSchema.index({ "location.coordinates": "2dsphere" });

export default mongoose.models.Worker || mongoose.model("Worker", WorkerSchema);
