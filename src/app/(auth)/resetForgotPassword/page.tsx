'use client'
import axios from "axios"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetForgotPasswordSchema } from "@/schemas/resetForgotPassword";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import RouteNotFound from '@/components/RouteNotFound';
import { useSession } from 'next-auth/react';
import { IconPasswordUser } from "@tabler/icons-react";

function ResetForgotPassword() {

    const {data : session} = useSession()

    if(session?.user) {
        <RouteNotFound redirectURL="/u/dashboard"/>
    }

    const router = useRouter()
    const {toast} = useToast()
    const searchParams = useSearchParams()

    const form = useForm<z.infer<typeof resetForgotPasswordSchema>>({
        resolver : zodResolver(resetForgotPasswordSchema),
        defaultValues : {
            password : ""
        }
    })

    const [resetPasswordToken, setResetPasswordToken] = useState<string | null>(searchParams.get("token") || null)
    const [email, setEmail] = useState<string | null>(searchParams.get("email") || null)

    useEffect(() => {

        setResetPasswordToken(searchParams.get("token"))
        setEmail(searchParams.get("email"))

    }, [resetPasswordToken, email])

    console.log(resetPasswordToken)
    console.log(email)

    async function resetForgotPasswordHandler(values : z.infer<typeof resetForgotPasswordSchema>) {
        try {
            const response = await axios.patch("/api/resetForgotPassword", {
                password : values.password,
                token : resetPasswordToken,
                email
            })
            if(!response.data.success) {
                throw new Error(response.data.message)
            }
            toast({
                title : "Password has been resetted.",
                description : "Password has been resetted successfully",
                variant : "default"
            })
            router.push("/login")
        } catch (error: any) {
            console.error(error)
            // Check if there's a response from the server
            const errorMessage = error.response?.data?.message || "Something went wrong"
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive"
            })
        }
    }    

  return (
    <div className="w-screen h-screen flex items-center justify-center">
        <div className="h-2/5 w-1/5 flex flex-col gap-2">
            <div className="flex-grow flex flex-col items-center justify-center">
                <IconPasswordUser className="mb-4"/>
                <pre className="text-3xl font-Montserrat font-medium ">Enter your new Password here</pre>
            </div>
            <div className="flex-grow flex-col items-center justify-center">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(resetForgotPasswordHandler)}
                    className="flex flex-col gap-4"
                    >
                        <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="text-sm font-Montserrat tracking-wide">Enter your new Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="Password" {...field} className="font-Montserrat tracking-wider"/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" className='font-Montserrat tracking-wide font-bold'>Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
    </div>
  )
}

export default ResetForgotPassword;