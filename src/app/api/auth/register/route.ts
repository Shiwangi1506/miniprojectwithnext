import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import Worker from "@/models/worker";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import cloudinary from "@/lib/cloudinary";
import User from "@/models/user";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Handle multipart form data
    const formData = await req.formData();

    const userId = formData.get("userId") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const pincode = formData.get("pincode") as string;
    const skills = (formData.get("skills") as string)
      ?.split(",")
      .map((s) => s.trim());
    const experience = Number(formData.get("experience")) || 0;
    const price = Number(formData.get("price")) || 0;
    const description = (formData.get("description") as string) || "";

    const avatar = formData.get("avatar") as File | null;
    const idProof = formData.get("idProof") as File | null;
    const certificate = formData.get("certificate") as File | null;

    // ✅ Validate essential fields
    if (
      !userId ||
      !name ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !price ||
      !idProof
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    // ✅ Check if the email is already in use by a DIFFERENT worker
    const conflictingWorker = await Worker.findOne({
      email,
      userId: { $ne: userId }, // $ne selects documents where the value of the field is not equal to the specified value.
    });

    if (conflictingWorker) {
      return NextResponse.json(
        {
          success: false,
          message: "This email is already registered to another professional.",
        },
        { status: 409 } // 409 Conflict is more appropriate for a duplicate resource
      );
    }

    // ✅ Helper function to upload files to Cloudinary
    const uploadToCloudinary = (
      file: File,
      folder: string
    ): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = file.stream().getReader();
        const stream = cloudinary.uploader.upload_stream(
          { folder: folder, resource_type: "auto" },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result) {
              resolve(result.secure_url);
            }
          }
        );

        const pump = () => {
          reader.read().then(({ done, value }) => {
            if (done) {
              stream.end();
              return;
            }
            stream.write(value);
            pump();
          });
        };
        pump();
      });
    };

    const [avatarPath, idProofPath, certificatePath] = await Promise.all([
      avatar ? uploadToCloudinary(avatar, "avatars") : Promise.resolve(""),
      idProof ? uploadToCloudinary(idProof, "id_proofs") : Promise.resolve(""),
      certificate
        ? uploadToCloudinary(certificate, "certificates")
        : Promise.resolve(""),
    ]);

    // Check if a worker profile exists to decide whether to create or update
    const existingWorker = await Worker.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (existingWorker) {
      // ✅ Update existing worker profile
      existingWorker.name = name;
      existingWorker.email = email;
      existingWorker.phone = phone;
      existingWorker.skills = skills;
      existingWorker.experience = experience;
      existingWorker.price = price;
      existingWorker.bio = description;
      existingWorker.location.address = address;
      existingWorker.location.city = city;
      existingWorker.location.state = state;
      existingWorker.location.pincode = pincode;

      // Only update files if new ones are provided
      if (avatarPath) existingWorker.avatar = avatarPath;
      if (idProofPath) existingWorker.idProof = idProofPath;
      if (certificatePath) existingWorker.certificate = certificatePath;

      await existingWorker.save();
    } else {
      // ✅ Create new worker profile
      const worker = new Worker({
        userId: new mongoose.Types.ObjectId(userId),
        name,
        email,
        phone,
        skills,
        experience,
        price,
        bio: description,
        idProof: idProofPath,
        certificate: certificatePath,
        avatar: avatarPath || undefined,
        location: {
          address,
          city,
          state,
          pincode,
          coordinates: { type: "Point", coordinates: [0, 0] },
        },
      });
      await worker.save();

      // Update user's role to 'worker' only when creating the profile for the first time
      await User.findByIdAndUpdate(new mongoose.Types.ObjectId(userId), {
        role: "worker",
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: existingWorker
          ? "Profile updated successfully!"
          : "Worker registered successfully!",
      },
      { status: existingWorker ? 200 : 201 } // 200 OK for update, 201 Created for new
    );
  } catch (error: any) {
    console.error("Worker registration error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
