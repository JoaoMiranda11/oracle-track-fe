"use client";

import { SpinLoader } from "@/components/feedbacks/loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditTransaction } from "@/services/credits";

export function LastTransactions({
  transactions,
  loading,
}: {
  loading?: boolean;
  transactions: CreditTransaction[];
}) {
  return (
    <Card x-chunk="dashboard-01-chunk-5">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Últimas transações</CardTitle>
          <CardDescription>
            Transações recentes dos seus créditos
          </CardDescription>
        </div>
        {/* <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="#">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button> */}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Compra</TableHead>
              <TableHead className="text-right">Créditos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell>
                  <SpinLoader />
                </TableCell>
              </TableRow>
            ) : (
              transactions.slice(0, 3).map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="font-medium">{transaction.name}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {new Date(transaction.createdAt).toLocaleString("pt-br")}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {transaction.ammount}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
