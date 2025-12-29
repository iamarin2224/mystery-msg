import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/users.models";
import { z } from "zod"
import { usernameValidation } from "@/schemas/signUpSchema";

//we devise a method which takes username as paramter which must satisfy the username validation
const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request:Request) {
    await dbConnect()

    try {
        //extract the username from the request url
        const {searchParams} = new URL(request.url)
        const queryParam = searchParams.get('username')

        //check using zod
        const result = UsernameQuerySchema.safeParse({ username: queryParam })

        if (!result.success) {
            return Response.json({
                success: false,
                message: result.error.issues[0].message,
                },{ status: 400 }
            )
        }

        const {username} = result.data

        const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})

        if (existingVerifiedUser){
            return Response.json({
                success: false,
                message: "User with given username exists"
            },{status: 500})
        }

        return Response.json({
            success: true,
            message: "Username is unique",
            },{ status: 200 }
        ) 

    } catch (error) {
        console.error("Error checking username: ", error)
        return Response.json({
            success: false,
            message: "Error checking username"
        },{status: 500})
    }
}