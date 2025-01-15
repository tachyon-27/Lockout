import { BackgroundLines } from '@/components/ui/background-lines';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from 'react-router-dom';
import ReactDOMServer from 'react-dom/server';
import VerificationEmail from "@/emails/VerificationEmail";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpSchema } from '../../schemas/otpSchema';
import { Loader2 } from 'lucide-react';
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useState } from 'react';

function Verify() {
  const { what } = useParams()
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(otpSchema)
  });

  const verify = async (data) => {
    setIsSubmitting(true);
    try {
      if (what == "email") {
        const res = await axios.post('/api/auth/verify-email', {
          otp: data.otp,
        });

        toast({
          title: res.data.success ? "SUCCESS" : "FAILURE",
          description: res.data.message,
        });

        if (res.data.success) {
          navigate('/login');
        }
      } 
      else if(what == "password") {
        const res = await axios.post('/api/user/password-otp', {
          otp: data.otp,
        });

        toast({
          title: res.data.success ? "SUCCESS" : "FAILURE",
          description: res.data.message,
        });

        if (res.data.success) {
          navigate('/reset-password');
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resend = async () => {
    try {
      const res = await axios.post('/api/auth/reset-otp');

      const emailHtml = ReactDOMServer.renderToStaticMarkup(
        <VerificationEmail name={res.data.data.name} otp={res.data.data.verifyCode} />
      );

      const emailRes = await axios.post('/api/user/send-email', { email: res.data.data.email, content: emailHtml });

      toast({
        title: emailRes.data.success ? "SUCCESS" : "FAILURE",
        description: emailRes.data.message,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred",
      });
    }
  };

  return (
    <BackgroundLines className="relative flex justify-center items-center">
      <div className="relative z-10 flex items-center justify-center min-h-screen text-white">
        <Form {...form}>
          <form 
            className="flex flex-col gap-4 max-w-md p-6 rounded-2xl bg-gray-900 border border-gray-700 w-full sm:w-auto"
            onSubmit={form.handleSubmit(verify)}
          >
            <p className="text-2xl font-semibold tracking-wide flex items-center relative">
              <span className="absolute w-4 h-4 rounded-full bg-blue-400 left-0 animate-ping"></span>
              <span className="absolute w-4 h-4 rounded-full bg-blue-500 left-0"></span>
              <span className="pl-6">Enter OTP</span>
            </p>
            <p className="text-sm text-gray-400">
              Check your email, we just sent the OTP to your email.
            </p>

            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <div className='min-w-full flex justify-center items-center'>
                  <FormItem>
                    <FormLabel>One-Time Password</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 px-4 mt-4 bg-blue-500 rounded-lg text-white font-medium hover:bg-blue-400 transition"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </div>
              ) : (
                'Verify'
              )}
            </button>

            <p className="text-center text-sm text-gray-400">
              Didn't receive the OTP?{" "}
              <button 
                type="button" 
                onClick={resend} 
                className="text-blue-400 hover:underline"
              >
                Resend OTP
              </button>
            </p>
          </form>
        </Form>
      </div>
    </BackgroundLines>
  );
}

export default Verify;
