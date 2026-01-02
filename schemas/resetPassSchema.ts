import {z} from 'zod'

export const resetPassSchema = z.object({
    newPassword: z.string().min(8, "Password must contain atleast 8 characters")
})