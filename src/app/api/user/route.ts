import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import User from "@/models/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email)
    return NextResponse.json({ error: "Missing email" }, { status: 400 });

  const user = await User.findOne({ email });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  await connectDB();
  const data = await req.json();

  const { username, location, email } = data;

  const updatedUser = await User.findOneAndUpdate(
    { email: session.user.email },
    { username, email, "location.city": location },
    { new: true }
  );

  if (!updatedUser)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ success: true, user: updatedUser });
}
