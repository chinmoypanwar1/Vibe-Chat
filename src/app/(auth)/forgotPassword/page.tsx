'use client'
import axios from "axios"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/schemas/forgotPassword";
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
import { useSession } from "next-auth/react";
import RouteNotFound from "@/components/RouteNotFound";
import { IconMail } from "@tabler/icons-react";

function ForgotPassword() {

    const {data: session} = useSession()

    if(session?.user) {
        <RouteNotFound redirectURL="/u/dashboard"/>
    }

    const {toast} = useToast()
    const router = useRouter()

    const form = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver : zodResolver(forgotPasswordSchema),
        defaultValues : {
            email : ""
        }
    })

    async function forgotPasswordHandler(values : z.infer<typeof forgotPasswordSchema>) {
        const response = await axios.post("/api/forgotPassword", {
            redirect : false,
            email : values.email
        })
        if(response.status === 200) {
            toast({
                title : "Check your email",
                description : "We have sent a password reset link to your email",
                variant : "default"
            })
            router.push("/login")
        } else if(response.status === 404) {
            toast({
                title : "Error",
                description : "User not found. Please register yourself.",
                variant : "destructive"
            })
            router.push("/signup")
        }
    }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
        <div className="h-2/5 w-1/5 flex flex-col gap-2">
            <div className="flex-grow flex flex-col items-center justify-center">
                <IconMail className="mb-4"/>
                <pre className="text-3xl font-Montserrat font-medium ">Forgot Your Path , Fellow Tarnished</pre>
            </div>
            <div className="flex-grow flex-col items-center justify-center">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(forgotPasswordHandler)}
                    className="flex flex-col gap-4"
                    >
                        <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="text-sm font-Montserrat tracking-wide">Enter your email here :</FormLabel>
                                <FormControl>
                                    <Input placeholder="Email" {...field} className="font-Montserrat tracking-wider"/>
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

export default ForgotPassword
