"use client";

import { dashBoardRoute } from "@/app.routes";
import { SpinLoader } from "@/components/feedbacks/loader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function LoginLoadingStep() {
  const { push } = useRouter();

  useEffect(() => {
    push(dashBoardRoute.href);
  }, []);

  return (
    <Card>
      <CardHeader>Aguarde....</CardHeader>
      <CardContent className="flex justify-center items-center">
        <SpinLoader />
      </CardContent>
    </Card>
  );
}
