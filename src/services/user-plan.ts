import { OracleTrackApi } from "./instances/oracle-track.api";

const mockPaymentInfo = {
  recurring: true,
  method: "pix",
  gateway: "manual",
  installments: 1,
};

export async function getUserPlan() {
  return await OracleTrackApi.get<UserPlan>("userPlans");
}

export async function purchasePlan(planName: string) {
  return await OracleTrackApi.post<UserPlan>("checkout/subscribe/plan", {
    ...mockPaymentInfo,
    planName,
  });
}

export async function exchangePlan(exchangePlanName: string) {
  return await OracleTrackApi.post<UserPlan>("checkout/exchange/plan", {
    ...mockPaymentInfo,
    exchangePlanName,
  });
}
