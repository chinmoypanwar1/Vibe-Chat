'use client'

import React from 'react'
import { useState } from 'react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/schemas/signInSchema";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
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
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconHome,
  IconLogin,
  IconBrandGoogle,
  IconBrandGithub
} from "@tabler/icons-react";
import RouteNotFound from '@/components/RouteNotFound';
import { useSession } from 'next-auth/react';

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

export default function LoginPage() {

  const {data : session} = useSession()

  if(session?.user) {
    <RouteNotFound redirectURL="/u/dashboard"/>
  }

  const { toast } = useToast();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  // Defining the form inital state
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: ""
    },
  });

  // Making the loginHandler
  async function loginHandler(values : z.infer<typeof signInSchema>) {
    try {
      setIsPending(true)
      const response = await signIn('credentials', {
        username : values.username,
        password : values.password,
        redirectTo : "/u/dashboard"
      });
      console.log(response)
      if(response?.error) throw new Error("Invalid Credentials. Please try again later")
      toast({
        title: "User Login Successfully",
        description: "User has been logged In Successfully",
        variant : "default"
      })
      setIsPending(false)
      router.push("/dashboard")
    } catch (error : any) {
      setIsPending(false)
      console.error(error)
      toast({
        title: "Error",
        description: error.message,
        variant : "destructive"
      })
    }
  }

  // Provider Login Handler
  async function providerLoginHandler(provider : string) {
    const response = await signIn(provider, {
      redirectTo : "/u/dashboard"
    })
    console.log(response)
    if(response?.error) {
      toast({
        title: "Error",
        description: response.error,
        variant : "destructive"
      })
    }
    if(response?.ok) {
      toast({
        title: "User Login Successfully",
        description: "User has been logged In Successfully",
        variant : "default"
      })
    }
  }

  const links = [
    {
      title : "Home",
      icon : (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href : "/u/home"
    },
    {
      title: "Sign Up",
      icon: (
        <IconLogin className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/signup",
    }
  ]

  return (
    <div className="flex flex-col gap-4 w-screen h-screen">
      <div className="basis-5/6 flex flex-col justify-center items-center gap-y-10">
          <h1 className="text-4xl font-Montserrat w-auto tex-center font-semibold">Login Page</h1>
        <div className="w-1/5 flex flex-col gap-10">
          <div className="w-80">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(loginHandler)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-md font-Montserrat ml-2">Username</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} className="font-Montserrat tracking-wide"/>
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
                      <FormLabel className="text-md font-Montserrat ml-2">Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Password" {...field} type="password" className="font-Montserrat tracking-wide" />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                <Button type="submit" className={`w-4/12 mt-4 self-center font-Montserrat`} disabled={isPending}>Log In</Button>
              </form>
            </Form>
          </div>
          <div>
            {/* Use for provider buttons */}
            <div className="flex flex-col space-y-4">
              <Button
              className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)] ml-1"
              type="submit"
              onClick={() => providerLoginHandler("google")}
            >
                <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                  Sign in with Google
                </span>
                <BottomGradient />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="basis-1/6 flex items-center justify-center h-16 w-full">
        <FloatingDock items={links}/>
      </div>
    </div>
  )

}
