import {z} from 'zod'

export const signUpSchema = z.object({
    email: z.string().email("Invalid Email address"),
    password: z.string().min(8, "Password must be of atleast 8 characters").regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "Password is incorrect")
})