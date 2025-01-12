import {z} from 'zod'

export const loginSchema = z.object({
    email: z
        .string()
        .email("Invalid Email address"),
    password: z.string()
})