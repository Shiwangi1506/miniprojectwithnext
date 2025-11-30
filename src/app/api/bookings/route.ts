import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/booking";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { workerId, price, date, slot, address, notes, service } =
      await request.json();
    const userId = (session.user as { id: string }).id;

    if (!workerId || !price || !date || !slot || !address || !service) {
      return NextResponse.json(
        { success: false, message: "Missing required booking fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    const newBooking = new Booking({
      userId,
      workerId,
      service,
      price,
      date,
      slot,
      address,
      notes,
      status: "pending", // Default status
    });

    await newBooking.save();

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
