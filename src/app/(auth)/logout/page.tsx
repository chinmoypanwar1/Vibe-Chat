'use client'
import { signIn, signOut, useSession } from 'next-auth/react'
import RouteNotFound from '@/components/RouteNotFound';

function LogoutPage() {
    
    const {data: session} = useSession();
    if(!session?.user) {
        return <RouteNotFound redirectURL="/u/home"/>
    }

    const logoutHandler = async() => {
        await signOut()
        await signIn()
    }

    return (
        <>
            <button onClick={logoutHandler}>Sign out</button>
        </>
    )
}

export default LogoutPage