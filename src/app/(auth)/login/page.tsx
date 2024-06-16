"use client";

import { useCallback, useEffect, useState } from "react";
import { LoginForm } from "./_components/login";
import * as AuthenticationService from "@/services/authentication";
import { OtpForm } from "./_components/otp";
import { useRouter } from "next/navigation";
import { setCookie } from "@/actions/cookies";

function CountDown({
  dueDate,
  onExpire,
}: {
  dueDate: Date;
  onExpire?: () => void;
}) {
  const [time, setTime] = useState(0);
  const [started, setStart] = useState(false);
  const msInterval = 1000;

  useEffect(() => {
    const time = dueDate.getTime() ?? 0;
    const totalTime = (time - Date.now()) / 1000;
    setTime(totalTime < 0 ? 0 : totalTime);
    setStart(true);
  }, [dueDate]);

  useEffect(() => {
    setTimeout(() => {
      if (time > 0) {
        const newTime = time - msInterval / 1000;
        setTime(Math.abs(newTime > 0 ? newTime : 0));
      } else {
        onExpire?.();
      }
    }, msInterval);
  }, [time]);

  if (!started) {
    return <></>;
  }

  const min = (0 + Math.abs(time / 60).toFixed(0)).slice(-2);
  const sec = (0 + Math.abs(time % 60).toFixed(0)).slice(-2);
  return (
    <div>
      {min}:{sec}
    </div>
  );
}

export default function Login() {
  const [hash, setHash] = useState<string>();
  const [dueDate, setDueDate] = useState<Date>();
  const [email, setEmail] = useState<string>();
  const { push } = useRouter();

  const signin = async (email: string, password: string) => {
    await AuthenticationService.signin(email, password)
      .then(({ data }) => {
        if (typeof data === "string") {
          return;
        }
        setEmail(email);
        setHash(data.hash);
        setDueDate(new Date(data.dueDate));
      })
      .catch((err) => {
        console.error(err);
        alert("Err");
      });

    return true;
  };

  const validateOtp = useCallback(
    async (otp: string) => {
      if (!email || !hash) {
        alert("Invalid data");
        return;
      }
      return await AuthenticationService.validateOtp(email, otp, hash)
        .then(async ({ data }) => {
          await setCookie(process.env.NEXT_PUBLIC_TOKEN_NAME!, data);
          push("/");
        })
        .catch((err) => {
          console.error(err);
          alert("Login Err");
        });
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
