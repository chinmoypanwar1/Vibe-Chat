'use client'
import React from 'react'
import { useSearchParams } from "next/navigation";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import RouteNotFound from '@/components/RouteNotFound';
import { useSession } from 'next-auth/react';
import { IconUser } from '@tabler/icons-react'
import { Button } from '@/components/ui/button';

function VerifyPage() {

    const {data : session} = useSession()

    if(session?.user) {
    <RouteNotFound redirectURL="/u/dashboard"/>
    }

    const router = useRouter()
    const searchParams = useSearchParams();
    const {toast} = useToast()
    
    const verificationHandler = async () => {
        const username = searchParams.get("username")
        const verifyCode = searchParams.get("verifyCode")
        try {
            const response = await axios.post("/api/verifyUser", { username, verifyCode });
            toast({
                title: response.data.message,
                description: response.data.message,
                variant: `${response.data.success ? "default" : "destructive"}`,
            });
            if (response.data.success) {
                router.push("/login");
            }
        } catch (error:any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Something went wrong",
                variant: "destructive"
            });
        }
    }

  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center">
        <div className='w-1/5 h-1/5 flex flex-col justify-center rounded-xl'>
            <div className='flex flex-col justify-center items-center flex-basis-1/2 flex-grow'>
                <pre className='text-3xl font-Montserrat tracking-tight'>Prove Yourself, Fellow Traveller</pre>
            </div>
            <div className='flex-basis-1/2 flex-grow flex flex-col justify-center items-center'>
                <Button onClick={verificationHandler} className='font-Montserrat tracking-wide font-bold'>
                    Verify User
                </Button>
            </div>
        </div>
    </div>
  )
}

export default VerifyPage