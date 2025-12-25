import {z} from 'zod'

//Having a validation check, using chaining to perform multiple checks
export const usernameValidation = z.string()
    .min(2, "Username must have atleast two characters")
    .max(24, "Username can have atmax 20 characters")
    .regex(/^[A-Za-z0-9_.]+$/, "Username can only contain letters, numbers, underscore (_) and dot (.)")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must contain atleast 8 characters")
})