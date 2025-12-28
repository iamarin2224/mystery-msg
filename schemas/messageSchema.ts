import {z} from 'zod'

export const messageSchema = z.object({
    content: z.string()
            .min(6, {error: "Message must have atleat 6 characters"})
            .max(1000, {error: "Message must not exceed 1000 characters"})
})