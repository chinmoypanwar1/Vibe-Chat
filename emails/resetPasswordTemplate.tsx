import * as React from 'react';
import { Html, Button } from "@react-email/components";

// TODO: Make a good looking react email form to reset the password
export function ForgotPassword({ token, email }: { token: string, email : string }) {

  return (
    <Html lang="en">
      <h1>Reset Your Password</h1>
      <Button href={`http://localhost:3000/resetForgotPassword?token=${token}&email=${email}`}>Reset Password</Button>
    </Html>
  );
}

export default ForgotPassword;