import { Message } from "@/models/users.models"

export interface ApiResponse{
    success: boolean,
    message: string,
    isAcceptingMsg?: boolean,   //optional fields may or may not use in the response
    messages?: Array<Message>,
    username?: string
}