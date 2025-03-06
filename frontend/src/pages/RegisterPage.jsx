import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema } from "../schemas/signupSchema";
import { useState } from "react";
import axios from "axios"
import { useForm } from 'react-hook-form';
import { useGoogleLogin } from '@react-oauth/google';
import { FaEye, FaEyeSlash, FaGoogle, FaGithub } from 'react-icons/fa';  // Import icons here
import ReactDOMServer from 'react-dom/server';
import VerificationEmail from "../emails/VerificationEmail";
import { useToast } from "@/hooks/use-toast"
import {
    Form,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useDispatch } from 'react-redux'
import { setRole, loginSuccess } from "../features/userSlice";

const Register = () => {
    const { toast } = useToast()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm({
        resolver: zodResolver(signUpSchema)
    })

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    }

    const toggleConfirmPassword = () => {
        setShowConfirmPassword((prev) => !prev);
    }

    const githubOauthURL = `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_GITHUB_REDIRECT_URI}&scope=user:email`

    const githubLogin = () => {
        window.location.href = githubOauthURL;
    }

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                setIsSubmitting(true);
    
                const { data } = await axios.post(
                    '/api/user/google',
                    { token: tokenResponse.access_token },
                    {withCredentials: true}
                );
    
                if (data.success) {    
                    toast({
                        title: 'Logged in Successfully!',
                    });
    
                    dispatch(loginSuccess({ token: data.data._id, role: "verifiedUser" }));
                    navigate('/tournaments');
                } else {
                    toast({
                        title: 'Login Failed',
                        description: data.message,
                    });
                }
            } catch (error) {
                toast({
                    title: 'Error during login',
                    description: error.response?.data?.message || error.message,
                });
            } finally {
                setIsSubmitting(false);
            }
        },
        onError: () => {
            toast({
                title: 'Google Authorization Failed',
            });
        }
    });
    

    const submit = async (data) => {
        setIsSubmitting(true)
        try {
            const res = await axios.post("/api/user/register", data)
            if (!res.data.success) {
                toast({
                    title: "Sign-up failed",
                    description: res.data.message
                })
                return
            }
            const emailHtml = ReactDOMServer.renderToStaticMarkup(
                <VerificationEmail name={data.name} otp={res.data.data.verifyCode} />
            );

            const emailRes = await axios.post('/api/user/send-email', { email: data.email, content: emailHtml })

            if (!emailRes.data.success) {
                toast({
                    title: "Invalid email.",
                    description: emailRes.data.message
                })
            }
            else {
                toast({
                    title: "Success",
                    description: res.data.message
                })
                dispatch(setRole({ token: res.data.data._id, role: "unverifiiedUser" }))
                navigate('/verify/email')
            }
        } catch (error) {
            console.log(error)
            toast({
                title: "Sign-up failed",
                description: error.response.data.message
            })
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="w-4/5 max-w-md flex flex-col justify-center bg-gray-900/90 p-4 rounded-xl shadow-lg border border-gray-700 backdrop-blur-md mt-16 lg:mt-0">
            <h2 className="text-3xl font-semibold text-white text-center mb-4 lg:pt-2">Create an Account</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(submit)} className="space-y-4">

                    <FormField
                        name="name"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="text-gray-300"> Name </FormLabel>
                                <Input
                                    {...field}
                                    className="w-full bg-gray-800 text-white py-2 px-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-400 peer"
                                    placeholder="Enter your name"
                                    required
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="email"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="text-gray-300"> Email </FormLabel>
                                <Input
                                    {...field}
                                    type="email"
                                    className="w-full bg-gray-800 text-white py-2 px-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-400 peer"
                                    placeholder="Enter your email"
                                    required
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="password"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="text-gray-300"> Password </FormLabel>
                                <div className="relative">
                                    <Input
                                        {...field}
                                        type={showPassword ? "text" : "password"}
                                        className="w-full bg-gray-800 text-white py-2 px-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-400 peer"
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePassword}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                <FormDescription className="text-gray-400 text-sm">
                                    Password must be at least 8 characters with uppercase, lowercase, number, and special character.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="confirmPassword"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="text-gray-300"> Confirm Password </FormLabel>
                                <div className="relative">
                                    <Input
                                        {...field}
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="w-full bg-gray-800 text-white py-2 px-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-400 peer"
                                        placeholder="Confirm your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleConfirmPassword}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex items-center py-2">
                        <div className="flex-1 h-px bg-gray-700"></div>
                        <p className="px-3 text-gray-400 text-sm">Or sign up with</p>
                        <div className="flex-1 h-px bg-gray-700"></div>
                    </div>

                    <div className="flex justify-center space-x-4">
                        <button type="button" onClick={googleLogin} className="p-3 bg-transparent rounded-md border border-gray-600 hover:border-white">
                            <FaGoogle className="text-white text-lg" />
                        </button>
                        <button type="button" onClick={githubLogin} className="p-3 bg-transparent rounded-md border border-gray-600 hover:border-white">
                            <FaGithub className="text-white text-lg" />
                        </button>
                    </div>

                    <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg transition">
                        {isSubmitting ? "Signing up..." : "Sign Up"}
                    </button>

                </form>
            </Form>

            <div className="text-center mt-4">
                <p className="text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link to="/login" className="text-purple-400 hover:text-purple-500">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
