import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import Worker from "@/models/worker";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const formData = await request.formData();
    const userId = formData.get("userId") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const skills = formData.get("skills") as string;
    const experience = formData.get("experience") as string;
    const price = formData.get("price") as string;
    const description = formData.get("description") as string;
    const avatarFile = formData.get("avatar") as File | null;
    let avatarUrl: string | undefined;

    if (
      !userId ||
      !name ||
      !email ||
      !phone ||
      !skills ||
      !experience ||
      !price
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    // Check if a worker profile already exists for this user
    const existingWorker = await Worker.findOne({ userId });
    if (existingWorker) {
      return NextResponse.json(
        { success: false, message: "Worker profile already exists." },
        { status: 409 }
      );
    }

    // If an avatar file is provided, upload it to Cloudinary
    if (avatarFile) {
      // Convert file to buffer
      const fileBuffer = await avatarFile.arrayBuffer();
      const mimeType = avatarFile.type;
      const encoding = "base64";
      const base64Data = Buffer.from(fileBuffer).toString("base64");
      const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;

      const uploadResult = await cloudinary.uploader.upload(fileUri, {
        folder: "urbansetgo_profiles",
      });
      avatarUrl = uploadResult.secure_url;
    }

    // Create a new worker profile
    const newWorker = new Worker({
      userId,
      name,
      email,
      phone,
      address,
      location: {
        city,
      },
      skills: skills.split(",").map((s) => s.trim()),
      experience: Number(experience),
      price: Number(price),
      description: description, // This was missing from the object being saved
      avatar: avatarUrl,
    });

    await newWorker.save();

    // Update the user's role to 'worker'
    await User.findByIdAndUpdate(userId, { role: "worker" });

    return NextResponse.json(
      { success: true, message: "Professional registration successful!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred during registration." },
      { status: 500 }
    );
  }
}
