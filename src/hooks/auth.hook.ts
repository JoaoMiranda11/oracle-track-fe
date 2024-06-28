"use client";

import { useDispatch, useSelector } from "react-redux";
import * as AuthenticationService from "@/services/authentication";
import { clearCookie } from "@/actions/cookies";
import { login, logout } from "@/contexts/redux/user/user.slice";
import { RootState } from "@/contexts/redux/store";
import { useLayoutEffect } from "react";

export function useAuth() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.user);

  async function signin(email: string, password: string) {
    return await AuthenticationService.signin(email, password)
      .then(async ({ data }) => data)
  }

  async function validateOtp(email: string, otp: string) {
    await AuthenticationService.validateOtp(email, otp)
      .then(async ({ data }) => {
        dispatch(login(data));
      })
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
