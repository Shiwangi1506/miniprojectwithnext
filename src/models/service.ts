import mongoose, { Schema, Document } from "mongoose";

export interface IService extends Document {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
}

const ServiceSchema: Schema<IService> = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

export default (mongoose.models.Service as mongoose.Model<IService>) ||
  mongoose.model<IService>("Service", ServiceSchema);
