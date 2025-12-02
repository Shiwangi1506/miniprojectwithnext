import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/booking";
import mongoose from "mongoose";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const { id: bookingId } = await params; // ← FIXED
  const { status } = await request.json();

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return NextResponse.json(
      { success: false, message: "Invalid booking ID" },
      { status: 400 }
    );
  }

  if (!["pending", "confirmed", "completed"].includes(status)) {
    return NextResponse.json(
      { success: false, message: "Invalid status value" },
      { status: 400 }
    );
  }

  await dbConnect();

  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    if (!updatedBooking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, booking: updatedBooking });
  } catch (error) {
    console.error("Error updating booking status:", error);
    return NextResponse.json(
      { success: false, message: "Error updating booking status" },
      { status: 500 }
    );
  }
}
