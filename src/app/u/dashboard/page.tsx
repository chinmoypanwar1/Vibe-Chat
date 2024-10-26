'use client'
import React from 'react'
import { useSession } from 'next-auth/react'
import RouteNotFound from '@/components/RouteNotFound'

function Dashboard() {

  const {data : session} = useSession({
    required : true,
    onUnauthenticated() {
        return 
    },
  })

  if(!session?.user) {
    return <RouteNotFound redirectURL='/u/home'/>
  }

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard