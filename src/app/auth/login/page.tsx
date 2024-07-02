"use client";

import { useState } from "react";
import { LoginForm } from "./_components/login";
import { OtpForm } from "./_components/otp";
import { useAuth } from "@/hooks/auth.hook";
import { toast } from "sonner";
import { LoginLoadingStep } from "./_components/loading";

type Steps = "login" | "otp" | "loading";

function FormSteps({
  step,
  dueDate,
  signin,
  validateOtp,
  email,
}: {
  step: Steps;
  dueDate: Date;
  email: string;
  signin: (email: string, password: string) => Promise<void>;
  validateOtp: (email: string, otp: string) => Promise<void>;
}) {
  switch (step) {
    case "loading":
      return <LoginLoadingStep />;
    case "otp":
      return (
        <OtpForm validateOtp={validateOtp} email={email} dueDate={dueDate} />
      );
    case "login":
      return <LoginForm signin={signin} />;
  }
}

export default function Login() {
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [email, setEmail] = useState<string>("");
  const [step, setStep] = useState<Steps>("login");
  const { signin: authSignin, validateOtp: authValidateOtp } = useAuth();

  const signin = async (email: string, password: string) => {
    await authSignin(email, password)
      .then((data) => {
        setEmail(email);
        setDueDate(new Date(data));
        setStep('otp')
      })
      .catch(() => {
        toast.error("Erro ao efetuar login!");
      });
  };

  const validateOtp = async (email: string, otp: string) => {
    if (!email) {
      toast.error("Invalid data");
      return;
    }
    await authValidateOtp(email, otp)
      .then(() => {
        setStep('loading')
        toast.error("Login efetuado com sucesso");
      })
      .catch(() => {
        toast.error("Erro no OTP");
      });
  };

  return (
    <main className="w-full h-full min-h-dvh flex justify-center items-center">
      <div className="flex flex-col items-center justify-center py-12">
        <FormSteps
          dueDate={dueDate}
          email={email}
          signin={signin}
          step={step}
          validateOtp={validateOtp}
        />
      </div>
    </main>
  );
}
