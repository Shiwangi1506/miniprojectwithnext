import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import Booking from "@/models/booking";
import Worker from "@/models/worker";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();
    const userId = (session.user as { id: string }).id;

    // Find the worker profile for the logged-in user.
    // This handles the case where userId might be stored as a string in the worker collection.
    let worker = await Worker.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });
    if (!worker) {
      worker = await Worker.findOne({ userId: userId as any });
    }

    if (!worker) {
      return NextResponse.json(
        { success: false, message: "Worker profile not found." },
        { status: 404 }
      );
    }

    // Find all bookings for this worker and populate the user details
    const bookings = await Booking.find({ workerId: worker._id })
      .populate({ path: "userId", model: "User", select: "username email" })
      .sort({ date: -1 }); // Sort by most recent booking date

    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching worker bookings:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
