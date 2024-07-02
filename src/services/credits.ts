import { OracleTrackApi } from "./instances/oracle-track.api";

export async function getCredits() {
  return await OracleTrackApi.get<number>("user/credits");
}
