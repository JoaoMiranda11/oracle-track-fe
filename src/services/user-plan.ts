import { OracleTrackApi } from "./instances/oracle-track.api";

export async function getUserPlan() {
  return await OracleTrackApi.get<UserPlan>("userPlan/status");
}

export async function purchasePlan(planName: string) {
  return await OracleTrackApi.post<UserPlan>("userPlan/purchase", {
    planName,
  });
}
