import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/booking";
import "@/models/worker"; // Import to register the Worker schema with Mongoose
import { NextResponse } from "next/server";
import mongoose from "mongoose";

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

    // Find all bookings for this user and populate the worker details
    const bookings = await Booking.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .populate({
        path: "workerId",
        model: "Worker", // must match the registered model name
        select: "name avatar skills",
      })
      .sort({ date: -1 });

    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
