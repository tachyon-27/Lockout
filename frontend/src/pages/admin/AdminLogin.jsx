import  { useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import { cn } from "@/lib/utils";
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/schemas/loginSchema.js";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";

export default function AdminLogin() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })


  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  }


  const submit = async (data) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/admin/login', data)

      toast({
        title: response.data.message,
      })
      setIsLoading(false);
      
      if(response.data.success) {
        navigate('/admin/dashboard')
      }
      
    } catch (error) {
      setIsLoading(false);
      console.log(error)
      toast({
        title: "Error",
        description: error.response.data.message || error.message
      })
    } 
  }

  return (
    <div className="max-w-md w-full m-4 mx-auto text-white rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-gray-900">
      <p className="text-2xl font-semibold tracking-wide flex items-center relative">
        <span className="absolute w-4 h-4 rounded-full bg-blue-400 left-0 animate-ping"></span>
        <span className="absolute w-4 h-4 rounded-full bg-blue-500 left-0"></span>
        <span className="pl-6 text-white">Admin Login</span>
      </p>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-gray-400">
        Welcome back! Login to access your account.
      </p>
      <Form {...form}>

        <form className="my-8" onSubmit={form.handleSubmit(submit)}>
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel >Email Address</FormLabel>
                <Input
                  {...field}
                  name="name"
                  className="w-full bg-gray-700 text-white py-2 px-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 peer"
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
              <FormItem className="mb-4">
                <FormLabel> Password </FormLabel>
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full bg-gray-700 text-white py-2 px-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 peer"
                    placeholder="••••••••"
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
          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block bg-blue-500 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
                  <BeatLoader size={10} color="#3b82f6" />
                ) : (
                  <>Login &rarr;</>
                )}
            
            <BottomGradient />
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

          {/* <div className="flex flex-col space-y-4">
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              GitHub
            </span>
            <BottomGradient />
          </button>
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Google
            </span>
            <BottomGradient />
          </button>
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            <IconBrandApple className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              OnlyFans
            </span>
            <BottomGradient />
          </button>
        </div> */}
        </form>
      </Form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
