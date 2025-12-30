import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/users.models";
import { User } from "next-auth";  
import mongoose from "mongoose";

//we will be using mongo db aggregation pipeline in this for optimisation

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

    const userId = new mongoose.Types.ObjectId(user._id) //as for agg pipeline we required userid with proper type and not just a string

    try {
        // our objective with this set of pipelines is to have an array of messages sorted according to latest messages first as an array
        //unwind breaks the array into many documents, group then again groups them into a single array while preserving the sorting order
        const user = await UserModel.aggregate([
            { $match: {_id: userId} },
            { $unwind: '$messages'},
            { $sort: {'messages.createdAt': -1} },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } },
        ]).exec()

        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            },{status: 404})
        }

        if(user.length === 0){
            return Response.json({
                success: true,
                messages: []
            },{status: 200})
        }

        return Response.json({
            success: true,
            messages: user[0].messages
        },{status: 200})

    } catch (error) {
        console.error("Failed to load messages", error);
        return Response.json({
            success: false,
            message: "Failed to load messages"
        },{status: 500})
    }
}