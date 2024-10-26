import * as React from 'react';
import { Html, Button } from "@react-email/components";

// TODO: Make a good looking react email form to verify the User
export function VerifyEmail({ verifyCode, username }: { verifyCode: string, username : string }) {

  return (
    <Html lang="en">
      <h1>User ${username}. Please verify your email</h1>
      <Button href={`http://localhost:3000/verify?verifyCode=${verifyCode}&username=${username}`}>Verify User</Button>
    </Html>
  );
}

export default VerifyEmail;