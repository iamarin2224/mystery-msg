import {z} from 'zod'

//The otp which will be getting
export const verifySchema = z.object({
    code: z.string().length(6, {error: "Verification code must be of 6 digits"})
})