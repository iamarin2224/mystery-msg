import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/users.models";

export async function POST(request:Request) {
    await dbConnect()

    try {
        const {username, code} = await request.json()

        const user = await UserModel.findOne({username})

        if (!user){
            return Response.json({
                success: false,
                message: "User with given username not found"
            },{status: 500})
        }

        const isCodeCorrect = user.verifyCode === code
        const isCodeExpired = new Date(user.verifyCodeExpiry) < new Date()

        if (!isCodeCorrect){
            return Response.json({
                success: false,
                message: "Verification code is incorrect"
            }, { status: 500 } )
        }
        else if (isCodeExpired){
            return Response.json({
                success: false,
                message: "Verification code expired, please try again"
            },{ status: 500 } )
        }
        
        if (user.verifyCodeReset){
            user.allowPassReset = true
        }
        else{
            user.isVerified = true
        }

        user.verifyCodeReset = false;

        await user.save()

        return Response.json({
            success: true,
            message: "Code verified successfully"
        },{status: 200})

    } catch (error) {
        console.error("Error checking username: ", error)
        return Response.json({
            success: false,
            message: "Error checking username"
        },{status: 500})
    }
}