"use client"

import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Message } from '@/models/users.models'
import { acceptingMsgSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

function page() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const handleDeleteMessage = (messageId: String) => {
    //remove the message to be deleted from array
    setMessages(messages.filter((message) => message._id.toString() !== messageId ))
  }

  const {data: session, status} = useSession()
  const user: User = session?.user

  const form = useForm<z.infer<typeof acceptingMsgSchema>>({
      resolver: zodResolver(acceptingMsgSchema),
      defaultValues: {
          acceptingMsg: true
      }
  })

  //methods available in form on destructuring
  //watch is used to continuously watch a field (we will be watching the accept msg button) and make api call as an when necessary 
  const {register, watch, setValue} = form

  const acceptingMsg = watch("acceptingMsg")

  //fetch the state of accept msg
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')

      if (typeof response.data.isAcceptingMsg === "boolean")
        setValue("acceptingMsg", response.data.isAcceptingMsg)

    } catch (error) {
      console.error("Error in fetching accept msg: ", error)
      
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message)
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: Boolean = false) => {
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')

      setMessages(response.data.messages ?? [])

      if (refresh){
        toast("Showing latest messages")
      }

    } catch (error) {
      console.error("Error in fetching messages: ", error)
      
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message)
    } finally {
      setIsLoading(false)
    }
  }, [setIsLoading, setMessages])

  //change the state
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptingMessages: !acceptingMsg
      })

      setValue("acceptingMsg", !acceptingMsg)

      toast.success(response.data.message)

    } catch (error) {
      console.error("Error in switching state: ", error)
      
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message)
    }
  }

  //fetch the initial states
  useEffect(() => {
    if (!session || !user) return 

    fetchMessages()
    fetchAcceptMessage()

  }, [session, setValue, fetchAcceptMessage, fetchMessages])

  //have to use hooks before return
  const urlRef = useRef<HTMLInputElement | null>(null)

  //keep the guard at last
  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session || !session.user) {
    return <div></div>
  }

  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${user.username}`

  const copyToClipboard = () => {
    urlRef.current?.select()
    window.navigator.clipboard.writeText(profileUrl)
    toast("URL has been copied to clipboard")
  }

  return (
    <div className="my-8 px-4 md:px-8 p-4 md:p-6 bg-white rounded w-full xl:max-w-6xl xl:mx-auto overflow-x-hidden">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            ref={urlRef}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptingMsg')}
          checked={acceptingMsg}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptingMsg ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id.toString()}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default page