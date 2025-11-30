import dbConnect from "@/lib/dbConnect";
import Worker from "@/models/worker";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ service: string }> } // 👈 params is async
) {
  const { service } = await context.params; // 👈 MUST AWAIT

  if (!service) {
    return NextResponse.json(
      { success: false, message: "Service parameter is missing" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const workers = await Worker.find({
      skills: { $regex: new RegExp(`^${service.replace("-", " ")}$`, "i") },
    }).lean();

    return NextResponse.json({ success: true, workers });
  } catch (error) {
    console.error(`Error fetching workers for service: ${service}`, error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
