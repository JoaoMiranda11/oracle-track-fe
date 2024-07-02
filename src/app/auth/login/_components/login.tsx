"use client";

import { SpinLoader } from "@/components/feedbacks/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface LoginFormProps {
  signin: (email: string, password: string) => Promise<void>;
}

const validateLoginForm = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(20),
});
type LoginIputs = z.infer<typeof validateLoginForm>;

export function LoginForm({ signin }: LoginFormProps) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm<LoginIputs>({
    resolver: zodResolver(validateLoginForm),
  });

  const handleLogin = (d: LoginIputs) => {
    setLoading(true);
    signin(d.email, d.password).finally(() => {
      setLoading(false);
    });
  };

  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-balance text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="email@mail.com"
            required
            {...register("email")}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="ml-auto inline-block text-sm underline">
              Forgot your password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            required
            {...register("password")}
          />
        </div>
        <Button disabled={loading} type="submit" className="w-full">
          {loading ? <SpinLoader /> : "Login"}
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="underline">
          Sign up
        </Link>
      </div>
    </form>
  );
}
