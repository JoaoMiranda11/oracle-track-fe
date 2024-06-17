"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePlan } from "@/hooks/plan.hook";
import { exchangePlan, purchasePlan } from "@/services/user-plan";
import { DollarSign } from "lucide-react";

export default function ProductsPage() {
  const { plan, loading, getPlan } = usePlan();

  const handleCheckoutPlan = async (planName: string, currentPlan?: string) => {
    if (currentPlan) {
      await exchangePlan(`${currentPlan}_TO_${planName}`.toUpperCase());
      await getPlan();
      return;
    }
    await purchasePlan(planName);
    await getPlan();
  };

  return (
    <div>
      <div>
        <div>Plano atual: {loading ? "carregando..." : plan?.name}</div>
        <div>Ativo: {loading ? "carregando..." : plan?.active?.toString()}</div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card
          x-chunk="dashboard-01-chunk-0"
          className="hover:scale-105 transition-all ease-in-out duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-2xl">Plano Basic</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p>Ideal para operações pequenas</p>
            <ul className="my-4">
              <li className="text-xs text-muted-foreground">
                x disparos de Email
              </li>
              <li className="text-xs text-muted-foreground">
                x disparos de SMS
              </li>
              <li className="text-xs text-muted-foreground">
                x por SMS adicional
              </li>
              <li className="text-xs text-muted-foreground">
                x por Email adicional
              </li>
            </ul>
            <div className="text-sm font-bold">R$ 30.000,00</div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => handleCheckoutPlan("BASIC", plan?.name)}
              className="w-full">
              Contratar
            </Button>
          </CardFooter>
        </Card>
        <Card
          x-chunk="dashboard-01-chunk-0"
          className="hover:scale-105 transition-all ease-in-out duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-2xl">
              Plano Premium
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p>Ideal para operações grandes</p>
            <ul className="my-4">
              <li className="text-xs text-muted-foreground">
                x disparos de Email
              </li>
              <li className="text-xs text-muted-foreground">
                x disparos de SMS
              </li>
              <li className="text-xs text-muted-foreground">
                0.06 por SMS adicional
              </li>
              <li className="text-xs text-muted-foreground">
                0.005 por Email adicional
              </li>
            </ul>
            <div className="text-sm font-bold">R$ 100.000,00</div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => handleCheckoutPlan("PREMIUM", plan?.name)}
              className="w-full">
              Contratar
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
