'use client'

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { forgotPassSchema } from "@/schemas/forgotPassSchema"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"

function page() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const router = useRouter()

    //zod implementation
    const form = useForm<z.infer<typeof forgotPassSchema>>({
        resolver: zodResolver(forgotPassSchema),
        defaultValues: {
            identifier: '',
        }
    })


    //using handle submit of react hook form, it gives data as a parameter in the onsubmit
    const onSubmit = async (data: z.infer<typeof forgotPassSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>('/api/forgot-password', data)
            
            toast.success(response.data.message, {
                description: "Check your email to reset your password"
            })

            setTimeout(() => {
                router.replace(`/verify/${response.data.username}/?mode=reset`)
            }, 2000)

        } catch (error) {
            console.error("Error in sign-up of user: ", error)

            const axiosError = error as AxiosError<ApiResponse>
            let errorMsg = axiosError.response?.data.message
            toast.error("Failed to sign-up user", {
                description: errorMsg
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md mx-6">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Welcome To Mystery Message
                    </h1>
                    <p className="mb-4">Sign in to start your mysterious messaging adventure</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        
                        <FormField
                        control={form.control}
                        name="identifier"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email or Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="email or username" {...field} /> 
                                    {/*onChange is implied in this case*/}
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                        <Button type="submit" disabled={isSubmitting} >
                            Send Code
                        </Button>
                        
                    </form>
                </Form>
                
                <div className="text-center mt-4">
                    <p>
                        Not registered yet?{' '}
                        <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                        Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default page