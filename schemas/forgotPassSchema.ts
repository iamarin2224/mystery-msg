import {z} from 'zod'

export const forgotPassSchema = z.object({
    identifier: z.string(),
})