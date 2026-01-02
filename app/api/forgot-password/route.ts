import dbConnect from "@/lib/dbConnect"; 
import UserModel from "@/models/users.models";
import { forgotPassSchema } from "@/schemas/forgotPassSchema";

import { sendVerificationEmail } from "@/lib/resend";

export async function POST(request:Request) {
    await dbConnect()

    try {
        //take the required fields from the request
        const body = await request.json()

        const result = forgotPassSchema.safeParse(body)

        if (!result.success) {
        return Response.json(
            {
            success: false,
            message: result.error.issues[0].message,
            },
            { status: 400 }
        )
        }

        const { identifier } = result.data

        const existingVerifiedUser = 
            await UserModel.findOne({
                $or: [
                    { email: identifier },
                    { username: identifier },
                ],
                isVerified: true
            });

        if (!existingVerifiedUser){
            return Response.json({
                success: false,
                message: "User not found"
            },{status: 404})
        }

        let verifyCode = Math.floor(100000 + Math.random()*900000).toString()
        const email = existingVerifiedUser.email
        const username = existingVerifiedUser.username
                
        const expiryDate = new Date()
        expiryDate.setMinutes(expiryDate.getMinutes() + 10)

        existingVerifiedUser.verifyCode = verifyCode
        existingVerifiedUser.verifyCodeExpiry = expiryDate
        existingVerifiedUser.verifyCodeReset = true

        await existingVerifiedUser.save()
            
        //Sending the email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode, true)
        if (!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message
            },{status: 500})
        }
        
        return Response.json({
            success: true,
            message: emailResponse.message
        },{status: 201})

    } catch (error) {
        console.error("Error while reseting password user: ", error)
        return Response.json({
            success: false,
            message: "Failed to reset password"
        }, { status: 500 } )
    }
}