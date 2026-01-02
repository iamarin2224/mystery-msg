'use client'

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { signUpSchema } from "@/schemas/signUpSchema"
import Link from "next/link"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import axios, {AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2, Eye, EyeOff } from "lucide-react"

function page() {

    const [username, setUsername] = useState('')
    const [usernameMsg, setUsernameMsg] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false);

    const debounced = useDebounceCallback(setUsername, 300)

    const router = useRouter()

    //zod implementation
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })

    useEffect(() => {
        const checkUsername = async () => {
            if (!username) {
                setUsernameMsg('')
                return
            }

            //only proceed for non empty usernmae
            if (username){
                setIsCheckingUsername(true) //as we are checking in this process
                setUsernameMsg('') //empty the previous msg

                try {
                    const response = await axios.get(`/api/check-username/?username=${username}`)
                    setUsernameMsg(response.data.message)
                } catch (error) {
                    console.error("Error checking username", error)
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMsg(
                        axiosError.response?.data.message ?? 'Error checking username'
                    )
                } finally { //runs after both try and catch block
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUsername()
    }, [username])

    //using handle submit of react hook form, it gives data as a parameter in the onsubmit
    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data)
            
            toast.success(response.data.message, {
                description: "Check your email to verify your account"
            })

            setTimeout(() => {
                router.replace(`/verify/${data.username}`)
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
                        Join Mystery Message
                    </h1>
                    <p className="mb-4">Sign up to start your mysterious messaging adventure</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="username" 
                                        {...field} 
                                        onChange={(e) => {
                                            field.onChange(e) //updates the form state
                                            debounced(e.target.value) //update local state with delay
                                        }}
                                    />
                                </FormControl>

                                {isCheckingUsername && <Loader2 className="animate-spin" />}
                                
                                {!isCheckingUsername && usernameMsg && (
                                    <>
                                        <p  className={`text-sm ${
                                            usernameMsg === 'Username is unique' 
                                                ? 'text-green-500'
                                                : 'text-red-500'
                                        }`}
                                        >
                                            {usernameMsg}
                                        </p>
                                    </>
                                )}

                                <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="email" {...field} /> 
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

                        <Button type="submit" disabled={isSubmitting} className="w-full cursor-pointer" >
                            {
                                isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait
                                    </>
                                ) : ( 'Sign Up' )
                            }
                        </Button>
                        
                    </form>
                </Form>
                
                <div className="text-center mt-4">
                    <p>
                        Already a member?{' '}
                        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                        Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default page