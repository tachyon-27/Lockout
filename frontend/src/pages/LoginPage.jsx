import { useGoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from "react-router-dom";
import { BackgroundLines } from "../components/ui/background-lines";
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from "react";
import axios from "axios"
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useToast } from "@/hooks/use-toast"
import { loginSuccess } from "@/features/userSlice";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { loginSchema } from '../schemas/loginSchema';

const Login = () => {
    const { toast } = useToast()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    }

    const githubOauthURL = `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_GITHUB_REDIRECT_URI}&scope=user%20user:email`

    const githubLogin = () => {
        window.location.href = githubOauthURL;
    }

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
                })

                const data = await response.json()

                if (data.success) {
                    toast({
                        title: 'Logged in Successfully!'
                    })
                    dispatch(loginSuccess({ token: data.data._id, role: "verifiedUser" }));
                    navigate('/')
                } else {
                    toast({
                        title: 'Login Failed',
                        description: data.message,
                    })
                }

            } catch (error) {
                toast({
                    title: 'Error during login',
                    description: error,
                })
            }
        },
        onError: () => {
            toast({
                title: 'Google Authorization Failed',
            })
        }
    })

    const submit = async (data) => {
        setIsSubmitting(true)
        console.log(data)
        try {
            const res = await axios.post('/api/user/login', data)

            toast({
                title: res.data.message
            })

            if(res.data.success) {
                dispatch(loginSuccess({ token: res.data.data._id, role: "verifiedUser" }));
                navigate('/dashboard')
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
        < BackgroundLines className="relative flex justify-center items-center min-h-[120vh]">
            <div className="relative z-10 flex items-center justify-center min-h-screen text-white">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submit)} className="flex flex-col gap-4 min-w-[50vh] max-w-md p-6 rounded-2xl bg-gray-900 border border-gray-700">
                        <p className="text-2xl font-semibold tracking-wide flex items-center relative">
                            <span className="absolute w-4 h-4 rounded-full bg-blue-400 left-0 animate-ping"></span>
                            <span className="absolute w-4 h-4 rounded-full bg-blue-500 left-0"></span>
                            <span className="pl-6">Login</span>
                        </p>
                        <p className="text-sm text-gray-400">
                        Welcome back! Login to access your account.
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

                        <FormField 
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="relative w-full">
                                    <FormLabel> Password </FormLabel>
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
                        <div className="flex justify-center mt-2">
                            <button
                                aria-label="Log in with Google"
                                className="p-3 bg-transparent rounded-sm"
                                onClick={googleLogin}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 32 32"
                                    className="w-5 h-5 fill-current"
                                >
                                    <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
                                </svg>
                            </button>
                            
                            <button
                                aria-label="Log in with Apple"
                                className="p-3 bg-transparent rounded-sm ml-2"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 1024 1024"
                                    className="w-5 h-5"
                                >
                                    <path
                                        d="M824.66636 779.30363c-15.12299 34.93724-33.02368 67.09674-53.7638 96.66374-28.27076 40.3074-51.4182 68.2078-69.25717 83.7012-27.65347 25.4313-57.2822 38.4556-89.00964 39.1963-22.77708 0-50.24539-6.4813-82.21973-19.629-32.07926-13.0861-61.55985-19.5673-88.51583-19.5673-28.27075 0-58.59083 6.4812-91.02193 19.5673-32.48053 13.1477-58.64639 19.9994-78.65196 20.6784-30.42501 1.29623-60.75123-12.0985-91.02193-40.2457-19.32039-16.8514-43.48632-45.7394-72.43607-86.6641-31.060778-43.7024-56.597041-94.37983-76.602609-152.15586C10.740416 658.44309 0 598.01283 0 539.50845c0-67.01648 14.481044-124.8172 43.486336-173.25401C66.28194 327.34823 96.60818 296.6578 134.5638 274.1276c37.95566-22.53016 78.96676-34.01129 123.1321-34.74585 24.16591 0 55.85633 7.47508 95.23784 22.166 39.27042 14.74029 64.48571 22.21538 75.54091 22.21538 8.26518 0 36.27668-8.7405 83.7629-26.16587 44.90607-16.16001 82.80614-22.85118 113.85458-20.21546 84.13326 6.78992 147.34122 39.95559 189.37699 99.70686-75.24463 45.59122-112.46573 109.4473-111.72502 191.36456.67899 63.8067 23.82643 116.90384 69.31888 159.06309 20.61664 19.56727 43.64066 34.69027 69.2571 45.4307-5.55531 16.11062-11.41933 31.54225-17.65372 46.35662zM631.70926 20.0057c0 50.01141-18.27108 96.70693-54.6897 139.92782-43.94932 51.38118-97.10817 81.07162-154.75459 76.38659-.73454-5.99983-1.16045-12.31444-1.16045-18.95003 0-48.01091 20.9006-99.39207 58.01678-141.40314 18.53027-21.27094 42.09746-38.95744 70.67685-53.0663C578.3158 9.00229 605.2903 1.31621 630.65988 0c.74076 6.68575 1.04938 13.37191 1.04938 20.00505z"
                                        fill="#ffffff"
                                    ></path>
                                </svg>
                            </button>

                            <button
                                aria-label="Log in with GitHub"
                                className="p-3 bg-transparent rounded-sm ml-2"
                                onClick={githubLogin}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 32 32"
                                    className="w-5 h-5 fill-current"
                                >
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
        </BackgroundLines>
    );
};

export default Login;
