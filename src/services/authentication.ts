import { OracleTrackApi } from "./instances/oracle-track.api";

interface OtpResponse {
  dueDate: Date;
  hash: string;
}

export async function signin(email: string, password: string) {
  return await OracleTrackApi.post<OtpResponse | string>(
    "auth/signin",
    {},
    {
      params: {
        email,
        password,
      },
    }
  );
}

export async function validateOtp(email: string, otp: string, hash: string) {
  return await OracleTrackApi.post<string>("auth/otp", {
    hash,
    email,
    otp,
  });
}

export async function isAlive() {
  return await OracleTrackApi.get("auth/live");
}
