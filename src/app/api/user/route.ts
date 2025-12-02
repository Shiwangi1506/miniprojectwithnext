import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import Booking from "@/models/booking";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { message: "Email query parameter is required" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Fetch bookings for this user
    const bookings = await Booking.find({ userId: user._id })
      .populate({
        path: "workerId",
        model: "Worker",
        select: "name skills",
      })
      .sort({ date: -1, time: -1 });

    // Combine user data and bookings
    const data = {
      ...user.toObject(),
      bookings,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const { username, location } = await request.json();

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { username, "location.city": location },
      { new: true }
    );

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}
