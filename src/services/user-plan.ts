import { OracleTrackApi } from "./instances/oracle-track.api";

const mockPaymentInfo = {
  recurring: true,
  method: "pix",
  gateway: "manual",
  installments: 1,
};

export interface Plan {
  _id: string;
  credits: number;
  description: string;
  name: string;
  price: number;
  duration: number;
  tier: number;
}

export async function getUserPlan() {
  return await OracleTrackApi.get<UserPlan>("userPlans/current");
}

export async function purchasePlan(planName: string) {
  return await OracleTrackApi.post<UserPlan>("checkout/subscribe/plan", {
    ...mockPaymentInfo,
    planName,
  });
}

export async function getAllPlans() {
  return await OracleTrackApi.get<Plan[]>("userplans")
    .then(({ data }) => data)
}
