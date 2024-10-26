'use client'
import React from 'react'
import RouteNotFound from '@/components/RouteNotFound';
import { useSession } from 'next-auth/react';

function Home() {

  const {data : session} = useSession()

  if(session?.user) {
    <RouteNotFound redirectURL="/u/dashboard"/>
  }

  return (
    <div>Home</div>
  )
}

export default Home