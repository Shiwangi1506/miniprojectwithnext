import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Booking from "@/models/booking";
import Worker from "@/models/worker";
import User from "@/models/user";

interface BookingRequest {
  workerId: string;
  service: string;
  date: string;
  userId?: string;
}

interface BookingResponse {
  message: string;
  booking?: BookingDocument;
}

interface BookingDocument extends Document {
  workerId: string;
  userId: string;
  service: string;
  date: string;
  status: string;
}

// ✅ POST — create a new booking
export async function POST(
  req: Request
): Promise<NextResponse<BookingResponse>> {
  try {
    await connectDB();

    const body = await req.json();
    const { workerId, service, date, userId }: BookingRequest = body;

    if (!workerId || !service || !date) {
      return NextResponse.json(
        { message: "Missing booking details" },
        { status: 400 }
      );
    }

    const worker = await Worker.findById(workerId);
    if (!worker) {
      return NextResponse.json(
        { message: "Worker not found" },
        { status: 404 }
      );
    }

    const newBooking = new Booking({
      workerId,
      userId: userId || "guest", // Replace with logged-in user later
      service,
      date,
      status: "pending",
    });

    await newBooking.save();

    return NextResponse.json(
      { message: "Booking successful", booking: newBooking },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking creation failed:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// ✅ GET — fetch bookings for a user
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Missing userId" },
        { status: 400 }
      );
    }

    const bookings = await Booking.find({ userId });

    return NextResponse.json(
      { success: true, data: bookings },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
