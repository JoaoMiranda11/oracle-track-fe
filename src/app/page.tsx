"use client";

import { getUserInfo } from "@/services/authentication";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button onClick={getUserInfo}>testando</button>
    </main>
  );
}
