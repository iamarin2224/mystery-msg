'use client'

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { signInSchema } from "@/schemas/signInSchema"
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
import { signIn } from "next-auth/react"

function page() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const router = useRouter()

    //zod implementation
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: ''
        }
    })


    //using handle submit of react hook form, it gives data as a parameter in the onsubmit
    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true)

        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })

        if (result?.error){
            toast.error("Sign In failed", {
                description: "Invalid email or password"
            })
        }
        if (result?.url){
            toast.success("Sign In successful")

            setTimeout(() => {
                router.replace(`/dashboard`)
            }, 2000)
        }

        setIsSubmitting(false)
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

                        <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                        <Button type="submit" disabled={isSubmitting} >
                            Sign In
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