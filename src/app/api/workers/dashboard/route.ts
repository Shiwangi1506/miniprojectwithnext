import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/booking";
import User from "@/models/user";
import Worker from "@/models/worker";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "worker") {
    return NextResponse.json(
      { success: false, message: "Not authenticated or not a worker" },
      { status: 401 }
    );
  }

  const userId = session.user.id;

  // 1. Add a check to ensure userId is not undefined
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "User ID not found in session" },
      { status: 401 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    // Now userId is guaranteed to be a string
    return NextResponse.json(
      { success: false, message: "Invalid worker ID" },
      { status: 400 }
    );
  }

  await dbConnect();

  try {
    // Fetch worker details
    const worker = await Worker.findOne({ userId: userId }).select(
      "name email avatar"
    ); // Use Worker model

    if (!worker) {
      return NextResponse.json(
        // This can happen if a user with role 'worker' doesn't have a corresponding Worker profile document
        { success: false, message: "Worker not found" },
        { status: 404 }
      );
    }

    // Fetch booking stats
    const bookingStats = await Booking.aggregate([
      { $match: { workerId: new mongoose.Types.ObjectId(worker._id) } }, // Use the ID from the Worker document
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$price", 0] },
          },
        },
      },
    ]);

    const stats = {
      pending: bookingStats.find((s) => s._id === "pending")?.count || 0,
      confirmed: bookingStats.find((s) => s._id === "confirmed")?.count || 0,
      completed: bookingStats.find((s) => s._id === "completed")?.count || 0,
      totalEarnings:
        bookingStats.find((s) => s._id === "completed")?.totalAmount || 0,
    };

    // Fetch recent feedback (assuming you have a Review model)
    // For now, we'll return an empty array as the model is not provided.
    const recentFeedback: any[] = []; // 2. Explicitly type the array to resolve the 'any[]' error

    return NextResponse.json({
      success: true,
      data: {
        worker,
        stats,
        recentFeedback,
      },
    });
  } catch (error) {
    console.error("Error fetching worker dashboard data:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching dashboard data" },
      { status: 500 }
    );
  }
}
