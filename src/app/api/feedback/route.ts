import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Worker from "@/models/worker";
import Feedback from "@/models/feedback";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "worker") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    // Find the worker profile associated with the logged-in user
    const worker = await Worker.findOne({ userId: session.user.id });

    if (!worker) {
      return NextResponse.json(
        { message: "Worker profile not found" },
        { status: 404 }
      );
    }

    // Find all feedback for this worker, sorted by most recent
    const feedbacks = await Feedback.find({ workerId: worker._id }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ success: true, feedback: feedbacks });
  } catch (error) {
    console.error("Error fetching worker feedback:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
