import {z} from "zod"

export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast 2 characters")
    .max(20, "Username must be no more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character")



export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invlaid Email Address"}),
    password: z.string().min(6,{message: "Length of passowrd must be atleasr 6 characters"})
})