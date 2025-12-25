import dbConnect from "@/lib/dbConnect"; 
import UserModel from "@/models/users.models";
import bcrypt from "bcrypt";
import { signUpSchema } from "@/schemas/signUpSchema";

import { sendVerificationEmail } from "@/lib/resend";

//Have to mention the function name as GET, POST, PATCH,... just as the requests are served
export async function POST(request:Request) {
    await dbConnect() //in next js we have to connect to db before every request

    try {
        //take the required fields from the request
        const body = await request.json()

        const result = signUpSchema.safeParse(body)

        if (!result.success) {
        return Response.json(
            {
            success: false,
            message: result.error.issues[0].message,
            },
            { status: 400 }
        )
        }

        const { username, email, password } = result.data

        const existingVerifiedUserByUsername = await UserModel.findOne({username, isVerified: true})

        if (existingVerifiedUserByUsername){
            return Response.json({
                success: false,
                message: "User with given username exists"
            },{status: 500})
        }

        const existingUserByEmail = await UserModel.findOne({email})
        let verifyCode = Math.floor(100000 + Math.random()*900000).toString()

        if (existingUserByEmail){
            if (existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "User with given email exists"
                },{status: 500})
            }
            else{ //case when user is updating password
                const hashedPassword = await bcrypt.hash(password, 10) 
                const expiryDate = new Date()
                expiryDate.setMinutes(expiryDate.getMinutes() + 10)

                existingUserByEmail.username = username
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = expiryDate

                await existingUserByEmail.save()
            }
        }

        else{ //registering a new user
            const hashedPassword = await bcrypt.hash(password, 10) 
            const expiryDate = new Date()
            expiryDate.setMinutes(expiryDate.getMinutes() + 10)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMsg: true,
                messages: []
            })

            await newUser.save()
        }

        //Sending the email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode)
        if (!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message
            },{status: 500})
        }

        return Response.json({
            success: true,
            message: "User registered successfully. Check your email to verify your account"
        },{status: 201})

    } catch (error) {
        console.error("Error while registering user: ", error)
        return Response.json({
            success: false,
            message: "Failed to resgiter user"
        },
        {
            status: 500
        }
        )
    }
}