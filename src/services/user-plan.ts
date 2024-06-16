import { OracleTrackApi } from "./instances/oracle-track.api";

export async function getUserPlan(active = false) {
  return await OracleTrackApi.get<UserPlan>("userPlan/status", {
    params: { active }
  });
}

export async function purchasePlan(planName: string) {
  return await OracleTrackApi.post<UserPlan>("userPlan/purchase", {
    planName,
  });
}
