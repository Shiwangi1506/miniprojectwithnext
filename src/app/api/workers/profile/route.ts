import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Worker from "@/models/worker";
import cloudinary from "@/lib/cloudinary"; // 👈 Import configured Cloudinary instance

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "worker") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const formData = await request.formData();
    const avatarFile = formData.get("avatar") as File | null;

    let avatarUrl: string | undefined;

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

    // Find the worker by their user ID from the session
    const worker = await Worker.findOne({ userId: session.user.id });

    if (!worker) {
      return NextResponse.json(
        { success: false, message: "Worker profile not found." },
        { status: 404 }
      );
    }

    // Update worker's avatar if a new one was uploaded
    if (avatarUrl) {
      worker.avatar = avatarUrl;
    }

    // You can add more fields to update here from formData
    // e.g., worker.name = formData.get('name') || worker.name;

    await worker.save();

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      worker,
    });
  } catch (error) {
    console.error("Error updating worker profile:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while updating the profile.",
      },
      { status: 500 }
    );
  }
}
