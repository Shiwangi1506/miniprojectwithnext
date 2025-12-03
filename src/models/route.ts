import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Feedback from "@/models/feedback";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: { workerId: string } }
) {
  const { workerId } = params;

  if (!mongoose.Types.ObjectId.isValid(workerId)) {
    return NextResponse.json(
      { success: false, message: "Invalid worker ID format." },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const feedback = await Feedback.find({ workerId })
      .sort({ createdAt: -1 }) // Sort by most recent first
      .populate("userId", "username"); // Optionally populate user's name

    if (!feedback) {
      // This case is unlikely with find(), which returns [], but good practice.
      return NextResponse.json(
        {
          success: true,
          message: "No feedback found for this worker.",
          data: [],
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: true, data: feedback });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while fetching feedback." },
      { status: 500 }
    );
  }
}
