import { useState } from 'react'
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
import { setPasswordSchema } from '../../schemas/setPasswordSchema';
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

const ChangePassword = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast()
    const [showPassword, setShowPassword] = useState({
        currentPassword: false,
        password: false,
        confirmPassword: false
    });

    const togglePasswordVisibility = (field) => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const form = useForm({
        resolver: zodResolver(setPasswordSchema),
        defaultValues: {
            currentPassword: "",
            password: "",
            confirmPassword: "",
        }
    });

    const submit = async (data) => {
        setIsSubmitting(true)
        try {
            console.log(data)
            const res = await axios.post('/api/user/set-password', data)
            
            toast({
                title: res.data.message
            })
        } catch(error) {
            console.log(error);
            
            toast({
                title: error.message
            })
        }
        finally {
            setIsSubmitting(false)
        }
    };

    return (
        <div className='flex flex-col p-4 w-[60%]'>
            <h2 className='text-xl mb-4 self-center'>Change Password</h2>
            <Form {...form}>
                <form
                    className='flex flex-col gap-4'
                    onSubmit={form.handleSubmit(submit)}
                >
                    {['currentPassword', 'password', 'confirmPassword'].map((field) => (
                        <FormField
                            key={field}
                            name={field}
                            control={form.control}
                            render={({ field: inputField }) => (
                                <FormItem>
                                    <FormLabel>
                                        {field === "currentPassword" && "Current Password:"}
                                        {field === "password" && "New Password:"}
                                        {field === "confirmPassword" && "Confirm New Password:"}
                                    </FormLabel>
                                    <div className='relative'>
                                        <Input
                                            {...inputField}
                                            type={showPassword[field] ? 'text' : 'password'}
                                            className='w-full p-2 rounded bg-gray-800 text-white pr-10'
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility(field)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition ease-in-out duration-200"
                                        >
                                            {showPassword[field] ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />
                    ))}

                    <button type='submit' disabled={isSubmitting} className='p-2 bg-blue-500 rounded text-white hover:bg-blue-700'>
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

export default ChangePassword;
