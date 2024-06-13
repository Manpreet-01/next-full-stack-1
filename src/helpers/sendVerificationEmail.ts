import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,
): Promise<ApiResponse> {
    try {

        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Ama-app Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });

        console.log("sendVerificationEmail results data :: ", data);
        console.log("sendVerificationEmail results error :: ", error);

        if (error) return { success: false, message: error.message };

        return { success: true, message: "Verification message send successfully." };
    } catch (error) {
        console.error("error sending verification emal :: ", error);
        return { success: false, message: "Failed to send verification email." };
    }
}