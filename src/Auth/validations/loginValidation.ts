import {z} from "zod"

export const loginSchema = z.object({
    email: z.
        string({message: "Email is required"})
        .email({message: "Email must be the correct one."}),
    password: z
        .string({message: "Password is required"})
})