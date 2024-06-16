"use client";

import { useCallback, useState } from "react";
import { LoginForm } from "./_components/login";
import { OtpForm } from "./_components/otp";
import { CountDown } from "@/components/utils/countdown";
import { useAuth } from "@/hooks/auth.hook";

export default function Login() {
  const [hash, setHash] = useState<string>();
  const [dueDate, setDueDate] = useState<Date>();
  const [email, setEmail] = useState<string>();
  const { signin: authSignin, validateOtp: authValidateOtp } = useAuth()

  const signin = async (email: string, password: string) => {
    await authSignin(email, password)
      .then((data) => {
        if (!data) return;
        setEmail(email);
        setHash(data.hash);
        setDueDate(new Date(data.dueDate));
      })
  };

  const validateOtp = useCallback(
    async (otp: string) => {
      if (!email || !hash) {
        alert("Invalid data");
        return;
      }
      return await authValidateOtp(email, otp, hash);
    },
    [email, hash]
  );

  const otpStep = hash && email;
  return (
    <main className="w-full h-full min-h-dvh flex justify-center items-center">
      <div className="flex flex-col items-center justify-center py-12">
        {otpStep ? (
          <OtpForm validateOtp={validateOtp} email={email} />
        ) : (
          <LoginForm signin={signin} />
        )}
        {dueDate && <CountDown dueDate={dueDate} />}
      </div>
    </main>
  );
}
