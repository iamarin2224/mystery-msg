import { Resend } from 'resend';
import { ApiResponse } from '@/types/ApiResponse';
import VerificationEmail from '@/emails/VerificationEmail';
import ForgotPassVerification from '@/emails/ForgotPassVerification';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
    email: string,
    username: string,
    otp: string,
    forgotPass: boolean = false
): Promise<ApiResponse>{
    try {
        await resend.emails.send({
        from: 'Mystery Message <no-reply@mysterymsg.online>',
        to: email,
        subject: 'Mystery Message Verfication Code',
        react: forgotPass? ForgotPassVerification({username, otp}) : VerificationEmail({username, otp}),
        });
        return {success: true, message: "Verification email send succesfully."}
    } catch (error) {
        console.error("Error sending verification email: ", error);
        return {success: false, message: "Failed to send verification email."}
    }
}