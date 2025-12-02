import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFeedback extends Document {
  workerId: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

const FeedbackSchema: Schema<IFeedback> = new Schema({
  workerId: { type: Schema.Types.ObjectId, ref: "Worker", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  userAvatar: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default (mongoose.models.Feedback as mongoose.Model<IFeedback>) ||
  mongoose.model<IFeedback>("Feedback", FeedbackSchema);
