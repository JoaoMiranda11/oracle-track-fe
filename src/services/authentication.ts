import { OracleTrackApi } from "./instances/oracle-track.api";

export async function signin(email: string, password: string) {
  return await OracleTrackApi.post<string>(
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

export async function validateOtp(email: string, otp: string) {
  return await OracleTrackApi.post<UserJWT>("auth/otp", {
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
