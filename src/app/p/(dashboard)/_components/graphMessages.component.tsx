"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { CreditTransaction } from "@/services/credits";
import { SpinLoader } from "@/components/feedbacks/loader";

const formatData = (transactions: CreditTransaction[]) => {
  const result: { date: string; sms: number; email: number }[] = [];
  const dateMap: { [key: string]: { sms: number; email: number } } = {};

  const now = new Date();
  const dates = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const formattedDate = date.toISOString().split("T")[0];
    dates.push(formattedDate);
    dateMap[formattedDate] = { sms: 0, email: 0 };
  }

  transactions.forEach((transaction) => {
    const date = transaction.createdAt.split("T")[0];
    if (dateMap[date]) {
      if (transaction.name.toLowerCase() === "sms") {
        dateMap[date].sms += transaction.ammount;
      }
      if (transaction.name.toLowerCase() === "email") {
        dateMap[date].email += transaction.ammount;
      }
    }
  });

  for (const date of dates) {
    result.push({ date, ...dateMap[date] });
  }

  return result.reverse();
};

const filterLastMonthTransactions = (transactions: CreditTransaction[]) => {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return transactions.filter((transaction) => {
    const createdAt = new Date(transaction.createdAt);
    return createdAt >= lastMonth && createdAt < nextMonth;
  });
};

const chartConfig = {
  views: {
    label: "Visualizações",
  },
  sms: {
    label: "sms",
    color: "hsl(var(--chart-1))",
  },
  email: {
    label: "email",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

function ChartButton({ chart, active, label, onClick, value }: { chart: string, onClick: () => void, label: string, value: number, active: boolean }) {
  return (
    <button
      key={chart}
      data-active={active}
      className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
      onClick={onClick}>
      <span className="text-xs text-muted-foreground">
        {label}
      </span>
      <span className="text-lg font-bold leading-none sm:text-3xl">
        {value.toLocaleString("pt-br")}
      </span>
    </button>
  );
}

export function Chart({
  className,
  transactions,
  loading,
}: {
  className: string;
  loading?: boolean;
  transactions: CreditTransaction[];
}) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("sms");

  const chartData = React.useMemo(() => {
    const lastMonthTransactions = filterLastMonthTransactions(transactions);
    return formatData(lastMonthTransactions);
  }, [transactions]);

  const total = React.useMemo(() => {
    return {
      sms: chartData.reduce((acc, curr) => acc + curr.sms, 0),
      email: chartData.reduce((acc, curr) => acc + curr.email, 0),
    };
  }, [chartData]);

  return (
    <Card>
      <CardHeader
        className={cn(
          "flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row",
          className
        )}>
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Envios mensais</CardTitle>
          <CardDescription>
            Mostrando envios de mensagens enviadas no último mês
          </CardDescription>
        </div>
        <div className="flex">
          {["sms", "email"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <ChartButton 
                active={activeChart === chart}
                chart={chart}
                label={chartConfig[chart].label}
                onClick={() => setActiveChart(chart)}
                value={total[key as keyof typeof total]}
              />
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {loading ? (
          <div className="h-60 w-full flex justify-center items-center">
            <p className="mx-2">Aguarde...</p>
            <SpinLoader />
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="views"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                  />
                }
              />
              <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
