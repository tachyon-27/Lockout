import { Resend } from 'resend';
import VerificationEmail from '../emails/VerificationEmail';

const resend = await  new Resend(import.meta.env.VITE_RESEND_API_KEY)

export async function sendVerificationEmail(email, name,verifyCode) {
    try {
        const {data, error} = await resend.emails.send({
          from: 'Test <onboarding@resend.dev>',
          to: email,
          subject: 'Verification code',
          react: VerificationEmail({name, otp: verifyCode})
        });

        if(error) {
            return {
                success: false,
                message: error.message
            }
        }

        return {
            success: true,
            message: "Verification email sent successfully to " + email
        }
    } catch(emailError) {
        console.log("Error while sending verification email ", emailError)
        return {
            success: false,
            message: "Failed to send verification email."
        } 
    }
}