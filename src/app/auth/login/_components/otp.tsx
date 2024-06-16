"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import { useForm } from "react-hook-form";
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
  const { register, handleSubmit } = useForm<OtpIputs>({
    resolver: zodResolver(validateOtpForm),
  });

  return (
    <form
      onSubmit={handleSubmit((d) => validateOtp(d.otp))}
      className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">OTP</h1>
        <p className="text-balance text-muted-foreground">
          Um OTP foi enviado para o email {email}.
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">OTP</Label>
          <Input
            id="otp"
            type="otp"
            required
            {...register("otp")}
          />
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
