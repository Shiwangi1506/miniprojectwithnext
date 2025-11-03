import dbConnect from "@/lib/dbConnect";
import Worker from "@/models/worker";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { service: string } }
) {
  try {
    await dbConnect();
    const { service } = params;

    const workers = await Worker.find({
      skills: { $in: [service.toLowerCase()] },
    });

    return NextResponse.json(workers);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
