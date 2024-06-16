import axios from "axios";

export const OracleTrackApi = axios.create({
  baseURL: process.env.ORACLE_API_URL || "http://localhost:4000",
  withCredentials: true,
});
