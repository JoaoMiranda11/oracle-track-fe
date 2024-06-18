"use client";

import { useDispatch, useSelector } from "react-redux";
import * as AuthenticationService from "@/services/authentication";
import { clearCookie, setCookie } from "@/actions/cookies";
import { dashBoardRoute } from "@/app.routes";
import { login, logout } from "@/contexts/redux/user/user.slice";
import { decodeJwt } from "@/utils/jwt.utils";
import { RootState } from "@/contexts/redux/store";
import { useLayoutEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.user);
  const { push } = useRouter();

  async function setAuthCookie(cookie: string) {
    await setCookie(process.env.NEXT_PUBLIC_TOKEN_NAME!, cookie);
    push(dashBoardRoute.href);
  }

  async function setAuthInfo(jwt: string) {
    const authInfo = decodeJwt(jwt);
    if (authInfo) {
      dispatch(login(authInfo));
    }
    alert("error");
  }

  async function signin(email: string, password: string) {
    return await AuthenticationService.signin(email, password)
      .then(async ({ data }) => data)
      .catch((err) => {
        console.error(err);
        alert("Err");
        return null;
      });
  }

  async function validateOtp(email: string, otp: string, hash: string) {
    await AuthenticationService.validateOtp(email, otp, hash)
      .then(async ({ data }) => {
        await setAuthCookie(data);
        setAuthInfo(data);
      })
      .catch((err) => {
        console.error(err);
        alert("Login Err");
      });
  }

  async function signout() {
    await clearCookie(process.env.NEXT_PUBLIC_TOKEN_NAME!);
    dispatch(logout());
  }

  async function getUserInfo() {
    const authInfo = await AuthenticationService.getUserInfo();
    if (authInfo) {
        dispatch(login(authInfo))
        return;
    }
    signout()
  }

  useLayoutEffect(() => {
    if (!isAuthenticated) {
      getUserInfo()
    }
  }, [isAuthenticated])

  return { signin, signout, validateOtp, getUserInfo, user, isAuthenticated };
}
