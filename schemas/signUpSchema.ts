import {z} from 'zod'

//Having a validation check, using chaining to perform multiple checks
export const usernameValidation = z.string()
    .min(2, "Username must have atleast two characters")
    .max(24, "Username can have atmax 20 characters")
    .regex(/^[A-Za-z0-9_]+$/, "Username must not contain special characters except")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.email({error: "Invalid email address"}),
    password: z.string().min(8, {error: "Password must contain atleast 8 characters"})
})