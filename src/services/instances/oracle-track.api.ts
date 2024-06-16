import axios from "axios";

export const OracleTrackApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ORACLE_API_URL || "http://localhost:4000",
  withCredentials: true,
});
