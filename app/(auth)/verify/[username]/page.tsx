'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { verifySchema } from "@/schemas/verifySchema"
import { toast } from "sonner"
import { useParams, useRouter, useSearchParams } from "next/navigation"
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

function page() {
    const router = useRouter()

    const params = useParams<{username: string}>()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ""
        }
    })

    const searchParams = useSearchParams();
    const mode = searchParams.get("mode"); 

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post<ApiResponse>('/api/verify', {
                username: params.username,
                code: data.code
            })
            
            toast.success(response.data.message)

            if (mode === "reset"){
                document.cookie = "canResetPassword=true; max-age=900; path=/";
                setTimeout(() => {
                    router.replace(`/reset-password/${params.username}`)
                }, 2000)
            }
            else{
                setTimeout(() => {
                    router.replace(`/sign-in`)
                }, 2000)
            }

        } catch (error) {
            console.error("Error in verification of user: ", error)

            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md mx-6">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                    Verify Your Account
                </h1>
                <p className="mb-4">
                    Enter the verification code sent to your email
                    <br/>
                    Please check spam folder if you didn't recieve the email
                </p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                    name="code"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Verification Code</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" className="w-full cursor-pointer">Verify</Button>
                </form>
            </Form>
        </div>
    </div>
    )
}

export default page