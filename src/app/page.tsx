'use client'

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import React from 'react';

interface MessagePayload {
  message: string;
  socketId: string;
}

let socket: Socket;

function Page() {

  useEffect(() => {
    socket = io('http://localhost:3000');  

    socket.on("connect", () => {
      console.log("Connected to the socket");
      console.log("User has been connected to the server using the socket id : ", socket.id);
    });

    socket.on("recieve-message", (data: MessagePayload) => {
      console.log("Message received: ", data.message);
      console.log("From socket ID: ", data.socketId);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className='w-40 h-20'>
      Socket Connection Page
    </div>
  );
}

export default Page;
