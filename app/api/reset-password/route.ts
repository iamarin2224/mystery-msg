import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/users.models";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, newPassword } = await request.json();

    const user = await UserModel.findOne({ username });

    if (!user || !user.allowPassReset) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized request",
        },
        { status: 403 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.allowPassReset = false; 

    await user.save();

    return Response.json(
      {
        success: true,
        message: "Password reset successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to reset password",
      },
      { status: 500 }
    );
  }
}
