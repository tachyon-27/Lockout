import { Resend } from 'resend';

export async function sendVerificationEmail(email, name,verifyCode) {
    try {
        const resend = new Resend(process.env.VITE_RESEND_API_KEY)
        
        const {data, error} = await resend.emails.send({
          from: 'Test <onboarding@resend.dev>',
          to: [email],
          subject: 'Verification code',
          react: verifyCode({name, otp: verifyCode})
        });

        if(error) {
            return new {
                success: false,
                message: error.message
            }
        }

        return new {
            success: true,
            message: "Verification email sent successfully to " + email
        }
    } catch(emailError) {
        console.log("Error while sending verification email ", emailError)
        return new {
            success: false,
            message: "Failed to send verification email."
        } 
    }
}