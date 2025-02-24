import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordSchema } from '@/schemas/passwordSchema';

const ChangePassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const form = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            password: "",
            confirmPassword: "",
        }
    })

    const submit = (data) => {
        setIsSubmitting(true);
        setTimeout(() => {
          console.log(data);
          setIsSubmitting(false);
        }, 1000);
      };
    return (
        <div className='flex flex-col p-4 w-[60%]'>
            <h2 className='text-xl mb-4 self-center'>Change Password</h2>
            <Form {...form}>
                <form
                    className='flex flex-col gap-4'
                    onSubmit={form.handleSubmit(submit)}
                >
                    <FormField
                        name="currentPassword"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='relative'> Current Password:</FormLabel>
                                <Input
                                    {...field}
                                    type='password'
                                    className='w-full p-2 rounded bg-gray-700 text-white pr-10'
                                    required
                                />
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="password"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='relative'>New Password:</FormLabel>
                                <Input
                                    {...field}
                                    type='password'
                                    className='w-full p-2 rounded bg-gray-700 text-white pr-10'
                                    required
                                />
                                <FormMessage className="text-red-500" />

                            </FormItem>
                        )}
                    />
                    <FormField
                        name="confirmPassword"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='relative'>Confirm New Password:</FormLabel>
                                <div className='relative'>
                                    <Input
                                        {...field}
                                        type={showPassword ? 'text' : 'password'}
                                        className='w-full p-2 rounded bg-gray-700 text-white pr-10'
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-200 hover:text-white transition ease-in-out duration-200"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>

                                </div>
                                <FormMessage className="text-red-500" />

                            </FormItem>
                        )}
                    />

                    <button type='submit' disabled={isSubmitting} className='p-2 bg-white rounded text-black hover:bg-gray-200'>
                        {isSubmitting ? (
                            <div className="flex items-center justify-center">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </div>
                        ) : (
                            'Update Password'
                        )}
                    </button>
                </form>
            </Form>
        </div>
    );
};


export default ChangePassword