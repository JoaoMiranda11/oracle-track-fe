"use client";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";

interface OtpFormProps {
  email: string;
  validateOtp: (otp: string) => Promise<any>;
}

const validateOtpForm = z.object({
  otp: z.string().min(6).max(6),
});
type OtpIputs = z.infer<typeof validateOtpForm>;

export function OtpForm({ validateOtp, email }: OtpFormProps) {
  const [value, setValue] = useState("");

  function handleSubmit(otp: string) {
    const validatorOtp = validateOtpForm.safeParse({ otp });
    if (validatorOtp.error) {
      alert("Invalid OTP")
      return;
    }
    validateOtp(otp);
  }

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault()
        handleSubmit(value)
      }}
      className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">OTP</h1>
        <p className="text-balance text-muted-foreground">
          Um OTP foi enviado para o email {email}.
        </p>
      </div>
      <div className="grid gap-4">
        <div className="flex justify-center items-center">
          <InputOTP
            maxLength={6}
            value={value}
            onChange={(value) => setValue(value)}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button type="submit" className="w-full">
          Acessar
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="#" className="underline">
          Sign up
        </Link>
      </div>
    </form>
  );
}
