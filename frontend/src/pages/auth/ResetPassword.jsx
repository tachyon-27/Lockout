import { useNavigate } from "react-router-dom";
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from "react";
import axios from "axios";
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { passwordSchema } from "../../schemas/passwordSchema"; 
import { useDispatch, useSelector } from 'react-redux'
import { logout } from "@/features/userSlice";

const ResetPassword = () => {
  const dispatch = useDispatch()
  const id = useSelector((state) => state.user.token);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const submit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/user/reset-password", {
        password: data.password,
        _id: id
      });

      toast({
        title: res.data.message,
      });

      if (res.data.success) {
        dispatch(logout())
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Sign-up failed",
        description: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative z-10 flex items-center justify-center text-white mx-auto my-9">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submit)}
          className="flex flex-col gap-6 min-w-[50vh] max-w-md p-8 rounded-2xl bg-gray-900 border border-gray-700 shadow-lg"
        >
          <p className="text-3xl font-semibold tracking-wide flex items-center relative text-center self-center">
            <span className="pl-8">Reset Your Password</span>
          </p>
          <p className="text-sm text-gray-400 mb-4 text-center">
            Password must be at least 8 characters and contain at least one capital letter, one lowercase letter, one number, and one special character.
          </p>

          {/* Password Field */}
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem className="relative w-full">
                <FormLabel className="text-gray-300"> Password </FormLabel>
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full bg-gray-700 text-white py-3 px-4 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 peer transition ease-in-out duration-200"
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition ease-in-out duration-200"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem className="relative w-full">
                <FormLabel className="text-gray-300"> Confirm Password </FormLabel>
                <div className="relative">
                  <Input
                    {...field}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="w-full bg-gray-700 text-white py-3 px-4 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 peer transition ease-in-out duration-200"
                    placeholder="Confirm Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPassword}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition ease-in-out duration-200"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="py-3 px-6 mt-6 rounded-lg text-white font-medium bg-purple-600 hover:bg-purple-500 transition duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-purple-400"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </div>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </Form>
    </div>
  );
};

export default ResetPassword;
