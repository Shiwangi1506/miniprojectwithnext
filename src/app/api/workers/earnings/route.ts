import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import Booking from "@/models/booking";
import Worker from "@/models/worker";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "worker") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();
    const userId = (session.user as { id: string }).id;

    // Find the worker profile for the logged-in user.
    const worker = await Worker.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!worker) {
      return NextResponse.json(
        { success: false, message: "Worker profile not found." },
        { status: 404 }
      );
    }

    // Find all bookings for this worker to calculate earnings
    const earningsData = await Booking.find({ workerId: worker._id })
      .select("service date price status") // Select only relevant fields
      .sort({ date: -1 }); // Sort by most recent booking date

    // Map to the format expected by the frontend
    const formattedEarnings = earningsData.map((booking) => ({
      date: new Date(booking.date).toLocaleDateString(),
      jobTitle: booking.service,
      amount: booking.price,
      status: booking.status,
    }));

    return NextResponse.json({ success: true, earnings: formattedEarnings });
  } catch (error) {
    console.error("Error fetching worker earnings:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
