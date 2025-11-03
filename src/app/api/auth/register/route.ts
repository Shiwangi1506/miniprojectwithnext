import dbConnect from "@/lib/dbConnect";
import Worker from "@/models/worker";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const worker = new Worker({
      name: body.name, // ✅ matches schema
      email: body.email,
      phone: body.phone,
      password: hashedPassword,
      location: {
        city: body.location.city,
        state: body.location.state,
        pincode: body.location.pincode,
      },
      skills: body.skills,
      experience: Number(body.experience), // ✅ convert safely
      idProof: body.idProof,
      certificate: body.certificate,
      description: body.description,
    });

    await worker.save();
    return NextResponse.json(
      { message: "Worker registered successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering worker:", error);
    return NextResponse.json(
      { message: "Server error. Try again later." },
      { status: 500 }
    );
  }
}
