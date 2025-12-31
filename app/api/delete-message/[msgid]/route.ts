import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/users.models";
import { User } from "next-auth";  

export async function DELETE(req: Request, {params} : {params : Promise<{msgid: string}>}) {
    const { msgid } = await params

    await dbConnect() 

    const session = await getServerSession(authOptions)
    const user:User = session?.user 

    if (!session || !user){
        return Response.json({
            success: false,
            message: "User not authorized"
        },{status: 401})
    }

    try {
        const updatedResult = await UserModel.updateOne(
            {_id: user._id},
            {$pull: {messages: {_id: msgid}}} //pull method used to pull out one item of an array
        )

        if (updatedResult.modifiedCount === 0){
            return Response.json({
                success: false,
                message: "Message not found"
            },{status: 404})
        }

        return Response.json({
            success: true,
            message: "Message deleted successfully"
        },{status: 200})

    } catch (error) {
        console.error("Failed to delete message", error);
        return Response.json({
            success: false,
            message: "Failed to delete message"
        },{status: 500})
    }
}