"use client";

import { useCallback, useState } from "react";
import { LoginForm } from "./_components/login";
import { OtpForm } from "./_components/otp";
import { CountDown } from "@/components/feedbacks/countdown";
import { useAuth } from "@/hooks/auth.hook";
import { useRouter } from "next/navigation";
import { dashBoardRoute } from "@/app.routes";

export default function Login() {
  const [dueDate, setDueDate] = useState<Date>();
  const [email, setEmail] = useState<string>();
  const { push } = useRouter();
  const { signin: authSignin, validateOtp: authValidateOtp } = useAuth();

  const signin = async (email: string, password: string) => {
    await authSignin(email, password)
      .then((data) => {
        setEmail(email);
        setDueDate(new Date(data));
      })
      .catch(() => {
        alert("Erro ao efetuar login!");
      });
  };

  const validateOtp = async (email: string, otp: string) => {
    if (!email) {
      alert("Invalid data");
      return;
    }
    await authValidateOtp(email, otp)
      .then(() => {
        push(dashBoardRoute.href);
        alert("Login efetuado com sucesso")
      })
      .catch(() => {
        alert("Erro no OTP");
      });
  };

  const otpStep = email;
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
