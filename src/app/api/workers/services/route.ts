import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Worker from "@/models/worker";

/**
 * GET handler to fetch the current worker's services
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "worker") {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const worker = await Worker.findOne({ userId: session.user.id }).select(
      "skills price"
    );

    if (!worker) {
      return NextResponse.json(
        { message: "Worker profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        skills: worker.skills || [],
        price: worker.price || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching worker services:", error);
    return NextResponse.json(
      { message: "Error fetching services" },
      { status: 500 }
    );
  }
}

/**
 * PATCH handler to update the worker's entire services array
 */
export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "worker") {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const { skills, price } = await request.json();

    // Basic validation
    if (!Array.isArray(skills) || typeof price !== "number") {
      return NextResponse.json(
        { message: "Invalid data format." },
        { status: 400 }
      );
    }

    const updatedWorker = await Worker.findOneAndUpdate(
      { userId: session.user.id },
      { $set: { skills: skills, price: price } },
      { new: true, runValidators: true }
    );

    if (!updatedWorker) {
      return NextResponse.json(
        { message: "Worker not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        skills: updatedWorker.skills,
        price: updatedWorker.price,
      },
    });
  } catch (error) {
    console.error("Error updating worker services:", error);
    return NextResponse.json(
      { message: "Error updating services" },
      { status: 500 }
    );
  }
}
