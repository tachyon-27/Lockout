import { Link, useNavigate } from "react-router-dom";
import { BackgroundLines } from "../components/ui/background-lines";
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema } from "../schemas/signupSchema";
import { useState } from "react";
import axios from "axios"
import { useDispatch } from 'react-redux'
import { sendVerificationEmail } from "../helpers/sendVerificationEmail";
import { verifyOTP } from "../features/authSlice";
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit } = useForm({
        zodResolver: zodResolver(signUpSchema)
    })

    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    }
    
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toggleConfirmPassword = () => {
        setShowConfirmPassword((prev) => !prev);
    }

    const githubOauthURL = `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_GITHUB_REDIRECT_URI}&scope=user`

    const githubLogin = () => {
        window.location.href = githubOauthURL;
    }

    const submit = async (data) => {
        setIsSubmitting(true)
        try {
            if (data.password != data.confirmPassword) {
                console.log("Password does not match")
                return;
            }
            const res = await axios.post("/api/users/register", data)
            if (!res.success) {
                console.log(res.message)
                return
            }

            sendVerificationEmail(data.email, data.name, res.data.verifyCode)
            dispatch(verifyOTP(res.data._id))
            navigate('/verify/email')
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false);
        }
    }

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/auth/google`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token: tokenResponse.access_token }),
                })

                const data = await response.json()

                if (data.success) {
                    console.log('Authentication is Successfull');
                } else {
                    console.error('Login Failed', data.message);
                }

            } catch (error) {
                console.log('Error during login', error);
            }
        },
        onError: () => {
            console.log('Google Login Failed')
        }
    })

    return (
        <BackgroundLines className={"h-[200vh]"} >
            <div
                className="relative flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat"
            >
                <div className="relative z-10 flex items-center justify-center min-h-screen text-white m-[5%]">
                    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4 min-w-[50vh] max-w-md p-6 rounded-2xl bg-gray-900 border border-gray-700">
                        <p className="text-2xl font-semibold tracking-wide flex items-center relative">
                            <span className="absolute w-4 h-4 rounded-full bg-blue-400 left-0 animate-ping"></span>
                            <span className="absolute w-4 h-4 rounded-full bg-blue-500 left-0"></span>
                            <span className="pl-6">Register</span>
                        </p>
                        <p className="text-sm text-gray-400">
                            Signup now and get full access to our app.
                        </p>

                        <div className="relative w-full">
                            <input
                                type="text"
                                id="name"
                                className="w-full bg-gray-700 text-white py-2 px-3 rounded-lg border border-gray-600 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 peer"
                                placeholder=" "
                                required
                                {...register("name")}
                            />
                            <label
                                htmlFor="name"
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm transition-all 
                                peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
                                peer-focus:top-0 peer-focus:opacity-0 peer-focus:text-xs peer-focus:text-blue-400 
                                peer-valid:top-0 peer-valid:opacity-0 peer-valid:text-xs peer-valid:text-blue-400"
                            >
                                Name
                            </label>
                        </div>

                        <div className="relative w-full">
                            <input
                                type="text"
                                id="email"
                                className="w-full bg-gray-700 text-white py-2 px-3 rounded-lg border border-gray-600 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 peer"
                                placeholder=" "  // Empty placeholder to allow label styling
                                required
                                {...register("email")} // Assuming you're using react-hook-form
                            />
                            <label
                                htmlFor="email"
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm transition-all 
                                peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
                                peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-400 peer-focus:opacity-0
                                peer-valid:top-0 peer-valid:text-xs peer-valid:text-blue-400 peer-valid:opacity-0"
                            >
                                Email
                            </label>
                        </div>


                        <div className="relative w-full">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                className="w-full bg-gray-700 text-white py-2 px-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 peer"
                                placeholder=" "
                                required
                                {...register("password")}
                            />
                            <label
                                htmlFor="password"
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm transition-all 
                                peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
                                peer-focus:top-0 peer-focus:opacity-0 peer-focus:text-xs peer-focus:text-blue-400 
                                peer-valid:top-0 peer-valid:opacity-0 peer-valid:text-xs peer-valid:text-blue-400"
                            >
                                Password
                            </label>
                            <button
                                type="button"
                                onClick={togglePassword}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Show different icons based on state */}
                            </button>
                        </div>

                        <div className="relative w-full">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id='cpassword'
                                className="w-full bg-gray-700 text-white py-2 px-3 rounded-lg border border-gray-600 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 peer"
                                placeholder=" "
                                required
                                {...register("confirmPassword")}
                            />
                            <label
                                htmlFor="cpassword"
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm transition-all 
                                peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
                                peer-focus:top-0 peer-focus:opacity-0 peer-focus:text-xs peer-focus:text-blue-400 
                                peer-valid:top-0 peer-valid:opacity-0 peer-valid:text-xs peer-valid:text-blue-400"
                            >
                                Confirm Password
                            </label>
                            <button type="button" onClick={toggleConfirmPassword} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye /> }
                            </button>
                            
                        </div>
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
                                aria-label="Log in with Facebook"
                                className="p-3 bg-transparent rounded-sm ml-2"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 32 32"
                                    className="w-5 h-5 fill-current"
                                >
                                    <path d="M19 6h5V0h-5c-4.91 0-9 4.09-9 9v4H5v6h5v13h6V19h5.066l0.934-6h-6V9c0-0.551 0.449-1 1-1z"></path>
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
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </button>
                        <p className="text-center text-sm text-gray-400">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-blue-400 hover:underline"
                            >
                                Signin
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </BackgroundLines>
    );
};

export default Register;
