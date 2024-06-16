"use server";

import { cookies } from "next/headers";

export async function setCookie(name: string, data: string) {
  cookies().set({
    name: name ?? "cookie",
    secure: true,
    value: data,
    httpOnly: true,
    path: "/",
  });
}
