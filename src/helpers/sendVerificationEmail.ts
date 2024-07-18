import {resend} from "@/lib/resend"
import VerificationEmail from "../../emails/VerificationEmaiil";
import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerificarionEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification Code',
            react: VerificationEmail({username, otp: verifyCode}),
          });

        return {
            success: true,
            message: "Verification Email sent successfully"
        }
    } catch (emailError) {
        console.error("Error Sending Verification Email", emailError);
        return {
            success: false,
            message: "Failed to send Verification Email"
        }
    }
}