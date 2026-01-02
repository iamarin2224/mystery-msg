'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { resetPassSchema } from "@/schemas/resetPassSchema"
import { toast } from "sonner"
import { useParams, useRouter } from "next/navigation"
import axios, {AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"

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
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react"

function page() {
    const router = useRouter()

    const params = useParams<{username: string}>()

    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<z.infer<typeof resetPassSchema>>({
        resolver: zodResolver(resetPassSchema)
    })

    const onSubmit = async (data: z.infer<typeof resetPassSchema>) => {
        try {
            const response = await axios.post<ApiResponse>('/api/reset-password', {
                username: params.username,
                newPassword: data.newPassword
            })
            
            toast.success(response.data.message)

            document.cookie ="canResetPassword=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            setTimeout(() => {
                router.replace(`/sign-in`)
            }, 2000)
            
        } catch (error) {
            console.error("Error in reset password of user: ", error)

            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md mx-6">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Reset Your Password
                    </h1>
                    <p className="mb-4">
                        Hey {params.username}, please enter a new password for your account
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="password"
                                        {...field}
                                        className="pr-10"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                        ) : (
                                        <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit"> Confirm </Button>
                        
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default page