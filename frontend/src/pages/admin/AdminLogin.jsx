import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/schemas/loginSchema.js";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "@/features/userSlice";

export default function AdminLogin() {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const role = useSelector((state) => state.user.userRole);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (role === "admin") {
      navigate("/admin/dashboard");
    }
  }, [role, navigate]);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const submit = async (data) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/admin/login", data);

      toast({
        title: response.data.message,
      });
      setIsLoading(false);

      if (response.data.success) {
        dispatch(
          loginSuccess({ token: response.data.data._id, role: "admin" })
        );
        navigate("/admin/dashboard");
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast({
        title: "Error",
        description: error.response.data.message || error.message,
      });
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white px-6">
      
      {/* Left Section - Huge Question Mark */}
      <div className="hidden md:flex flex-col items-center justify-center text-center w-1/2 pr-12">
        <div className="text-[16rem] font-bold text-purple-500 leading-none">?</div>
        <p className="text-3xl font-semibold">Are you really an admin?</p>
      </div>

      {/* Right Section - Admin Login Form */}
      <div className="w-full md:w-[400px] bg-black shadow-lg rounded-lg p-8">
        <p className="text-3xl font-semibold text-center mb-6">Admin Login</p>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <Input
                    {...field}
                    className="w-full bg-gray-800 text-white py-2 px-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="example@me.com"
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
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      className="w-full bg-gray-800 text-white py-2 px-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePassword}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button
              className="bg-gradient-to-br from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 w-full text-white rounded-md h-10 font-medium shadow-md transition-all duration-300"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <BeatLoader size={10} color="#ffffff" /> : "Login →"}
            </button>
          </form>
        </Form>
      </div>
    </div>
  );
}