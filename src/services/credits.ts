import { OracleTrackApi } from "./instances/oracle-track.api";

export interface CreditTransaction {
  name: string;
  createdAt: string;
  ammount: number;
}

export async function getCredits() {
  return await OracleTrackApi.get<number>("credits");
}

export async function getCreditsUsage() {
  return await OracleTrackApi.get<CreditTransaction[]>("credits/batches");
}