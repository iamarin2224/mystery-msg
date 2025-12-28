import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/users.models";
import { User } from "next-auth";   //for the type safety of user
import { useSession } from "next-auth/react";

export async function POST(req: Request) {
    await dbConnect()

    // to get the session from backend, it also requires the auth options
    const session = await getServerSession(authOptions)
    const user:User = session?.user //optional select as session may not be present

    if (!session || !user){
        return Response.json({
            success: false,
            message: "User not authorized"
        },{status: 401})
    }

    const userId = user._id

    const {acceptingMessages} = await req.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMsg: acceptingMessages},
            {new: true}
        )

        if (!updatedUser){
            return Response.json({
                success: false,
                message: "User not found"
            },{status: 404})
        }

        //updating the jwt session
        const { update } = useSession();

        await fetch("/api/accept-messages", {
        method: "POST",
        body: JSON.stringify({ acceptingMessages }),
        });

        await update();

        return Response.json({
            success: true,
            message: "Message acceptance status updated successfully",
            updatedUser
        },{status: 200})

    } catch (error) {
        console.error("Failed to update user status to accept messages", error);
        return Response.json({
            success: false,
            message: "Failed to update user status to accept messages"
        },{status: 500})
    }
}

export async function GET(req: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user:User = session?.user

    if (!session || !user){
        return Response.json({
            success: false,
            message: "User not authorized"
        },{status: 401})
    }

    const userId = user._id

    try {
        const foundUser = await UserModel.findById(userId)

        if(!foundUser){
            return Response.json({
                success: false,
                message: "User not found"
            },{status: 404})
        }

        return Response.json({
            success: true,
            isAcceptingMsg: foundUser.isAcceptingMsg,
            message: "User message acceptance status found"
        },{status: 200})

    } catch (error) {
        console.error("Failed to get user status of accepting messages", error);
        return Response.json({
            success: false,
            message: "Failed to get user status of accepting messages"
        },{status: 500})
    }
}