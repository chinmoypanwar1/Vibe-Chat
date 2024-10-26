"use client";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import signupSchema from "@/schemas/signupSchema";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconHome,
  IconLogin,
} from "@tabler/icons-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import RouteNotFound from '@/components/RouteNotFound';
import { useSession } from 'next-auth/react';
import { LampContainer } from "@/components/ui/lamp";
import {motion} from "framer-motion";

export function SignupForm() {

  const {data : session} = useSession()

  if(session?.user) {
    <RouteNotFound redirectURL="/u/dashboard"/>
  }

  const { toast } = useToast();
  const router = useRouter()
  const [isPending, setIsPending] = useState(false);

  // Defining the form inital state
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // Making the signupHandler
  async function signupHandler(values: z.infer<typeof signupSchema>) {
    try {
      console.log("The isPending state value is : ", isPending);
      setIsPending(true);
      await axios.post("/api/signup", values);
      toast({
        title: "Account Created",
        description:
          "You have been signed up successfully, Please verify your email.",
      });
      setIsPending(false)
      router.push("/login");
    } catch (error: any) {
      setIsPending(false)
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast({
        title: "Account Creation Failed",
        description: errorMessage,
        variant: "destructive",
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
      title: "Login",
      icon: (
        <IconLogin className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/login",
    }
  ]

  return (
      <div className="flex flex-col gap-4 w-screen h-screen">
        <div className="basis-5/6 flex flex-col justify-center items-center gap-y-10">
          <h1 className="text-4xl font-Montserrat w-auto tex-center font-semibold">Let's get you Started</h1>
          <div className="w-1/5 flex flex-col gap-10">
              <div className="w-80">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(signupHandler)}
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
                          <FormDescription className="text-sm font-Montserrat ml-2">
                            This is your public display name.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-md font-Montserrat ml-2">Email</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe@example.com" {...field} className="font-Montserrat tracking-wide" />
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
                            <Input placeholder="Enter your password" {...field} type="password" className="font-Montserrat tracking-wide"/>
                          </FormControl>
                          <FormDescription className="text-sm font-Montserrat ml-2">
                            Please use a strong password
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className={`w-4/12 mt-4 self-center font-Montserrat`} disabled={isPending}>Sign Up &rarr;</Button>
                  </form>
                </Form>
              </div>
          </div>
        </div>
        <div className="basis-1/6 flex items-center justify-center h-16 w-full">
          <FloatingDock items={links}/>
        </div>
      </div>
  );
}

export default SignupForm;