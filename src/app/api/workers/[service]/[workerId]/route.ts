import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Worker from "@/models/worker";

export async function GET(
  req: Request,
  { params }: { params: { workerId: string; service: string } }
) {
  try {
    await connectDB();

    const { workerId } = params;

    // Find worker by ID
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return NextResponse.json(
        { message: "Worker not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(worker);
  } catch (error) {
    console.error("Error fetching worker:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
