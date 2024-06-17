import { OracleTrackApi } from "./instances/oracle-track.api";

interface OtpResponse {
  dueDate: Date;
  hash: string;
}

export async function signin(email: string, password: string) {
  return await OracleTrackApi.post<OtpResponse>(
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

export async function getUserInfo() {
  return await OracleTrackApi.get<UserJWT | null>("auth/live")
    .then(({ data }) => data)
    .catch(() => null);
}

export async function signinUp(name: string, email: string, password: string) {
  return await OracleTrackApi.post<boolean>("user/create", {
    name,
    email,
    password,
  })
    .then(() => true)
    .catch(() => false);
}
