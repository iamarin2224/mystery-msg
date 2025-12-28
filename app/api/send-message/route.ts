import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/models/users.models";
import { messageSchema } from "@/schemas/messageSchema";

export async function POST(req: Request) {
    await dbConnect()

    const body = await req.json()

    const result = messageSchema.safeParse(body);
    if (!result.success) {
        return Response.json(
            {
            success: false,
            message: result.error.issues[0].message,
            },
            { status: 400 }
        );
    }

    const { username } = body;
    const { content } = result.data;

    try {
        const user = await UserModel.findOne({username})

        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            },{status: 404})
        }

        //check user accepting messages
        if (!user.isAcceptingMsg){
            return Response.json({
                success: false,
                message: "User not accepting messages"
            },{status: 403})
        }

        const newMsg = {
            content,
            createdAt: new Date()
        }

        user.messages.push(newMsg as Message) //to resolve ts error, ascertain that it is message
        await user.save()

        return Response.json({
            success: true,
            message: "Message sent successfully"
        },{status: 200})

    } catch (error) {
        console.error("Failed to send message", error);
        return Response.json({
            success: false,
            message: "Failed to send message"
        },{status: 500})
    }
}