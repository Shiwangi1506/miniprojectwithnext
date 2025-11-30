import mongoose from "mongoose";

const workerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  skills: [{ type: String, required: true }],
  experience: { type: Number, default: 0 },
  price: { type: Number, default: 500 }, //  Default base price
  rating: { type: Number, default: 4.5 }, //  Default rating
  reviews: { type: Number, default: 0 },
  bio: { type: String, default: "Experienced and reliable professional." },
  avatar: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", // 👤 Default avatar
  },
  topRated: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  location: {
    city: { type: String, required: true },
    coordinates: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
  },
  availability: { type: [String], default: [] },
});

export default mongoose.models.Worker || mongoose.model("Worker", workerSchema);
