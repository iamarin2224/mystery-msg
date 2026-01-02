"use client"

import {Message} from "@/models/users.models"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { X } from 'lucide-react'
import dayjs from 'dayjs';

type MessageCardProps = {
  message: Message,
  onMessageDelete: (msgId: String) => void
}

function MessageCard({message, onMessageDelete}: MessageCardProps) {

  const handleDeletConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
  
      toast(response.data.message)
  
      onMessageDelete(message._id.toString())

    } catch (error) {
      console.error("Error in deletion of message: ", error)

      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message)
    }
  }

  return (
    <Card>
        <CardHeader>
            <div className="flex gap-2 justify-between items-center" >
            <CardTitle>{message.content}</CardTitle>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <X className="w-5 h-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this message.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeletConfirm} >Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            </div>
            <div className="text-sm">
              {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
            </div>
        </CardHeader>
        <CardContent></CardContent>
    </Card>
  )
}

export default MessageCard