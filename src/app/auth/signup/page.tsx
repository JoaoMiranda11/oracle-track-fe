"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signinUp } from "@/services/authentication";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const validateSigninForm = z.object({
  name: z.string().min(6).max(40),
  email: z.string().email(),
  password: z.string().min(6).max(20),
});
type SigninIputs = z.infer<typeof validateSigninForm>;

export default function SigninUp() {
  const { push } = useRouter();

  const { register, handleSubmit } = useForm<SigninIputs>({
    resolver: zodResolver(validateSigninForm),
  });

  async function handleSigninUp(name: string, email: string, password: string) {
    const res = await signinUp(name, email, password)
    if (res) {
      push("/auth/login");
      return
    }
    alert("Err")
  }

  return (
    <main className="w-full h-full min-h-dvh flex justify-center items-center">
      <div className="flex flex-col items-center justify-center py-12">
        <form
          onSubmit={handleSubmit((d) => handleSigninUp(d.name, d.email, d.password))}
          className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Sign up</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to create to your account
            </p>
          </div>
          <div className="grid gap-4">
          <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="name"
                placeholder="Your Name"
                required
                {...register("name")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                {...register("email")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                {...register("password")}
              />
            </div>
            <Button type="submit" className="w-full">
              Cadastrar
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
