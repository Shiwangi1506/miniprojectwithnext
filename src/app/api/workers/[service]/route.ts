import dbConnect from "@/lib/dbConnect";
import Worker from "@/models/worker";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { service: string } }
) {
  await dbConnect();

  try {
    const { service } = params;

    if (!service) {
      return NextResponse.json(
        { success: false, message: "Service parameter is missing." },
        { status: 400 }
      );
    }

    // Find workers where the 'skills' array contains the requested service
    const workers = await Worker.find({ skills: service });

    return NextResponse.json({ success: true, workers }, { status: 200 });
  } catch (error) {
    console.error("Error fetching workers by service:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
