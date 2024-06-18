"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPlanStatus } from "@/contexts/redux/user/user.slice";
import { usePlan } from "@/hooks/plan.hook";
import { Plan, getAllPlans, purchasePlan } from "@/services/user-plan";
import { DollarSign } from "lucide-react";
import { useEffect, useState } from "react";

function PlanCard(props: {
  plan: Plan;
  currentPlan: UserPlanStatus;
  handleCheckoutPlan: (planName: string) => void;
  loading: boolean;
}) {
  const isUpgrade = props.plan.tier > props.currentPlan.tier;
  const isCurrent = props.plan.tier === props.currentPlan.tier;
  const isLower = props.plan.tier < props.currentPlan.tier;

  const btnText = isUpgrade ? "Contratar" : "Contratado";
  return (
    <Card
      x-chunk="dashboard-01-chunk-0"
      className="hover:scale-105 transition-all ease-in-out duration-200 min-w-72">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-medium text-2xl">
          {props.plan.name}
        </CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p>{props.plan.description}</p>
        <ul className="my-4">
          <li className="text-xs text-muted-foreground">x disparos de Email</li>
          <li className="text-xs text-muted-foreground">x disparos de SMS</li>
          <li className="text-xs text-muted-foreground">x por SMS adicional</li>
          <li className="text-xs text-muted-foreground">
            x por Email adicional
          </li>
        </ul>
        <div className="text-sm font-bold">
          {props.plan.price.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          })}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          disabled={isCurrent || props.loading || isLower}
          onClick={() => props.handleCheckoutPlan(props.plan.name)}
          className="w-full">
          {btnText}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function ProductsPage() {
  const { plan: currentPlan, loading } = usePlan();
  const [fetchingPlans, setFetchingPlans] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    setFetchingPlans(true);
    getAllPlans()
      .then((data) => {
        setPlans(data);
      })
      .catch(() => {
        alert("Couldn't get plans");
      })
      .finally(() => {
        setFetchingPlans(false);
      });
  }, []);

  const handleCheckoutPlan = async (planName: string) => {
    await purchasePlan(planName);
  };

  return (
    <div>
      <div>
        <div>
          Plano atual: {loading ? "skeletonLoading..." : currentPlan?.name}
        </div>
        <div>
          Ativo:{" "}
          {loading ? "skeletonLoading..." : currentPlan?.active?.toString()}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {fetchingPlans && "loader..."}
        {plans.map((plan) => (
          <PlanCard
            currentPlan={currentPlan}
            handleCheckoutPlan={handleCheckoutPlan}
            loading={loading}
            plan={plan}
          />
        ))}
      </div>
    </div>
  );
}
