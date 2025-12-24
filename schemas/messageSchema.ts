import {z} from 'zod'

export const messageSchema = z.object({
    content: z.string()
            .min(3, {error: "Message must have atleat 6 characters"})
            .max(500, {error: "Message must not exceed 500 characters"})
})