import { Resend } from 'resend';
import { ApiResponse } from '@/types/ApiResponse';
import VerificationEmail from '@/emails/VerificationEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
    email: string,
    username: string,
    otp: string
): Promise<ApiResponse>{
    try {
        await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Mystery Message Verfication Code',
        react: VerificationEmail({username, otp}),
        });
        return {success: true, message: "Verification email send succesfully."}
    } catch (error) {
        console.error("Error sending verification email: ", error);
        return {success: false, message: "Failed to send verification email."}
    }
}