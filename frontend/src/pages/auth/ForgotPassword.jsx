import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from "react";
import axios from "axios"
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import ReactDOMServer from 'react-dom/server';
import VerificationEmail from "@/emails/VerificationEmail";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { emailSchema } from '../../schemas/emailSchema';
import { useDispatch } from 'react-redux'
import { setRole } from "@/features/userSlice";

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const { toast } = useToast()
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: "",
        }
    })

    const submit = async (data) => {
        setIsSubmitting(true)
        console.log(data)
        try {
            let res = await axios.post('/api/user/get-user', data)

            if(!res.data.success) {
              toast({
                title: "User not found."
              })
              return;
            }

            res = await axios.post('/api/user/reset-otp', {
                _id: res.data.data._id
            })

            const emailHtml = ReactDOMServer.renderToStaticMarkup(
              <VerificationEmail name={data.name} otp={res.data.data.verifyCode} />
            );

            const emailRes = await axios.post('/api/user/send-email', {email: data.email, content: emailHtml})

            toast({
              title: emailRes.data.message
            })


            if(emailRes.data.success) {
                dispatch(setRole({token: res.data.data._id, role: "unverifiedUser"}))
                navigate('/verify/password')
            }
        } catch(error) {
            console.log(error)
            toast({
                title: "Error",
                description: error.response.data.message || error.message
            })
        } finally {
            setIsSubmitting(false)
        }

    }

    return (
        <div className="relative z-10 flex items-center justify-center text-white">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(submit)} className="flex flex-col gap-4 min-w-[50vh] max-w-md p-6 rounded-2xl bg-gray-900 border border-gray-700">
                    <p className="text-2xl self-center font-semibold tracking-wide flex items-center relative">
                        
                        <span className="pl-6"> Enter your email </span>
                    </p>

                    <FormField 
                        name="email"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="relative w-full">
                                <FormLabel> Email </FormLabel>
                                <Input
                                    {...field}
                                    name="name"
                                    className="w-full bg-gray-700 text-white py-2 px-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 peer"
                                    placeholder="Email"
                                    type="email"
                                    required
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="py-2 px-4 mt-4 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-medium transition"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </div>
                        ) : (
                            'Continue'
                        )}
                    </button>
                    
                    <p className="text-center text-sm text-gray-400">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-purple-400 hover:text-purple-500 hover:underline">
                            Register
                        </Link>
                    </p>
                </form>     
            </Form>
        </div>
    );
};

export default ForgotPassword;
