import { useGoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from "react";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useToast } from "@/hooks/use-toast";
import { loginSuccess } from "@/features/userSlice";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema } from '../schemas/loginSchema';

const Login = () => {
    const { toast } = useToast();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/user/google`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token: tokenResponse.access_token }),
                    credentials: "include"
                });

                const data = await response.json();

                if (data.success) {
                    toast({
                        title: 'Logged in Successfully!'
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
                    description: error,
                });
            }
        },
        onError: () => {
            toast({
                title: 'Google Authorization Failed',
            });
        }
    });

    const submit = async (data) => {
        setIsSubmitting(true);
        try {
            const res = await axios.post('/api/user/login', data);

            toast({
                title: res.data.message
            });

            if (res.data.success) {
                dispatch(loginSuccess({ token: res.data.data._id, role: "verifiedUser" }));
                navigate('/tournaments');
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error.response.data.message || error.message
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative z-10 flex items-center justify-center text-white">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(submit)} className="flex flex-col gap-4 min-w-[50vh] max-w-md p-8 rounded-2xl bg-gray-900 border border-gray-700">
                    <p className="text-2xl font-semibold tracking-wide flex items-center relative text-center">
                        <span className="absolute w-4 h-4 rounded-full bg-blue-400 left-0 animate-ping"></span>
                        <span className="absolute w-4 h-4 rounded-full bg-blue-500 left-0"></span>
                        <span className="pl-6">Login</span>
                    </p>
                    <p className="text-sm text-gray-400 text-center">
                        Welcome back! Login to access your account.
                    </p>

                    <FormField 
                        name="email"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="relative w-full">
                                <FormLabel>Email</FormLabel>
                                <Input
                                    {...field}
                                    className="w-full bg-gray-700 text-white py-2 px-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 peer"
                                    placeholder="Email"
                                    type="email"
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
                            <FormItem className="relative w-full">
                                <FormLabel>Password</FormLabel>
                                <div className="relative">
                                    <Input
                                        {...field}
                                        type={showPassword ? 'text' : 'password'}
                                        className="w-full bg-gray-700 text-white py-2 px-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 peer"
                                        placeholder="Password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePassword}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />} 
                                    </button>
                                </div>
                                <Link to='/forgot-password' className='hover:underline text-sm text-gray-400'>Forgot password?</Link>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex items-center pt-4">
                        <div className="flex-1 h-px bg-gray-700"></div>
                        <p className="px-3 text-sm text-gray-400">
                            Login with social accounts
                        </p>
                        <div className="flex-1 h-px bg-gray-700"></div>
                    </div>

                    <div className="flex justify-center mt-2 space-x-2">
                        {/* Google Button */}
                        <button
                            aria-label="Log in with Google"
                            className="p-3 bg-transparent rounded-sm"
                            onClick={googleLogin}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current">
                                <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
                            </svg>
                        </button>

                        {/* GitHub Button */}
                        <button
                            aria-label="Log in with GitHub"
                            className="p-3 bg-transparent rounded-sm"
                            onClick={() => window.location.href = githubOauthURL}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current">
                                <path d="M16 0.396c-8.839 0-16 7.167-16 16 0 7.073 4.584 13.068 10.937 15.183 0.803 0.151 1.093-0.344 1.093-0.772 0-0.38-0.009-1.385-0.015-2.719-4.453 0.964-5.391-2.151-5.391-2.151-0.729-1.844-1.781-2.339-1.781-2.339-1.448-0.989 0.115-0.968 0.115-0.968 1.604 0.109 2.448 1.645 2.448 1.645 1.427 2.448 3.744 1.74 4.661 1.328 0.14-1.031 0.557-1.74 1.011-2.135-3.552-0.401-7.287-1.776-7.287-7.907 0-1.751 0.62-3.177 1.645-4.297-0.177-0.401-0.719-2.031 0.141-4.235 0 0 1.339-0.427 4.4 1.641 1.281-0.355 2.641-0.532 4-0.541 1.36 0.009 2.719 0.187 4 0.541 3.043-2.068 4.381-1.641 4.381-1.641 0.859 2.204 0.317 3.833 0.161 4.235 1.015 1.12 1.635 2.547 1.635 4.297 0 6.145-3.74 7.5-7.296 7.891 0.556 0.479 1.077 1.464 1.077 2.959 0 2.14-0.020 3.864-0.020 4.385 0 0.416 0.28 0.916 1.104 0.755 6.4-2.093 10.979-8.093 10.979-15.156 0-8.833-7.161-16-16-16z"></path>
                            </svg>
                        </button>
                    </div>

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
                            'Sign Up'
                        )}
                    </button>

                    <p className="text-center text-sm text-gray-400">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-blue-400 hover:underline">
                            Register
                        </Link>
                    </p>
                </form>
            </Form>
        </div>
    );
};

export default Login;
