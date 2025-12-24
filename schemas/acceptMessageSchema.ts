import {z} from 'zod'

export const acceptingMsgSchema = z.object({
    acceptingMsg: z.boolean()
})